// City list sorter module
// Sorts city rows within table(s) under a given root selector.
// Keeps non-city rows in place (e.g., headers/footers/total rows) and only reorders detected city rows.

tnt.cityListSorter = {
    defaultOptions: {
        sortBy: 'name', // 'name' or 'id'
        direction: 'asc', // 'asc' or 'desc'
        extraCityRowClass: 'city',
        excludeRowClass: 'total'
    },

    sort(rootSelector, options = {}) {
        const opts = Object.assign({}, this.defaultOptions, options || {});
        if (!rootSelector) {
            return false;
        }

        const $root = (typeof rootSelector === 'string') ? $(rootSelector) : $(rootSelector);
        if (!$root || !$root.length) {
            return false;
        }

        $root.each((_, rootEl) => {
            const $rootEl = $(rootEl);
            const $tables = $rootEl.is('table') ? $rootEl : $rootEl.find('table');

            $tables.each((_, tableEl) => {
                this.sortTable($(tableEl), opts);
            });
        });

        return true;
    },

    sortTable($table, options) {
        if (!$table || !$table.length) {
            return;
        }

        const $tbody = $table.children('tbody').length ? $table.children('tbody') : $table;
        const $rows = $tbody.children('tr');
        if (!$rows.length) {
            return;
        }

        const cityRows = [];
        const cityRowIndices = new Set();

        $rows.each((idx, rowEl) => {
            const $row = $(rowEl);
            if (this.isCityRow($row, options)) {
                cityRows.push({ $row, index: idx });
                cityRowIndices.add(idx);
            }
        });

        if (cityRows.length <= 1) {
            return; // nothing to sort
        }

        const sortedCityRows = cityRows.slice().sort((a, b) => {
            const result = this.compareRows(a.$row, b.$row, options);
            return result !== 0 ? result : a.index - b.index;
        }).map(item => item.$row);

        const finalRows = [];
        let sortedIndex = 0;

        $rows.each((idx, rowEl) => {
            if (cityRowIndices.has(idx)) {
                finalRows.push(sortedCityRows[sortedIndex++]);
            } else {
                finalRows.push($(rowEl));
            }
        });

        $tbody.empty();
        finalRows.forEach($row => $tbody.append($row));
    },

    isCityRow($row, options) {
        if (!$row || !$row.length) return false;

        if ($row.hasClass(options.excludeRowClass) || $row.find(`.${options.excludeRowClass}`).length) {
            return false;
        }

        if ($row.is('[data-city-id]')) {
            return true;
        }

        const $cityCell = $row.find('td.city').first();
        if ($cityCell.length > 0) {
            if ($cityCell.find('a[href*="view=city"], a[href*="cityId="]').length > 0) {
                return true;
            }
            const id = $cityCell.attr('id');
            if (id && /^js_city\d+_name$/.test(id)) {
                return true;
            }
        }

        const hasCityLinkInside = $row.find('a[href*="view=city"], a[href*="cityId="]').length > 0;
        if (hasCityLinkInside) {
            return true;
        }

        // fallback for city names without links but with city class
        if ($row.find('td.city').length > 0) {
            return true;
        }

        return false;
    },

    compareRows($a, $b, options) {
        if (!($a && $a.length && $b && $b.length)) return 0;

        const direction = (options.direction === 'desc') ? -1 : 1;

        if (options.sortBy === 'id') {
            const aId = this.extractCityId($a) || 0;
            const bId = this.extractCityId($b) || 0;
            return direction * (aId - bId);
        }

        const aName = (this.extractCityName($a) || '').toLowerCase();
        const bName = (this.extractCityName($b) || '').toLowerCase();

        if (aName < bName) return -1 * direction;
        if (aName > bName) return 1 * direction;
        return 0;
    },

    extractCityName($row) {
        if (!$row || !$row.length) return null;

        const $link = $row.find('a[href*="view=city"], a[href*="cityId="]').first();
        if ($link.length) {
            return $.trim($link.text());
        }

        const $cityCell = $row.find('td.city').first();
        if ($cityCell.length) {
            return $.trim($cityCell.text());
        }

        const text = $.trim($row.text());
        return text || null;
    },

    extractCityId($row) {
        if (!$row || !$row.length) return null;

        if ($row.is('[data-city-id]')) {
            const value = $row.attr('data-city-id');
            const n = parseInt(value, 10);
            return Number.isNaN(n) ? null : n;
        }

        const $link = $row.find('a[href*="cityId="]').first();
        if ($link.length) {
            const href = $link.attr('href') || '';
            const m = href.match(/[?&]cityId=(\d+)/);
            if (m) {
                const n = parseInt(m[1], 10);
                return Number.isNaN(n) ? null : n;
            }
        }

        const $cityCell = $row.find('td.city').first();
        if ($cityCell.length) {
            const id = $cityCell.attr('id');
            const m = id && id.match(/^js_city(\d+)_name$/);
            if (m) {
                const n = parseInt(m[1], 10);
                return Number.isNaN(n) ? null : n;
            }
        }

        return null;
    }
};
