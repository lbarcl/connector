import { connection } from "./connection.js";
import fs from "fs";

let conn = new connection("http://1153288396.rsc.cdn77.org/");
await conn.connect();
conn.setHeader('accept', 'image/jpeg');
const resp = await conn.get("/img/cdn77-test-563kb.jpg");
console.log(resp.statusCode, resp.headers);
const data5 = await resp.getRaw();
fs.writeFileSync("cdn77-test-563kb.jpg", data5, { encoding: "ascii" });
await conn.disconnect();


conn = new connection('https://kareoke.ga')
await conn.connect();
const resp2 = await conn.get('/v1/song/random');
const data2 = await resp2.getText('ascii');
console.log(data2);
await conn.disconnect();