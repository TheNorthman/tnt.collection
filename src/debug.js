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
            <span class="tnt_debug_summary">${tnt.debug.escapeHtml(truncated)}</span>
            <span class="tnt_debug_counts">(${state.entries.length}) ❌:${state.counts.error} ⚠️:${state.counts.warn} ℹ️:${state.counts.info}</span>
            <span class="tnt_debug_actions">
                <button id="tntDebugCopyBar" class="tnt_debug_icon tnt_debug_copy" title="Copy log">📋</button>
                <button id="tntDebugExpandBar" class="tnt_debug_icon" title="Expand log">⬆️</button>
            </span>`;
    }

    function buildFilterButtons(state) {
        const total = state.entries.length;
        return ['all', 'error', 'warn', 'info'].map((filterKey) => {
            const active = state.filter === filterKey ? ' active' : '';
            const count = filterKey === 'all' ? total : state.counts[filterKey];
            return `<button class="tnt_debug_filter_btn${active}" data-filter="${filterKey}">${filterKey.toUpperCase()} (${count})</button>`;
        }).join('');
    }

    function buildPanelHtml(state) {
        const items = state.entries
            .filter((entry) => state.filter === 'all' || entry.level === state.filter)
            .map((entry) => {
                const cls = `tnt_debug_entry tnt_debug_entry_${entry.level}`;
                return `
                    <div class="${cls}" title="${tnt.debug.escapeHtml(entry.message)}" data-entry-id="${entry.id}">
                        <span class="tnt_debug_entry_ts">${entry.ts}</span>
                        <span class="tnt_debug_entry_lvl" style="color:${LEVEL_META[entry.level].color};">${LEVEL_META[entry.level].emoji}</span>
                        <span class="tnt_debug_entry_msg">${tnt.debug.escapeHtml(entry.message)}</span>
                    </div>`;
            })
            .join('');

        return `
            <div class="tnt_debug_title">TNT Debug Log</div>
            <div id="tntDebugList" class="tnt_debug_list">${items}</div>
            <div class="tnt_debug_footer">
                <div class="tnt_debug_filters">${buildFilterButtons(state)}</div>
                <div class="tnt_debug_panel_actions">
                    <button id="tntDebugClearPanel" class="tnt_debug_clear" title="Clear log">Clear</button>
                    <button id="tntDebugCopyPanel" class="tnt_debug_copy" title="Copy log">Copy</button>
                </div>
            </div>`;
    }

    function createEntryElement(entry) {
        const div = document.createElement('div');
        div.className = `tnt_debug_entry tnt_debug_entry_${entry.level}`;
        div.title = entry.message;
        div.dataset.entryId = entry.id;
        div.innerHTML = `
            <span class="tnt_debug_entry_ts">${entry.ts}</span>
            <span class="tnt_debug_entry_lvl" style="color:${LEVEL_META[entry.level].color};">${LEVEL_META[entry.level].emoji}</span>
            <span class="tnt_debug_entry_msg">${tnt.debug.escapeHtml(entry.message)}</span>`;
        return div;
    }

    const DEFAULT_DEBUG_SETTINGS = { enable: true, level: 3 };

    function ensureContainer() {
        if ($('#tntDebugContainer').length === 0) {
            $('body').append('<div id="tntDebugContainer"><div id="tntDebugPanel" class="tnt_debug_panel"></div><div id="tntDebugBar" class="tnt_debug_bar"></div></div>');
        }

        tnt.debug.$container = document.getElementById('tntDebugContainer');
        tnt.debug.$bar = document.getElementById('tntDebugBar');
        tnt.debug.$panel = document.getElementById('tntDebugPanel');
    }

    tnt.debug = {
        state: {
            entries: [],
            counts: { error: 0, warn: 0, info: 0 },
            enabled: DEFAULT_DEBUG_SETTINGS.enable,
            level: DEFAULT_DEBUG_SETTINGS.level,
            expanded: false,
            filter: 'all',
            maxEntries: 500,
            autoScrollLocked: false,
            nextEntryId: 1
        },

        panelInitialized: false,

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
            const raw = tnt.settings.get('debug', DEFAULT_DEBUG_SETTINGS);
            this.state.enabled = !!raw.enable;
            this.state.level = Number(raw.level || DEFAULT_DEBUG_SETTINGS.level);
            this.state.filter = 'all';
            this.state.autoScrollLocked = false;

            ensureContainer();

            // fix blank panel / black line: keep panel hidden until expanded
            if (this.$panel) {
                this.$panel.style.display = 'none';
            }
            if (this.$bar) {
                this.$bar.style.display = 'flex';
            }
            if (this.$container) {
                this.$container.style.display = 'block';
            }

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
                if (typeof secondArg === 'string' || typeof secondArg === 'object') {
                    message = firstArg;
                    level = secondArg;
                } else {
                    message = firstArg;
                    level = secondArg;
                }
            } else if ((typeof firstArg === 'number' || typeof firstArg === 'string') && secondArg === undefined) {
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

            if ((typeof firstArg === 'number' || /^(error|warn|info)$/i.test(String(firstArg))) && typeof secondArg === 'string') {
                level = firstArg;
                message = secondArg;
            }

            const norm = normalizeLevel(level);
            if (!this.isLevelEnabled(norm)) return;

            const entry = {
                id: this.state.nextEntryId++,
                ts: formatTime(),
                level: norm,
                emoji: LEVEL_META[norm].emoji,
                message: typeof message === 'object' ? JSON.stringify(message) : String(message),
                raw: message
            };

            this.state.entries.push(entry);
            this.state.counts[norm] += 1;

            let removedIds = [];
            if (this.state.entries.length > this.state.maxEntries) {
                const overflow = this.state.entries.length - this.state.maxEntries;
                const removed = this.state.entries.splice(0, overflow);
                removedIds = removed.map((item) => item.id);
                removed.forEach((item) => {
                    this.state.counts[item.level] = Math.max(0, this.state.counts[item.level] - 1);
                });
            }

            this.renderBar();

            if (this.state.expanded && this.panelInitialized) {
                this._removeEntriesFromList(removedIds);
                this._appendEntryToList(entry);
                this._updateFilterButtons();
            }
        },

        info(msg) { this.log('info', msg); },
        warn(msg) { this.log('warn', msg); },
        error(msg) { this.log('error', msg); },

        dir(obj) { this.log('info', obj); },

        clear() {
            this.state.entries = [];
            this.state.counts = { error: 0, warn: 0, info: 0 };
            this.state.autoScrollLocked = false;
            this.state.nextEntryId = 1;

            if (this.panelInitialized && this.$list) {
                this.$list.innerHTML = '';
            }

            this._updateFilterButtons();
            this.renderBar();
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
            this.renderBar();

            if (this.state.expanded && this.panelInitialized) {
                this._updatePanelList();
                this._updateFilterButtons();
            }
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

        _removeEntriesFromList(removedIds = []) {
            if (!this.$list || !removedIds.length) return;
            removedIds.forEach((id) => {
                const node = this.$list.querySelector(`[data-entry-id="${id}"]`);
                if (node) node.remove();
            });
        },

        _appendEntryToList(entry) {
            if (!this.$list) return;
            if (this.state.filter !== 'all' && this.state.filter !== entry.level) return;

            this.$list.appendChild(createEntryElement(entry));
            this._trimPanelList();
            if (!this.state.autoScrollLocked) this._scrollListToBottom();
        },

        _trimPanelList() {
            if (!this.$list) return;
            while (this.$list.children.length > this.state.maxEntries) {
                this.$list.removeChild(this.$list.firstChild);
            }
        },

        _scrollListToBottom() {
            if (!this.$list) return;
            this.$list.scrollTop = this.$list.scrollHeight;
        },

        _onListScroll() {
            if (!this.$list) return;
            const atBottom = this.$list.scrollHeight - this.$list.scrollTop - this.$list.clientHeight < 4;
            this.state.autoScrollLocked = !atBottom;
        },

        _bindListScroll() {
            if (!this.$list) return;
            if (this._boundListScrollHandler) {
                this.$list.removeEventListener('scroll', this._boundListScrollHandler);
            }
            this._boundListScrollHandler = this._onListScroll.bind(this);
            this.$list.addEventListener('scroll', this._boundListScrollHandler);
        },

        _updatePanelList() {
            if (!this.$list) return;
            const entries = this.state.entries.filter((entry) => this.state.filter === 'all' || entry.level === this.state.filter);
            this.$list.innerHTML = entries.map((entry) => createEntryElement(entry).outerHTML).join('');

            if (!this.state.autoScrollLocked) this._scrollListToBottom();
        },

        _updateFilterButtons() {
            if (!this.$panel) return;
            const filterContainer = this.$panel.querySelector('.tnt_debug_filters');
            if (filterContainer) {
                filterContainer.innerHTML = buildFilterButtons(this.state);
            }
        },

        renderBar() {
            if (!this.$bar) return;
            this.$bar.innerHTML = buildCollapsedHtml(this.state);
            this.$bar.style.display = 'flex';
        },

        renderCollapsed() {
            if (!this.$container || !this.$bar || !this.$panel) return;
            this.renderBar();
            this.$panel.style.display = 'none';
            this.$container.style.display = 'block';
        },

        renderExpanded() {
            if (!this.$container || !this.$bar || !this.$panel) return;
            this.renderBar();
            this.$panel.style.display = 'flex';
            this.$container.style.display = 'block';

            if (!this.panelInitialized) {
                this.$panel.innerHTML = buildPanelHtml(this.state);
                this.$list = this.$panel.querySelector('#tntDebugList');
                this.panelInitialized = true;
                this._bindListScroll();
            } else {
                this._updateFilterButtons();
                this._updatePanelList();
            }

            if (!this.state.autoScrollLocked) this._scrollListToBottom();
        },

        render() {
            if (!this.state.enabled) {
                if (this.$container) this.$container.style.display = 'none';
                return;
            }

            ensureContainer();

            if (this.state.expanded) {
                this.renderExpanded();
            } else {
                this.renderCollapsed();
            }
        },

        attachEvents() {
            ensureContainer();
            const self = this;

            if (this.$bar) {
                this.$bar.removeEventListener('click', this._barClickHandler);
                this._barClickHandler = (e) => {
                    e.stopPropagation();
                    self.toggleExpand();
                };
                this.$bar.addEventListener('click', this._barClickHandler);
            }

            if (this.$container) {
                this.$container.addEventListener('click', (e) => {
                    const target = e.target;

                    if (target.closest('.tnt_debug_copy')) {
                        e.stopPropagation();
                        self.copy();
                        return;
                    }

                    if (target.closest('.tnt_debug_clear')) {
                        e.stopPropagation();
                        self.clear();
                        return;
                    }

                    if (target.closest('.tnt_debug_filter_btn')) {
                        e.stopPropagation();
                        const filter = target.closest('.tnt_debug_filter_btn').dataset.filter;
                        self.setFilter(filter);
                        return;
                    }
                });
            }
        }
    };
})();