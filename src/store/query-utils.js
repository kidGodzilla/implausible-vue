import CryptoJS from './cryptojs-siv';
import { createDbWorker } from "sql.js-httpvfs";
const workerUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sqlite.worker.js", import.meta.url);
const wasmUrl = new URL("../../node_modules/sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

const randomString = () => Math.random().toString(36).substr(2, 9);

let creatingWorker = 0;

export async function returnDecryptor(store) {
    const SIV = store.state.key ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key)) : null;

    return function decryptor(s) {
        if (SIV) {
            try {
                let decrypted = SIV.decrypt(CryptoJS.enc.Hex.parse(s)).toString(CryptoJS.enc.Utf8);
                if (decrypted && decrypted != 'false') s = decrypted;
            } catch(e){}
        }
        return s;
    }
}

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
                    url: `${ location.protocol }//${ location.host }/analytics.sqlite3.png`,
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

export function isoDate(d) {
    if (!d) d = new Date();
    if (typeof d !== 'object' || !d.toISOString) d = new Date(d);
    return d.toISOString().slice(0,10);
}

export function whereClauseComponents(store, skipDates) {
    let components = [];

    if (store.state.host) components.push(`host = '${ store.state.host }'`);
    if (store.state.host && store.state.key) {
        const SIV = CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key));
        const encrypted_host = SIV.encrypt(store.state.host).toString();
        components[0] = `(${ components[0] } OR host = '${ encrypted_host }')`;
    }
    if (store.state.start && store.state.end && !skipDates) components.push(`date BETWEEN '${ isoDate( store.state.start ) }' AND '${ isoDate( store.state.end ) }'`);

    return (components.length ? ` WHERE ` : '') + (components.join(' AND ') || '');
}

// Since some of these are encrypted, there's no longer a possibility to list all domains in the database
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
    if (!store.state.host) return [];

    const SIV = store.state.key ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key)) : null;

    let sql = `SELECT pathname, AVG(load_time) as AvgLoadTime from visits${ whereClauseComponents(store) } GROUP BY pathname ORDER BY AvgLoadTime DESC LIMIT 10;`;
    let res = await query(sql);

    // console.log('queryLoadTimes:', sql, res);

    if (SIV) {
        res.forEach(row => {
            try {
                let decrypted = SIV.decrypt(CryptoJS.enc.Hex.parse(row.pathname)).toString(CryptoJS.enc.Utf8);
                if (decrypted && decrypted != 'false') row.pathname = decrypted;
            } catch(e){}
        });
    }

    return res;
}

export async function queryCounts(store, column = 'hour', max = 10) {
    if (!store.state.host) return [];

    const SIV = store.state.key ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key)) : null;

    const columnValue = (store.state.showVisitors ? 'count(DISTINCT ip)' : 'count(*)');
    // console.log('columnValue', columnValue, store.state.showVisitors);

    let isTimeseries = column === 'hour' || column === 'date';
    let orderByValue = isTimeseries ? column : columnValue;
    let direction = isTimeseries ? 'ASC' : 'DESC';
    let limit = isTimeseries ? '' : ` LIMIT ${ max }`;

    let sql = `SELECT ${ column }, ${ columnValue } FROM visits${ whereClauseComponents(store) } GROUP BY ${ column } ORDER BY ${ orderByValue } ${ direction }${ limit };`;
    let res = await query(sql);

    // console.log('queryCounts:', sql, res);

    if (SIV) {
        res.forEach(row => {
            try {
                let decrypted = SIV.decrypt(CryptoJS.enc.Hex.parse(row[column])).toString(CryptoJS.enc.Utf8);
                if (decrypted && decrypted != 'false') row[column] = decrypted;
            } catch(e){}
        });
    }

    return res;
}

export async function querySummary(store, date) {
    let sql = `SELECT * FROM summaries${ whereClauseComponents(store, 1) } AND date ${ (date > 1000 && date < 3000) ? 'LIKE' : '=' } '${ date }${ (date > 1000 && date < 3000) ? '-%' : '' }';`;
    let result = {}, loadTimes = [], res = await query(sql);

    // Merge all data objects
    res.forEach(row => {
        let data = JSON.parse(row.data);

        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'number') {
                if (!result[key]) result[key] = 0;
                result[key] += data[key];

            } else if (key === 'loadTimes') {
                result[key] = [];

                if (!result[key]) result[key] = [];

                loadTimes = loadTimes.concat(data[key]);

                // reduce loadTimes with duplicate pathname as averages
                let unique_pathnames = loadTimes.map(x => x.pathname).filter((value, index, self) => self.indexOf(value) === index);
                unique_pathnames.forEach(pathname => {
                    let matches = loadTimes.filter(x => x.pathname = pathname);
                    let sum = matches.map(match => match.AvgLoadTime).reduce((a, b) => a + b, 0);
                    let avg = sum / matches.length;

                    result[key].push({ pathname, AvgLoadTime: avg });
                });

            } else if (typeof data[key] === 'object') {
                if (!result[key]) result[key] = {};

                Object.keys(data[key]).forEach(k => {
                    if (!result[key][k]) result[key][k] = 0;
                    result[key][k] += data[key][k];
                });
            }
        });
    });

    store.commit('setSummary', result);
}