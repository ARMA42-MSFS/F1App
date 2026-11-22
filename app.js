const tracks=["Bahrain","Jeddah","Australia","Japan","Miami","Imola","Monaco","Barcelona","Canada","Austria","Great Britain","Belgium","Hungary","Netherlands","Italy","Azerbaijan","Singapore","USA","Mexico","São Paulo","Las Vegas","Qatar","Abu Dhabi"];
const LKEY="f1lapvault_laps_v2", SKEY="f1lapvault_setups_v2";
let laps=JSON.parse(localStorage.getItem(LKEY)||"[]"), setups=JSON.parse(localStorage.getItem(SKEY)||"[]");
const $=id=>document.getElementById(id), pad=(n,l=2)=>String(n).padStart(l,"0");
function fill(){let o=tracks.map(t=>`<option>${t}</option>`).join("");$("track").innerHTML=o;$("setupTrack").innerHTML=o}
function save(){localStorage.setItem(LKEY,JSON.stringify(laps));localStorage.setItem(SKEY,JSON.stringify(setups))}
function ms(x){return(x.min*60+x.sec)*1000+x.ms}
function fmt(x){return`${x.min}:${pad(x.sec)}.${pad(x.ms,3)}`}
function deltaText(d){if(d===null||d===undefined||d==="")return"Δ --";let n=Number(d);return`Δ ${n>=0?"+":""}${n.toFixed(3)}`}
function renderLaps(){
 const el=$("lapList"); if(!laps.length){el.innerHTML='<div class="empty">Noch keine Runden gespeichert.</div>';$("heroBest").textContent="--:--.---";$("heroTrack").textContent="Noch keine Runde";$("heroDelta").textContent="Δ --";return}
 const sorted=[...laps].sort((a,b)=>ms(a)-ms(b)),best=sorted[0];$("heroBest").textContent=fmt(best);$("heroTrack").textContent=`${best.track} · ${best.owner}`;$("heroDelta").textContent=deltaText(best.delta);
 el.innerHTML=sorted.map(l=>{let d=l.delta===""||l.delta==null?null:Number(l.delta);return`<article class="item"><div class="badge">${l.tyre[0]}</div><div><strong>${l.track}</strong><small>${l.owner} · ${l.session} · ${l.tyre}</small><small>${l.note||"Keine Notiz"}</small></div><div><div class="laptime">${fmt(l)}</div>${d===null?"":`<div class="delta ${d<=0?"good":"bad"}">${deltaText(d)}</div>`}<button class="delete" data-lap="${l.id}">×</button></div></article>`}).join("");
 el.querySelectorAll("[data-lap]").forEach(b=>b.onclick=()=>{laps=laps.filter(x=>x.id!==b.dataset.lap);save();renderLaps()})
}
function renderSetups(){
 const el=$("setupList");if(!setups.length){el.innerHTML='<div class="empty">Noch keine Setups gespeichert.</div>';return}
 el.innerHTML=[...setups].reverse().map(s=>`<article class="item"><div class="badge">⚙</div><div><strong>${s.track} · ${s.name}</strong><small>Halter: ${s.owner} · ${s.preset||"Custom"}</small><div class="setup-values">FW ${s.fw||"—"} · RW ${s.rw||"—"} · Diff ${s.on||"—"}/${s.off||"—"} · Camber ${s.fc||"—"}/${s.rc||"—"}${s.note?`<br>${s.note}`:""}</div></div><button class="delete" data-setup="${s.id}">×</button></article>`).join("");
 el.querySelectorAll("[data-setup]").forEach(b=>b.onclick=()=>{setups=setups.filter(x=>x.id!==b.dataset.setup);save();renderSetups()})
}
$("lapForm").onsubmit=e=>{
 e.preventDefault();let l={id:crypto.randomUUID(),track:$("track").value,owner:$("owner").value.trim(),session:$("session").value,tyre:$("tyre").value,min:+$("min").value||0,sec:+$("sec").value||0,ms:+$("ms").value||0,delta:$("delta").value.trim().replace(",", "."),note:$("note").value.trim()};
 if(l.sec>59||l.ms>999||l.min<0){alert("Bitte gültige Zeit eingeben.");return} if(l.delta!==""&&!Number.isFinite(Number(l.delta))){alert("Delta muss z. B. +0.214 oder -0.214 sein.");return}
 laps.push(l);save();renderLaps();e.target.reset();
};
$("setupForm").onsubmit=e=>{
 e.preventDefault();setups.push({id:crypto.randomUUID(),track:$("setupTrack").value,owner:$("setupOwner").value.trim(),name:$("setupName").value.trim(),preset:$("preset").value.trim(),fw:$("frontWing").value,rw:$("rearWing").value,on:$("diffOn").value,off:$("diffOff").value,fc:$("frontCamber").value,rc:$("rearCamber").value,note:$("setupNote").value.trim()});save();renderSetups();e.target.reset()
};
$("clearLaps").onclick=()=>{if(confirm("Alle Runden löschen?")){laps=[];save();renderLaps()}};$("clearSetups").onclick=()=>{if(confirm("Alle Setups löschen?")){setups=[];save();renderSetups()}};
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(t.dataset.view==="laps"?"lapsView":"setupView").classList.add("active")});
fill();renderLaps();renderSetups();
