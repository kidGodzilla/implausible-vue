import CryptoJS from "./cryptojs-siv";
import { createDbWorker } from "sql.js-httpvfs";
const workerUrl = new URL(
  "../../node_modules/sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL(
  "../../node_modules/sql.js-httpvfs/dist/sql-wasm.wasm",
  import.meta.url
);

const randomString = () => Math.random().toString(36).substr(2, 9);

let creatingWorker = 0;

export async function returnDecryptor(store) {
  const SIV = store.state.key
    ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key))
    : null;

  return function decryptor(s) {
    if (SIV) {
      try {
        let decrypted = SIV.decrypt(CryptoJS.enc.Hex.parse(s)).toString(
          CryptoJS.enc.Utf8
        );
        if (decrypted && decrypted != "false") s = decrypted;
      } catch (e) {}
    }
    return s;
  };
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
    const worker = await createDbWorker(
      [
        {
          from: "inline",
          config: {
            serverMode: "full",
            url: `${location.protocol}//${location.host}/analytics.sqlite3.png`,
            requestChunkSize: 1024 * 32,
          },
        },
      ],
      workerUrl.toString(),
      wasmUrl.toString()
    );
    return worker;
  }

  window._worker = await createWorker();

  return window._worker;
}

export async function query(string) {
  //CHECK IF BACKEND METHOD IS API
  if (import.meta.env.VITE_BACKEND_METHOD === "api") {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getdata`, {
        method: "POST",
        body: JSON.stringify({
          statement: string,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      let results = JSON.stringify(data);
      let array_of_results = JSON.parse(results);
      return array_of_results;
    } catch (err) {
      let errors = err.message;
      console.log(errors);
    }
  } else {
    let worker = await createOneWorker();

    let s = randomString();
    console.time("query time " + s);

    let result = await worker.db.query(string);

    console.log("query", string, result);
    console.timeEnd("query time " + s);

    // if (window.debug) {
    //     // Analyze query and seek recommended indexes
    //     await worker.db.query(`.expert`);
    //     let expert_recommendation = await worker.db.query(string);
    //     console.warn('Index recommendation for query:', expert_recommendation);
    // }

    return result;
  }
}

export function isoDate(d) {
  if (!d) d = new Date();
  if (typeof d !== "object" || !d.toISOString) d = new Date(d);
  return d.toISOString().slice(0, 10);
}

export function whereClauseComponents(
  store,
  skipDates,
  comparison,
  excludeEvents
) {
  let components = [],
    SIV;

  if (store.state.key) {
    SIV = CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key));
  }

  // Hostname
  if (store.state.host) {
    let ps = `host = '${store.state.host}'`;
    if (SIV) {
      let ps2 = SIV.encrypt(store.state.host).toString();
      ps = `(${ps} OR host = '${ps2}')`;
    }
    components.push(ps);
  }
  // Pathname
  if (store.state.path) {
    let ps = `pathname = '${store.state.path}'`;
    if (SIV) {
      let ps2 = SIV.encrypt(store.state.path).toString();
      ps = `(${ps} OR pathname = '${ps2}')`;
    }
    components.push(ps);
  }

  // referrer
  if (store.state.referrer !== "") {
    let val = store.state.referrer || "";
    let ps = `referer_host = '${val}'`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR referer_host = '${ps2}')`;
    }
    components.push(ps);
  }
  // utm_source
  if (store.state.utm_source !== "") {
    let val = store.state.utm_source || null;
    let ps = val ? `utm_source = '${val}'` : `utm_source is null`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR utm_source = '${ps2}')`;
    }
    components.push(ps);
  }
  // utm_medium
  if (store.state.utm_medium !== "") {
    let val = store.state.utm_medium || null;
    let ps = val ? `utm_medium = '${val}'` : `utm_medium is null`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR utm_medium = '${ps2}')`;
    }
    components.push(ps);
  }
  // utm_campaign
  if (store.state.utm_campaign !== "") {
    let val = store.state.utm_campaign || null;
    let ps = val ? `utm_campaign = '${val}'` : `utm_campaign is null`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR utm_campaign = '${ps2}')`;
    }
    components.push(ps);
  }
  // region
  if (store.state.region !== "") {
    let val = store.state.region || null;
    let ps = val ? `region = '${val}'` : `region is null`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR region = '${ps2}')`;
    }
    components.push(ps);
  }
  // city
  if (store.state.city !== "") {
    let val = store.state.city || null;
    let ps = val ? `city = '${val}'` : `city is null`;
    if (SIV && val) {
      let ps2 = SIV.encrypt(val).toString();
      ps = `(${ps} OR city = '${ps2}')`;
    }
    components.push(ps);
  }

  // Unencrypted filters
  if (store.state.os) components.push(`os = '${store.state.os}'`);
  if (store.state.device)
    components.push(`device_type = '${store.state.device}'`);
  if (store.state.is_bot !== "")
    components.push(`bot = '${store.state.is_bot}'`);
  if (store.state.is_new !== "")
    components.push(`is_new = '${store.state.is_new}'`);
  if (store.state.browser)
    components.push(`browser = '${store.state.browser}'`);
  if (store.state.language) components.push(`lang = '${store.state.language}'`);
  if (store.state.country)
    components.push(`country_code = '${store.state.country}'`);

  // Event name
  if (!excludeEvents)
    components.push(`event = '${store.state.event || "pageview"}'`);

  // Start / End Range or Prior (comparison) period
  if (comparison)
    components.push(
      `date BETWEEN '${isoDate(store.state.comparisonStart)}' AND '${isoDate(
        store.state.comparisonEnd
      )}'`
    );
  else if (!skipDates)
    components.push(
      `date BETWEEN '${isoDate(store.state.start)}' AND '${isoDate(
        store.state.end
      )}'`
    );

  return (
    (components.length ? ` WHERE ` : "") + (components.join(" AND ") || "")
  );
}

