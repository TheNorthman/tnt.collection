// TNT debug system - separate module, no console output by default
(function () {
    const LEVELS = {
        error: 1,
        warn: 2,
        info: 3
    };

    const LEVEL_META = {
        error: { label: 'ERROR', emoji: '❌', color: '#ff8a8a' },
        warn: { label: 'WARN', emoji: '⚠️', color: '#ffe080' },
        info: { label: 'INFO', emoji: 'ℹ️', color: '#8ec5ff' }
    };

    function formatTime(ts = Date.now()) {
        const date = new Date(ts);
        const pad = (n) => `${n}`.padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function normalizeLevel(level) {
        if (typeof level === 'string') {
            const key = level.toLowerCase();
            if (LEVELS[key]) return key;
            const parsed = parseInt(level, 10);
            if (!isNaN(parsed)) {
                if (parsed <= 1) return 'error';
                if (parsed === 2) return 'warn';
                return 'info';
            }
        }

        if (typeof level === 'number') {
            if (level <= 1) return 'error';
            if (level === 2) return 'warn';
            return 'info';
        }

        return 'info';
    }

    function levelToPriority(level) {
        return LEVELS[normalizeLevel(level)] || LEVELS.info;
    }

    function buildCollapsedHtml(state) {
        const lastEntry = state.entries[state.entries.length - 1];
        const lastMessage = lastEntry ? `${lastEntry.emoji} ${lastEntry.message}` : 'No logs yet';
        const truncated = lastMessage.length > 40 ? `${lastMessage.slice(0, 37)}...` : lastMessage;
        return `
            <div id="tntDebugBar" class="tnt_debug_bar" title="Click to expand">
                <span class="tnt_debug_summary">${tnt.debug.escapeHtml(truncated)}</span>
                <span class="tnt_debug_counts">(${state.entries.length}) ❌:${state.counts.error} ⚠️:${state.counts.warn} ℹ️:${state.counts.info}</span>
                <span class="tnt_debug_actions">
                    <button id="tntDebugCopy" class="tnt_debug_icon" title="Copy log">📋</button>
                    <button id="tntDebugExpand" class="tnt_debug_icon" title="Expand log">⬆️</button>
                </span>
            </div>`;
    }

    function buildPanelHtml(state) {
        const total = state.entries.length;
        const items = [...state.entries]
            .filter((entry) => state.filter === 'all' || entry.level === state.filter)
            .map((entry) => {
                const cls = `tnt_debug_entry tnt_debug_entry_${entry.level}`;
                return `
                    <div class="${cls}" title="${tnt.debug.escapeHtml(entry.message)}">
                        <span class="tnt_debug_entry_ts">${entry.ts}</span>
                        <span class="tnt_debug_entry_lvl" style="color:${LEVEL_META[entry.level].color};">${LEVEL_META[entry.level].emoji}</span>
                        <span class="tnt_debug_entry_msg">${tnt.debug.escapeHtml(entry.message)}</span>
                    </div>`;
            })
            .join('');

        const buttons = ['all', 'error', 'warn', 'info'].map((filterKey) => {
            const active = state.filter === filterKey ? ' active' : '';
            const count = filterKey === 'all' ? total : state.counts[filterKey];
            return `<button class="tnt_debug_filter_btn${active}" data-filter="${filterKey}">${filterKey.toUpperCase()} (${count})</button>`;
        }).join('');

        return `
            <div id="tntDebugPanel" class="tnt_debug_panel">
                <div class="tnt_debug_title">TNT Debug Log</div>
                <div class="tnt_debug_filters">${buttons}</div>
                <div id="tntDebugList" class="tnt_debug_list">${items}</div>
                <div class="tnt_debug_panel_actions">
                    <button id="tntDebugClear">Clear</button>
                    <button id="tntDebugCopy">Copy</button>
                </div>
            </div>`;
    }

    function ensureContainer() {
        if ($('#tntDebugContainer').length === 0) {
            $('body').append('<div id="tntDebugContainer"></div>');
        }
    }

    tnt.debug = {
        state: {
            entries: [],
            counts: { error: 0, warn: 0, info: 0 },
            enabled: true,
            level: 3,
            expanded: false,
            filter: 'all',
            maxEntries: 500,
            autoScrollLocked: false
        },

        escapeHtml(str) {
            if (typeof str !== 'string') return str;
            return str.replace(/[&"'<>]/g, (tag) => ({
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#39;',
                '<': '&lt;',
                '>': '&gt;'
            })[tag]);
        },

        init() {
            const raw = tnt.settings.get('debug', { enable: true, level: 3 });
            this.state.enabled = !!raw.enable;
            this.state.level = Number(raw.level || 3);
            this.state.filter = 'all';
            this.state.autoScrollLocked = false;

            ensureContainer();
            this.render();

            this.attachEvents();
            return this;
        },

        isLevelEnabled(level) {
            if (!this.state.enabled) return false;
            return levelToPriority(level) <= this.state.level;
        },

        log(firstArg, secondArg, thirdArg = null) {
            let level;
            let message;

            if ((typeof firstArg === 'string' || typeof firstArg === 'number') && secondArg !== undefined) {
                // Common signature: log(message, level) OR log(level, message)
                if (typeof secondArg === 'string' || typeof secondArg === 'object') {
                    message = firstArg;
                    level = secondArg;
                } else {
                    // secondArg is number-type level
                    message = firstArg;
                    level = secondArg;
                }
            } else if ((typeof firstArg === 'number' || typeof firstArg === 'string') && secondArg === undefined) {
                // log(message) or log(level) rare case
                if (typeof firstArg === 'string' && /^(error|warn|info)$/i.test(firstArg)) {
                    message = '';
                    level = firstArg;
                } else {
                    message = firstArg;
                    level = 'info';
                }
            } else {
                message = firstArg;
                level = secondArg || thirdArg || 'info';
            }

            // If called with mixed ordering like log(1, 'msg')
            if ((typeof firstArg === 'number' || /^(error|warn|info)$/i.test(String(firstArg))) && typeof secondArg === 'string') {
                level = firstArg;
                message = secondArg;
            }

            const norm = normalizeLevel(level);
            if (!this.isLevelEnabled(norm)) return;

            const entry = {
                ts: formatTime(),
                level: norm,
                emoji: LEVEL_META[norm].emoji,
                message: typeof message === 'object' ? JSON.stringify(message) : String(message),
                raw: message
            };

            this.state.entries.push(entry);
            this.state.counts[norm] += 1;

            if (this.state.entries.length > this.state.maxEntries) {
                const overflow = this.state.entries.length - this.state.maxEntries;
                const removed = this.state.entries.splice(0, overflow);
                removed.forEach((item) => {
                    this.state.counts[item.level] = Math.max(0, this.state.counts[item.level] - 1);
                });
            }

            this.render();
        },

        info(msg) { this.log('info', msg); },
        warn(msg) { this.log('warn', msg); },
        error(msg) { this.log('error', msg); },

        dir(obj) { this.log('info', obj); },

        clear() {
            this.state.entries = [];
            this.state.counts = { error: 0, warn: 0, info: 0 };
            this.state.autoScrollLocked = false;
            this.render();
        },

        copy() {
            const text = this.state.entries.map((entry) => `${entry.ts} ${entry.emoji} ${entry.message}`).join('\n');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {});
            } else {
                const el = $('<textarea style="position:absolute;left:-9999px;top:0;"></textarea>');
                $('body').append(el);
                el.val(text).select();
                document.execCommand('copy');
                el.remove();
            }
        },

        setFilter(filter) {
            if (![ 'all', 'error', 'warn', 'info' ].includes(filter)) return;
            this.state.filter = filter;
            this.render();
        },

        setLevel(level) {
            this.state.level = Number(level);
            tnt.settings.set('debug', { enable: this.state.enabled, level: this.state.level });
            this.render();
        },

        setEnabled(enabled) {
            this.state.enabled = Boolean(enabled);
            tnt.settings.set('debug', { enable: this.state.enabled, level: this.state.level });
            this.render();
        },

        toggleExpand() {
            this.state.expanded = !this.state.expanded;
            this.render();
        },

        renderCollapsed() {
            ensureContainer();
            // Keep panel hidden while collapsed
            $('#tntDebugContainer').html(`
                <div id="tntDebugCollapsed">${buildCollapsedHtml(this.state)}</div>
            `);
        },

        renderExpanded() {
            ensureContainer();
            // Show panel and always keep debug bar visible below it
            $('#tntDebugContainer').html(`
                <div id="tntDebugExpanded">${buildPanelHtml(this.state)}</div>
                <div id="tntDebugCollapsed">${buildCollapsedHtml(this.state)}</div>
            `);

            const $list = $('#tntDebugList');
            if (!this.state.autoScrollLocked) {
                $list.scrollTop($list.prop('scrollHeight'));
            }

            $list.off('scroll').on('scroll', () => {
                const atBottom = $list.prop('scrollHeight') - $list.scrollTop() - $list.outerHeight() < 4;
                this.state.autoScrollLocked = !atBottom;
            });
        },

        render() {
            if (!this.state.enabled) {
                $('#tntDebugContainer').remove();
                return;
            }

            if (this.state.expanded) {
                this.renderExpanded();
            } else {
                this.renderCollapsed();
            }
        },

        attachEvents() {
            ensureContainer();

            $(document).off('click', '#tntDebugBar, #tntDebugExpand').on('click', '#tntDebugBar, #tntDebugExpand', () => {
                this.state.expanded = !this.state.expanded;
                this.render();
            });

            $(document).off('click', '#tntDebugCopy').on('click', '#tntDebugCopy', (e) => {
                e.stopPropagation();
                this.copy();
            });

            $(document).off('click', '#tntDebugClear').on('click', '#tntDebugClear', (e) => {
                e.stopPropagation();
                this.clear();
            });

            $(document).off('click', '.tnt_debug_filter_btn').on('click', '.tnt_debug_filter_btn', (e) => {
                const filter = $(e.currentTarget).data('filter');
                this.setFilter(filter);
            });
        }
    };
})();