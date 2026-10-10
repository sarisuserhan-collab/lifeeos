import {readFileSync,writeFileSync} from 'node:fs';
const F='market.json',j=JSON.parse(readFileSync(F,'utf8')),today=new Date().toISOString().slice(0,10),fail=[],v={};
const get=async u=>{const r=await fetch(u,{headers:{'user-agent':'Mozilla/5.0'}});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
try{const r=(await get('https://api.frankfurter.app/latest?from=USD&to=TRY,EUR')).rates;v['Dolar/TL']=r.TRY;v['Euro/TL']=r.TRY/r.EUR}catch(e){fail.push('kur: '+e.message)}
try{v['Ons altın ($)']=(await get('https://api.gold-api.com/price/XAU')).price}catch(e){fail.push('altın: '+e.message)}
try{v['BIST 100']=(await get('https://query1.finance.yahoo.com/v8/finance/chart/XU100.IS?range=5d&interval=1d')).chart.result[0].meta.regularMarketPrice}catch(e){fail.push('BIST: '+e.message)}
if(v['Ons altın ($)']&&v['Dolar/TL'])v['Gram altın (₺)']=v['Ons altın ($)']*v['Dolar/TL']/31.1035;
for(const row of j.rows){const x=v[row[0]];if(!Number.isFinite(x))continue;const r=Math.round(x*100)/100;if(j.son===today)row[1][row[1].length-1]=r;else row[1].push(r);row[1]=row[1].slice(-14)}
if(Object.keys(v).length){j.son=today;j.tarih=new Date().toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})+' (otomatik)'}
j.not=fail.length?'Alınamayan: '+fail.join('; '):'Tüm kaynaklar alındı.';
writeFileSync(F,JSON.stringify(j,null,1));console.log(j.tarih,j.not);