// Since some of these are encrypted, there's no longer a possibility to list all domains in the database
export async function queryDomains(store) {
  let res = await query(`SELECT DISTINCT host FROM visits`),
    domains = [];
  res.forEach((item) => domains.push(item.host));
  domains.sort();

  domains = domains.filter((domain) => !domain.includes("localhost"));

  // console.log('domains', domains);
  store.commit("setDomains", domains);
  return domains;
}

export async function queryLoadTimes(store) {
  if (!store.state.host) return [];

  const SIV = store.state.key
    ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key))
    : null;

  let sql = `SELECT pathname, AVG(load_time) as AvgLoadTime from visits${whereClauseComponents(
    store
  )} GROUP BY pathname ORDER BY AvgLoadTime DESC LIMIT 100;`;
  let res = await query(sql);

  // console.log('queryLoadTimes:', sql, res);

  if (SIV) {
    res.forEach((row) => {
      try {
        let decrypted = SIV.decrypt(
          CryptoJS.enc.Hex.parse(row.pathname)
        ).toString(CryptoJS.enc.Utf8);
        if (decrypted && decrypted != "false") row.pathname = decrypted;
      } catch (e) {}
    });
  }

  return res;
}

export async function queryCounts(store, column = "hour", max = 10) {
  if (!store.state.host) return [];

  const SIV = store.state.key
    ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key))
    : null;

  const columnValue = store.state.showVisitors
    ? "count(DISTINCT ip)"
    : "count(*)";
  // console.log('columnValue', columnValue, store.state.showVisitors);

  let addCountries = column === "region" || column === "city";
  let isTimeseries = column === "hour" || column === "date";
  let orderByValue = isTimeseries ? column : columnValue;
  let direction = isTimeseries ? "ASC" : "DESC";
  let limit = isTimeseries ? "" : ` LIMIT ${max}`;
  let addRegion = column === "city";

  let sql = `SELECT ${column}${addCountries ? ", country_code" : ""}${
    addRegion ? ", region" : ""
  }, ${columnValue} FROM visits${whereClauseComponents(
    store,
    0,
    0,
    column === "event" && !store.state.event
  )} GROUP BY ${column} ORDER BY ${orderByValue} ${direction}${limit};`;
  let res = await query(sql);

  // console.log('queryCounts:', sql, res);

  if (SIV) {
    res.forEach((row) => {
      try {
        let decrypted = SIV.decrypt(
          CryptoJS.enc.Hex.parse(row[column])
        ).toString(CryptoJS.enc.Utf8);
        if (decrypted && decrypted != "false") row[column] = decrypted;

        if (addRegion) {
          decrypted = SIV.decrypt(CryptoJS.enc.Hex.parse(row.region)).toString(
            CryptoJS.enc.Utf8
          );
          if (decrypted && decrypted != "false") row.region = decrypted;
        }
      } catch (e) {}
    });
  }

  return res;
}

