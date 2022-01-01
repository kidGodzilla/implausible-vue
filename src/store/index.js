import { createStore } from "vuex";

function daysAgo(n) {
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
}

export default createStore({
    state () {
        return {
            domains: [],
            host: '',
            start: daysAgo(0),
            end: daysAgo(0),
            range: '1',
            rangeString: 'Latest',
        }
    },
    getters: {
        domains: state => state.domains,
        host: state => state.host,
        start: state => state.start,
        end: state => state.end,
        range: state => state.range,
        rangeString: state => state.rangeString,
    },
    mutations: {
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
        setRangeString (state, rangeString) {
            state.rangeString = rangeString;
        },
        setRange (state, range) {
            const ranges = {
                '-1': ['Yesterday', 1, 1],
                '1': ['Latest', 0, 0],
                '7': ['Last 7 Days', 7, 0],
                '30': ['Last 30 Days', 30, 0]
            };

            const values = ranges[range || '1'];

            state.rangeString = values[0];
            state.start = daysAgo(values[1]);
            state.end = daysAgo(values[2]);
            state.range = range || '1';

            let targetSearch = `?host=${ state.host }&range=${ range || '1' }`;
            if (location.search !== targetSearch) window.history.pushState('', '', targetSearch);
        },
    },
});


