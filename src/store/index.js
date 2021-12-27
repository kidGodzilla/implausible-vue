import { createStore } from "vuex";

function daysAgo(n) {
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
}

export default createStore({
    state () {
        return {
            domains: [],
            host: 'meetingroom365.com',
            start: daysAgo(0),
            end: daysAgo(0)
        }
    },
    getters: {
        domains: state => state.domains,
        host: state => state.host,
        start: state => state.start,
        end: state => state.end
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
        }
    },
});