export async function queryEntryExitPages(
  store,
  column = "pathname",
  valueColumn = "EntrypageCount",
  max = 10
) {
  if (!store.state.host) return [];

  const SIV = store.state.key
    ? CryptoJS.SIV.create(CryptoJS.enc.Hex.parse(store.state.key))
    : null;
  // let sql = `SELECT ${ column }, ${ columnValue } FROM visits${ whereClauseComponents(store) } GROUP BY ${ column } ORDER BY ${ orderByValue } ${ direction }${ limit };`;

  let sql = `SELECT ${column},
    COUNT(CASE WHEN ts = First THEN 1 END) AS EntrypageCount,
    COUNT(CASE WHEN ts = Last THEN 1 END) AS ExitPagecount
FROM (SELECT *,
    MIN(ts) OVER (PARTITION BY ip, 'date') AS First,
    MAX(ts) OVER (PARTITION BY ip, 'date') AS Last
    FROM visits) T
${whereClauseComponents(store)}
GROUP BY ${column}
ORDER BY ${valueColumn} DESC LIMIT ${max}`;

  let res = await query(sql);
  // console.log('queryCounts:', sql, res, column);

  res = res.filter((x) => x[valueColumn] > 0);

  if (SIV) {
    res.forEach((row) => {
      try {
        let decrypted = SIV.decrypt(
          CryptoJS.enc.Hex.parse(row[column])
        ).toString(CryptoJS.enc.Utf8);
        if (decrypted && decrypted != "false") row[column] = decrypted;
      } catch (e) {}
    });
  }

  return res;
}

export async function querySummary(store, date) {
  let sql = `SELECT * FROM summaries${whereClauseComponents(
    store,
    1
  )} AND date ${date > 1000 && date < 3000 ? "LIKE" : "="} '${date}${
    date > 1000 && date < 3000 ? "-%" : ""
  }';`;
  let result = {},
    loadTimes = [],
    res = await query(sql);

  // Merge all data objects
  res.forEach((row) => {
    let data = JSON.parse(row.data);

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "number") {
        if (!result[key]) result[key] = 0;
        result[key] += data[key];
      } else if (key === "loadTimes") {
        result[key] = [];

        if (!result[key]) result[key] = [];

        loadTimes = loadTimes.concat(data[key]);

        // reduce loadTimes with duplicate pathname as averages
        let unique_pathnames = loadTimes
          .map((x) => x.pathname)
          .filter((value, index, self) => self.indexOf(value) === index);
        unique_pathnames.forEach((pathname) => {
          let matches = loadTimes.filter((x) => (x.pathname = pathname));
          let sum = matches
            .map((match) => match.AvgLoadTime)
            .reduce((a, b) => a + b, 0);
          let avg = sum / matches.length;

          result[key].push({ pathname, AvgLoadTime: avg });
        });
      } else if (typeof data[key] === "object") {
        if (!result[key]) result[key] = {};

        Object.keys(data[key]).forEach((k) => {
          if (!result[key][k]) result[key][k] = 0;
          result[key][k] += data[key][k];
        });
      }
    });
  });

  store.commit("setSummary", result);
}
