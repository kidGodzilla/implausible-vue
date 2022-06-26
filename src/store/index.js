import { createStore } from "vuex";

function daysAgo(n) {
    if (n == parseInt(n)) n = parseInt(n);
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
}

function daysAgoCount(d) {
    return Math.floor(((+ new Date()) - (+ new Date(d))) / (25 * 60 * 60 * 1000));
}

function fixSearch(state) {
    let targetSearch = `?host=${ state.host }&range=${ state.range }`;
    if (state.os) targetSearch += `&os=${ state.os }`;
    if (state.path) targetSearch += `&path=${ state.path }`;
    if (state.device) targetSearch += `&device=${ state.device }`;
    if (state.is_bot !== '') targetSearch += `&is_bot=${ state.is_bot }`;
    if (state.is_new !== '') targetSearch += `&is_new=${ state.is_new }`;
    if (state.browser) targetSearch += `&browser=${ state.browser }`;
    if (state.language) targetSearch += `&language=${ state.language }`;
    if (state.referrer) targetSearch += `&referrer=${ state.referrer }`;
    if (state.utm_source !== '') targetSearch += `&utm_source=${ state.utm_source }`;
    if (state.utm_medium !== '') targetSearch += `&utm_medium=${ state.utm_medium }`;
    if (state.utm_campaign !== '') targetSearch += `&utm_campaign=${ state.utm_campaign }`;
    if (state.country !== '') targetSearch += `&country=${ state.country }`;
    if (state.region !== '') targetSearch += `&region=${ state.region }`;
    if (state.city !== '') targetSearch += `&city=${ state.city }`;

    if (state.event !== '') targetSearch += `&event=${ state.event }`;

    if (state.background !== '') targetSearch += `&background=${ state.background }`;
    if (state.theme !== '') targetSearch += `&theme=${ state.theme }`;
    if (state.embed) targetSearch += `&embed=${ state.embed }`;

    if (location.search !== targetSearch) window.history.pushState('', '', targetSearch);
}

export default createStore({
    state () {
        return {
            publicKey: '',
            theme: '',
            embed: false,
            background: '',
            domains: [],
            host: '',
            path: '',
            key: '',
            start: daysAgo(0),
            end: daysAgo(0),
            comparisonStart: daysAgo(0),
            comparisonEnd: daysAgo(0),
            range: '1',
            rangeString: 'Latest',
            liveVisitors: 0,
            showVisitors: true,
            summary: {},
            dark: false,
            os: '',
            device: '',
            is_bot: '',
            is_new: '',
            browser: '',
            language: '',
            referrer: '',
            utm_source: '',
            utm_medium: '',
            utm_campaign: '',
            country: '',
            region: '',
            city: '',
            event: '',
        }
    },
    getters: {
        domains: state => state.domains,
        background: state => state.background,
        embed: state => state.embed,
        theme: state => state.theme,
        dark: state => state.dark,
        key: state => state.key,
        publicKey: state => state.publicKey,
        host: state => state.host,
        path: state => state.path,
        start: state => state.start,
        end: state => state.end,
        comparisonStart: state => state.comparisonStart,
        comparisonEnd: state => state.comparisonEnd,
        range: state => state.range,
        rangeString: state => state.rangeString,
        liveVisitors: state => state.liveVisitors,
        showVisitors: state => state.showVisitors,
        summary: state => state.summary,

        os: state => state.os,
        device: state => state.device,
        is_bot: state => state.is_bot,
        is_new: state => state.is_new,
        browser: state => state.browser,
        language: state => state.language,
        referrer: state => state.referrer,
        utm_source: state => state.utm_source,
        utm_medium: state => state.utm_medium,
        utm_campaign: state => state.utm_campaign,
        country: state => state.country,
        region: state => state.region,
        city: state => state.city,
        event: state => state.event,
    },
    mutations: {
        setDark (state, bool) {
            state.dark = bool;
        },
        setTheme (state, theme) {
            state.theme = theme;
        },
        setEmbed (state, bool) {
            state.embed = bool;
        },
        setBackground (state, background) {
            state.background = background;
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
            fixSearch(state);
        },
        setPath (state, path) {
            state.path = path;
            fixSearch(state);
        },

        setOs (state, os) {
            state.os = os;
            fixSearch(state);
        },
        setDevice (state, device) {
            state.device = device;
            fixSearch(state);
        },
        setIs_bot (state, is_bot) {
            state.is_bot = is_bot;
            fixSearch(state);
        },
        setIs_new (state, is_new) {
            state.is_new = is_new;
            fixSearch(state);
        },
        setBrowser (state, browser) {
            state.browser = browser;
            fixSearch(state);
        },
        setLanguage (state, language) {
            state.language = language;
            fixSearch(state);
        },
        setReferrer (state, referrer) {
            state.referrer = referrer;
            fixSearch(state);
        },
        setUtm_source (state, utm_source) {
            state.utm_source = utm_source;
            fixSearch(state);
        },
        setUtm_medium (state, utm_medium) {
            state.utm_medium = utm_medium;
            fixSearch(state);
        },
        setUtm_campaign (state, utm_campaign) {
            state.utm_campaign = utm_campaign;
            fixSearch(state);
        },
        setCountry (state, country) {
            state.country = country;
            fixSearch(state);
        },
        setRegion (state, region) {
            state.region = region;
            fixSearch(state);
        },
        setCity (state, city) {
            state.city = city;
            fixSearch(state);
        },
        setEvent (state, event) {
            state.event = event;
            fixSearch(state);
        },

        setStart (state, start) {
            state.start = start;
        },
        setEnd (state, end) {
            state.end = end;
        },
        setComparisonStart (state, start) {
            state.comparisonStart = start;
        },
        setComparisonEnd (state, end) {
            state.comparisonEnd = end;
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

            if (parseInt(range) == range) range = parseInt(range);

            // Daily: -2,-3,-4,-5,-6,-7..-31
            if (range < -1 && range > -32) {
                let val = range * -1;
                values = [`${ new Date(daysAgo(val)).toDateString() }`, val, val];
            }

            // Monthly: 2022-05
            if (range.length === 7) {
                let r1 = daysAgoCount(range);
                let D = new Date(range);
                D = D.setMonth(D.getMonth()+1);
                let r2 = daysAgoCount(D);
                if (r2 < 0) r2 = 0;
                values = [`${ range }`, r1, r2];
            }

            // Annual: 2022
            if (range > 1000 && range < 3000) {
                let r1 = daysAgoCount(range+'');
                let D = new Date(range+'');
                D = D.setFullYear(D.getFullYear()+1);
                let r2 = daysAgoCount(D);
                if (r2 < 0) r2 = 0;
                values = [`${ range }`, r1, r2];
            }

            state.rangeString = values[0];
            state.start = daysAgo(values[1]);
            state.end = daysAgo(values[2]);

            // Comparison values
            const diff = state.end - state.start;
            state.comparisonEnd = state.start;
            state.comparisonStart = state.start - diff;

            if (parseInt(range) == range) range = parseInt(range);
            state.range = range;

            fixSearch(state);
        },
    },
});


