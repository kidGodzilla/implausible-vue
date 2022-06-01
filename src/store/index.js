import { createStore } from "vuex";

function daysAgo(n) {
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
}

export default createStore({
    state () {
        return {
            publicKey: '',
            domains: [],
            host: '',
            key: '',
            start: daysAgo(0),
            end: daysAgo(0),
            range: '1',
            rangeString: 'Latest',
            liveVisitors: 0,
            showVisitors: true,
            summary: {},
            dark: false,
        }
    },
    getters: {
        domains: state => state.domains,
        dark: state => state.dark,
        key: state => state.key,
        publicKey: state => state.publicKey,
        host: state => state.host,
        start: state => state.start,
        end: state => state.end,
        range: state => state.range,
        rangeString: state => state.rangeString,
        liveVisitors: state => state.liveVisitors,
        showVisitors: state => state.showVisitors,
        summary: state => state.summary,
    },
    mutations: {
        setDark (state, bool) {
            state.dark = bool;
        },
        setKey (state, key) {
            state.key = key;
        },
        setPublicKey (state, key) {
            state.publicKey = key;
        },
        setDomains (state, domains) {
            state.domains = domains;
        },
        setHost (state, host) {
            state.host = host;
        },
        setStart (state, start) {
            state.start = start;
        },
        setEnd (state, end) {
            state.end = end;
        },
        setLiveVisitors (state, count) {
            state.liveVisitors = count;
        },
        setShowVisitors (state, bool) {
            state.showVisitors = bool;
        },
        setSummary (state, o) {
            state.summary = o;
        },
        setRangeString (state, rangeString) {
            state.rangeString = rangeString;
        },
        setRange (state, range) {
            if (!range) range = '1';
            const ranges = {
                '-1': ['Yesterday', 1, 1],
                '1': ['Latest', 0, 0],
                '7': ['Last 7 Days', 7, 0],
                '14': ['1 week ago', 14, 7],
                '21': ['2 weeks ago', 21, 14],
                '28': ['3 weeks ago', 28, 21],
                '30': ['Last 30 Days', 30, 0]
            };

            let values = ranges[range];

            // Daily: -2,-3,-4,-5,-6,-7..-31
            if (range < -1 && range > -32) {
                let val = range * -1;
                values = [`${ new Date(daysAgo(val)).toDateString() }`, val, val];
            }

            // Monthly: 2022-05
            if (range.length === 7) {
                values = [`${ range }`, range, range];
            }

            // Annual: 2022
            if (range > 1000 && range < 3000) {
                values = [`${ range }`, range, range];
            }

            state.rangeString = values[0];
            state.start = daysAgo(values[1]);
            state.end = daysAgo(values[2]);

            if (parseInt(range) == range) range = parseInt(range);
            state.range = range;

            let targetSearch = `?host=${ state.host }&range=${ range }`;
            if (location.search !== targetSearch) window.history.pushState('', '', targetSearch);
        },
    },
});


