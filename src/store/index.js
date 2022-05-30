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
        setRangeString (state, rangeString) {
            state.rangeString = rangeString;
        },
        setRange (state, range) {
            const ranges = {
                '-1': ['Yesterday', 1, 1],
                '1': ['Latest', 0, 0],
                '7': ['Last 7 Days', 7, 0],
                '14': ['1 week ago', 14, 7],
                '21': ['2 weeks ago', 21, 14],
                '28': ['3 weeks ago', 28, 21],
                '30': ['Last 30 Days', 30, 0]
            };

            let values = ranges[range || '1'];

            // SQL-based ranges
            // Daily: -2,-3,-4,-5,-6,-7..-31
            // Weekly: 7, 14, 21, 28

            // Summarized ranges
            // Monthly: 2022-05
            // Annual: 2022

            // Daily: -2,-3,-4,-5,-6,-7..-31
            if (range < -1 && range > -32) {
                let val = range * -1;
                values = [`${ new Date(daysAgo(val)).toDateString() }`, val, val];
            }

            // Monthly: 2022-05
            if (range.length === 7) {
                // Todo
            }

            // Annual: 2022
            if (range > 1000 && range < 3000) {
                // Todo
            }

            state.rangeString = values[0];
            state.start = daysAgo(values[1]);
            state.end = daysAgo(values[2]);
            state.range = range || '1';

            let targetSearch = `?host=${ state.host }&range=${ range || '1' }`;
            if (location.search !== targetSearch) window.history.pushState('', '', targetSearch);
        },
    },
});


