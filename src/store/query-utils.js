import {createDbWorker} from "sql.js-httpvfs";
import { computed } from "vue";
const workerUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
const wasmUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

// import { useStore } from "vuex";
// const store = useStore();
// import store from "../store";
// console.log('query-utils store', store);

const worker = await createDbWorker([{
        from: "inline",
        config: {
            serverMode: "full",
            url: `${ location.protocol }//${ location.host }/analytics.sqlite3`,
            requestChunkSize: 1024
        }
    }],
    workerUrl.toString(),
    wasmUrl.toString()
);

export async function query(string) {
    return await worker.db.query(string);
}

function daysAgo(n) {
    const ago = new Date();
    return ago.setDate(ago.getDate() - n);
}

function isoDate(d) {
    if (!d) d = new Date();
    if (typeof d !== 'object' || !d.toISOString) d = new Date(d);
    return d.toISOString().slice(0,10);
}

// let whereClauseComponents = computed(() => {
//     let components = [];
//
//     if (store.state.host) components.push(`host = '${ store.state.host }'`);
//     if (store.state.start && store.state.end) components.push(`date BETWEEN '${ isoDate( store.state.start ) }' AND '${ isoDate( store.state.end ) }'`);
//
//     return (components.length ? ` WHERE ` : '') + (components.join(' AND ') || '');
// });

const whereClauseComponents = (store) => {
    let components = [];

    if (store.state.host) components.push(`host = '${ store.state.host }'`);
    if (store.state.start && store.state.end) components.push(`date BETWEEN '${ isoDate( store.state.start ) }' AND '${ isoDate( store.state.end ) }'`);

    return (components.length ? ` WHERE ` : '') + (components.join(' AND ') || '');
};

export async function queryDomains(store) {
    console.time('queryDomains');
    let res = await query(`SELECT DISTINCT host FROM visits`), domains = [];
    res.forEach(item => domains.push(item.host));
    domains.sort();

    console.log('domains', domains);
    console.timeEnd('queryDomains');
    store.commit('setDomains', domains);
    return domains;
}

export async function queryCounts(store, column = 'hour') {
    console.time('queryCounts');

    let isTimeseries = column === 'hour' || column === 'date';
    let orderByValue = isTimeseries ? column : `count(*)`;
    let direction = isTimeseries ? 'ASC' : 'DESC';
    let limit = isTimeseries ? '' : ' LIMIT 25';

    let sql = `SELECT ${ column }, count(*) FROM visits${ whereClauseComponents(store) } GROUP BY ${ column } ORDER BY ${ orderByValue } ${ direction }${ limit };`;
    let res = await query(sql);

    console.log('queryCounts:', sql, res);
    console.timeEnd('queryCounts');
    return res;
}