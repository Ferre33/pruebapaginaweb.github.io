import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';

let rows, byId;
const fold = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase().trim();
function load() {
  if (!rows) {
    const data = JSON.parse(gunzipSync(readFileSync(new URL('./data/localities.json.gz', import.meta.url))));
    rows = data.places.map(([id, city, country, region, province, lat, lon, population]) => ({id, city, country, region, province, lat, lon, population, search:fold(city)}));
    byId = new Map(rows.map(row => [row.id, row]));
  }
  return rows;
}
export function publicPlace(row) {
  if (!row) return null;
  return {id:row.id, city:row.city, country:row.country, region:row.region, province:row.province};
}
export function placeById(id) { load(); return publicPlace(byId.get(id)); }
export function searchPlaces(query, country='') {
  if (typeof query !== 'string' || query.trim().length < 2 || query.length > 80 || (country && !/^[A-Z]{2}$/.test(country))) return [];
  const q = fold(query);
  return load().filter(p => (!country || p.country === country) && p.search.includes(q))
    .sort((a,b) => Number(b.search===q)-Number(a.search===q) || Number(b.search.startsWith(q))-Number(a.search.startsWith(q)) || b.population-a.population || a.id-b.id)
    .slice(0,12).map(publicPlace);
}
function distance(lat,lon,p) {
  const rad=Math.PI/180, dy=(p.lat-lat)*rad, dx=(p.lon-lon)*rad;
  const a=Math.sin(dy/2)**2+Math.cos(lat*rad)*Math.cos(p.lat*rad)*Math.sin(dx/2)**2;
  return 6371*2*Math.asin(Math.min(1,Math.sqrt(a)));
}
export function nearbyPlaces(latCell, lonCell, accuracy) {
  // The client sends integer hundredths of a degree, never raw GPS coordinates.
  if (!Number.isInteger(latCell) || !Number.isInteger(lonCell) || Math.abs(latCell)>9000 || Math.abs(lonCell)>18000 || !Number.isFinite(accuracy) || accuracy<0 || accuracy>5000) return [];
  const lat=latCell/100, lon=lonCell/100;
  return load().filter(p=>Math.abs(p.lat-lat)<0.25).map(p=>({p,km:distance(lat,lon,p)}))
    .filter(p=>p.km<=20).sort((a,b)=>a.km-b.km || b.p.population-a.p.population).slice(0,6).map(({p})=>publicPlace(p));
}
