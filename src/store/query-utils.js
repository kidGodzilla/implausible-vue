import { createDbWorker } from "sql.js-httpvfs";
const workerUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
const wasmUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

// let url = (location.hostname === 'localhost' ? `${ location.protocol }//${ location.host }` : `${ location.protocol }//analytics.serv.rs`) + `/analytics.sqlite3`;
// let url = `${ location.protocol }//${ location.hostname === 'localhost' ? location.host : 'implausible.b-cdn.net' }/analytics.sqlite3`;
// let url = `${ location.protocol }//implausible.b-cdn.net/analytics.sqlite3`;
// let url = null;

const randomString = () => Math.random().toString(36).substr(2, 9);

let creatingWorker = 0;

async function createOneWorker() {
    if (window._worker) return window._worker;

    if (creatingWorker) {
        return new Promise((resolve, reject) => {
            function waitForWorker() {
                setTimeout(() => {
                    if (window._worker) {
                        resolve(window._worker);
                        return;
                    }
                    waitForWorker();
                    // reject(new Error('Worker failed to load'));
                }, 50);
            }
            waitForWorker();
        });
    }

    creatingWorker = 1;

    async function createWorker() {
        const worker = await createDbWorker([{
                from: "inline",
                config: {
                    serverMode: "full",
                    url: `${ location.protocol }//${ location.host }/analytics.sqlite3`,
                    requestChunkSize: (1024 * 32)
                }
            }],
            workerUrl.toString(),
            wasmUrl.toString()
        );
        return worker;
    }

    window._worker = await createWorker();

    return window._worker;
}

export async function query(string) {
    let worker = await createOneWorker();

    let s = randomString();
    console.time('query time '+s);

    let result = await worker.db.query(string);

    console.log('query', string, result);
    console.timeEnd('query time '+s);

    return result;
}

function isoDate(d) {
    if (!d) d = new Date();
    if (typeof d !== 'object' || !d.toISOString) d = new Date(d);
    return d.toISOString().slice(0,10);
}

export function whereClauseComponents(store) {
    let components = [];

    if (store.state.host) components.push(`host = '${ store.state.host }'`);
    if (store.state.start && store.state.end) components.push(`date BETWEEN '${ isoDate( store.state.start ) }' AND '${ isoDate( store.state.end ) }'`);

    return (components.length ? ` WHERE ` : '') + (components.join(' AND ') || '');
}

export async function queryDomains(store) {
    let res = await query(`SELECT DISTINCT host FROM visits`), domains = [];
    res.forEach(item => domains.push(item.host));
    domains.sort();

    domains = domains.filter(domain => !domain.includes('localhost'));

    // console.log('domains', domains);
    store.commit('setDomains', domains);
    return domains;
}

export async function queryLoadTimes(store) {
    let sql = `SELECT pathname, AVG(load_time) as AvgLoadTime from visits${ whereClauseComponents(store) } GROUP BY pathname ORDER BY AvgLoadTime DESC LIMIT 10;`;
    let res = await query(sql);

    // console.log('queryLoadTimes:', sql, res);
    return res;
}

export async function queryCounts(store, column = 'hour', max = 10) {
    let isTimeseries = column === 'hour' || column === 'date';
    let orderByValue = isTimeseries ? column : `count(*)`;
    let direction = isTimeseries ? 'ASC' : 'DESC';
    let limit = isTimeseries ? '' : ` LIMIT ${ max }`;

    let sql = `SELECT ${ column }, count(*) FROM visits${ whereClauseComponents(store) } GROUP BY ${ column } ORDER BY ${ orderByValue } ${ direction }${ limit };`;
    let res = await query(sql);

    // console.log('queryCounts:', sql, res);
    return res;
}