const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>"$"+Math.round(n).toLocaleString("en-US");
const KEY="shaadistory-v1", INVITED=70, BUDGET=25000;
const CATS={Venue:6000,Catering:8000,Decor:5000,Photography:2500,Music:2000,Other:1500};
const CERS=["Mehendi","Sangeet","Wedding","Reception"];

/* ---------- Sample data ---------- */
function seed(){
  const first=["Rohit","Priya","Suresh","Neha","Arun","Divya","Manoj","Sita","Vikram","Anita","Rajesh","Pooja","Imran","Sunita","Amit","Lakshmi","Nikhil","Meera"];
  const last=["Sharma","Iyer","Reddy","Kapoor","Nair","Gupta","Menon","Singh","Das","Rao","Joshi","Patel","Khan","Verma","Bose","Pillai","Mehta","Chopra"];
  const size=[2,3,2,4,2,1,3,2,2,3,2,2,3,2,4,2,2,4];
  const wish=["May your home always smell of jasmine and fresh chai.","Wishing you a lifetime of road trips and wrong turns.","Two hearts, one very loud Sangeet. Congratulations!"];
  const rsvps=size.map((p,i)=>({name:first[i]+" "+last[i],contact:"98480"+(10000+i*137),attending:true,party:p,meal:i%5<3?"veg":"nonveg",blessing:wish[i]||""}));
  [["Kiran Bhat",2],["Farah Ali",1],["Tom Dsouza",2]].forEach(([n,p],i)=>rsvps.push({name:n,contact:"99890"+(20000+i*211),attending:false,party:p,meal:"veg",blessing:""}));
  const E=(cer,cat,desc,amt)=>({cer,cat,desc,amt});
  return{rsvps,
    vendors:[["Gulmohar Palace","Venue",6000,6000],["Spice Route Caterers","Catering",7700,4000],["Lens & Lace","Photography",2500,1500],["Mandap Dreams","Decor",3600,1800],["Beats by Rohan","Music",1500,1500],["Henna by Zoya","Mehendi artist",500,500],["Glam Studio","Makeup",1200,600],["Petal & Thread","Florist",1800,0]].map(([name,svc,contract,adv])=>({name,svc,contract,adv})),
    expenses:[E("Wedding","Venue","Palace rental",6000),E("Wedding","Catering","Lunch for 120",4800),E("Reception","Catering","Dinner for 100",2300),E("Sangeet","Catering","Snacks and chaat",600),E("Mehendi","Decor","Lawn setup",1100),E("Sangeet","Decor","Stage and lights",1000),E("Wedding","Decor","Mandap",1500),E("Wedding","Photography","Two-day coverage",2500),E("Sangeet","Music","DJ and sound",1500),E("Reception","Other","Makeup trial and bridal",700),E("Mehendi","Other","Henna artist",500)],
    gifts:[{em:"🍽️",name:"Hand-painted dinner set",price:240,by:""},{em:"☕",name:"Espresso machine",price:180,by:""},{em:"🛏️",name:"Linen bedding set",price:120,by:"Aunt Meera"},{em:"🪔",name:"Silver diya set",price:90,by:""},{em:"🍟",name:"Air fryer",price:110,by:""},{em:"🧳",name:"Matching luggage set",price:150,by:""}],
    fund:{goal:5000,raised:2150}};
}
let S;
try{S=JSON.parse(localStorage.getItem(KEY))}catch{}
S=S||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
const say=(el,msg)=>{el.textContent=msg};

/* ---------- Theme ---------- */
const root=document.documentElement, themeBtn=$("#theme");
const isDark=()=>root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
const syncTheme=()=>themeBtn.textContent=isDark()?"Day":"Night";
try{const t=localStorage.getItem("shaadi-theme");if(t)root.dataset.theme=t}catch{}
themeBtn.onclick=()=>{const t=isDark()?"light":"dark";root.dataset.theme=t;try{localStorage.setItem("shaadi-theme",t)}catch{}syncTheme()};
syncTheme();

/* ---------- Countdown ---------- */
const target=new Date("2027-02-13T11:00:00+05:30");
function tick(){
  let s=Math.max(0,Math.floor((target-Date.now())/1000));
  const v=[["Days",Math.floor(s/86400)],["Hours",Math.floor(s/3600)%24],["Minutes",Math.floor(s/60)%60],["Seconds",s%60]];
  $("#count").innerHTML=v.map(([l,n])=>`<div><b>${n}</b><span>${l}</span></div>`).join("");
}
tick();setInterval(tick,1000);

/* ---------- Gallery + lightbox ---------- */
const photos=[["🎓","First meeting, Pune 2018","#f6b4c8","#c77dba"],["🏛️","Hampi, 2020","#f9d29b","#e08a5a"],["🌧️","Monsoon in Munnar","#a8d8c9","#5aa6a0"],["💍","The proposal, 2025","#f3c873","#d1586f"],["🍛","Sunday family lunch","#fbc7a4","#e5817a"],["📸","Pre-wedding shoot","#c9b7f0","#7f6fd1"]];
let cur=0;const lb=$("#lb");
const tileStyle=p=>`--a:${p[2]};--b:${p[3]}`;
$("#gal").innerHTML=photos.map((p,i)=>`<button class="tile" data-i="${i}" style="${tileStyle(p)}" aria-label="Open photo: ${p[1]}"><span aria-hidden="true">${p[0]}</span></button>`).join("");
function show(i){cur=(i+photos.length)%photos.length;const p=photos[cur];$("#lbTile").style.cssText=tileStyle(p);$("#lbTile").textContent=p[0];$("#lbCap").textContent=p[1]}
$("#gal").onclick=e=>{const b=e.target.closest(".tile");if(b){show(+b.dataset.i);lb.showModal()}};
$("#prev").onclick=()=>show(cur-1);$("#next").onclick=()=>show(cur+1);$("#close").onclick=()=>lb.close();
lb.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")show(cur-1);if(e.key==="ArrowRight")show(cur+1)});
lb.addEventListener("click",e=>{if(e.target===lb)lb.close()});

/* ---------- RSVP + analytics ---------- */
const norm=c=>c.toLowerCase().replace(/[\s\-()+]/g,"");
function stats(){
  const yes=S.rsvps.filter(r=>r.attending), sum=a=>a.reduce((t,r)=>t+r.party,0);
  const confirmed=sum(yes), declined=sum(S.rsvps.filter(r=>!r.attending));
  return{confirmed,veg:sum(yes.filter(r=>r.meal==="veg")),non:sum(yes.filter(r=>r.meal!=="veg")),declined,pending:Math.max(0,INVITED-confirmed-declined)};
}
function renderGuests(){
  const s=stats();
  $("#stats").innerHTML=[["Confirmed guests",s.confirmed],["Vegetarian meals",s.veg],["Non-vegetarian meals",s.non],["Declined",s.declined],["Pending responses",s.pending]].map(([l,n])=>`<div class="card stat"><b>${n}</b><span>${l}</span></div>`).join("");
  $("#guestRows").innerHTML=S.rsvps.slice().reverse().map(r=>`<tr><td>${esc(r.name)}</td><td>${r.party}</td><td>${r.attending?(r.meal==="veg"?"Vegetarian":"Non-vegetarian"):"–"}</td><td class="${r.attending?"good":"muted"}">${r.attending?"Attending":"Declined"}</td></tr>`).join("");
  const w=S.rsvps.filter(r=>r.blessing).slice(-6).reverse();
  $("#blessings").innerHTML=w.map(r=>`<div class="card"><blockquote>“${esc(r.blessing)}”<cite>${esc(r.name)}</cite></blockquote></div>`).join("");
}
const f=$("#rsvpForm"),dupe=$("#dupe");
f.onsubmit=e=>{
  e.preventDefault();
  const d=new FormData(f),contact=d.get("contact").trim();
  const ex=S.rsvps.find(r=>norm(r.contact)===norm(contact));
  if(ex&&!f.dataset.update){
    dupe.hidden=false;
    dupe.innerHTML=`<span>We already have an RSVP from <b>${esc(ex.name)}</b> for this contact. Update it instead of adding a new one?</span><button type="button" id="doUpdate">Update my RSVP</button>`;
    $("#doUpdate").onclick=()=>{f.dataset.update="1";f.requestSubmit()};
    return;
  }
  const rec={name:d.get("name").trim(),contact,attending:d.get("attending")==="yes",party:1+(+d.get("extra")||0),meal:d.get("meal"),blessing:d.get("blessing").trim()};
  if(ex)Object.assign(ex,rec);else S.rsvps.push(rec);
  delete f.dataset.update;dupe.hidden=true;save();renderGuests();
  say($("#status"),`${ex?"RSVP updated":"RSVP received"}. Confirmed guests are now ${stats().confirmed}. Thank you, ${rec.name.split(" ")[0]}!`);
  f.reset();
};
f.addEventListener("input",()=>{delete f.dataset.update;dupe.hidden=true});

/* ---------- Vendors ---------- */
const vStatus=v=>v.adv>=v.contract?"Paid":v.adv>0?"Part-paid":"Quoted";
function renderVendors(){
  $("#vendorRows").innerHTML=S.vendors.map((v,i)=>`<tr><td>${esc(v.name)}</td><td>${esc(v.svc)}</td><td>${money(v.contract)}</td>
    <td><input type="number" min="0" max="${v.contract}" value="${v.adv}" data-i="${i}" aria-label="Advance paid to ${esc(v.name)}"></td>
    <td>${money(v.contract-v.adv)}</td><td class="badge ${vStatus(v)==="Paid"?"good":""}">${vStatus(v)}</td></tr>`).join("");
}
$("#vendorRows").onchange=e=>{const i=e.target.dataset.i;if(i==null)return;const v=S.vendors[i];v.adv=Math.min(v.contract,Math.max(0,+e.target.value||0));save();renderVendors()};
$("#vendorForm").onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),c=+d.get("contract");S.vendors.push({name:d.get("name").trim(),svc:d.get("svc").trim(),contract:c,adv:Math.min(c,+d.get("adv"))});save();renderVendors();e.target.reset()};

/* ---------- Budget ---------- */
const spent=c=>S.expenses.filter(x=>x.cat===c).reduce((t,x)=>t+x.amt,0);
function variance(planned,actual){const v=planned-actual;return v<0?`<span class="badge bad">▲ Over by ${money(-v)}</span>`:`<span class="badge good">${money(v)} left</span>`}
function renderBudget(){
  const total=S.expenses.reduce((t,x)=>t+x.amt,0),left=BUDGET-total,pct=Math.min(100,total/BUDGET*100);
  $("#bStats").innerHTML=[["Total budget",money(BUDGET)],["Spent so far",money(total)],[left<0?"Over budget":"Remaining",money(Math.abs(left))]].map(([l,n])=>`<div class="card stat"><b>${n}</b><span>${l}</span></div>`).join("");
  const bar=$("#bBar");bar.classList.toggle("over",left<0);bar.firstElementChild.style.width=pct+"%";bar.setAttribute("aria-valuenow",Math.round(pct));
  $("#catRows").innerHTML=Object.entries(CATS).map(([c,p])=>{const a=spent(c);return`<tr><td>${c}</td><td>${money(p)}</td><td>${money(a)}</td><td>${variance(p,a)}</td></tr>`}).join("");
  $("#cerStats").innerHTML=CERS.map(c=>`<div class="card stat"><b>${money(S.expenses.filter(x=>x.cer===c).reduce((t,x)=>t+x.amt,0))}</b><span>${c}</span></div>`).join("");
}
const opt=a=>a.map(x=>`<option>${x}</option>`).join("");
$("#expForm").cer.innerHTML=opt(CERS);$("#expForm").cat.innerHTML=opt(Object.keys(CATS));
$("#expForm").onsubmit=e=>{
  e.preventDefault();const d=new FormData(e.target),cat=d.get("cat");
  S.expenses.push({cer:d.get("cer"),cat,desc:d.get("desc").trim(),amt:+d.get("amt")});
  save();renderBudget();e.target.reset();
  const left=CATS[cat]-spent(cat);
  say($("#expStatus"),left<0?`Added. ${cat} is now over its ${money(CATS[cat])} allocation by ${money(-left)}.`:`Added. ${money(left)} remains in the ${cat} budget.`);
  $("#expStatus").style.color=left<0?"var(--bad)":"var(--good)";
};

/* ---------- Gifts ---------- */
function renderGifts(){
  const g=S.fund,pct=Math.min(100,g.raised/g.goal*100);
  $("#fundTxt").textContent=`${money(g.raised)} raised of ${money(g.goal)}`;
  const b=$("#fundBar");b.firstElementChild.style.width=pct+"%";b.setAttribute("aria-valuenow",Math.round(pct));
  $("#giftList").innerHTML=S.gifts.map((x,i)=>`<div class="card gift ${x.by?"claimed":""}"><div class="em" aria-hidden="true">${x.em}</div><h3>${esc(x.name)}</h3><p class="muted">${money(x.price)}</p>
    ${x.by?`<p class="badge good">Claimed by ${esc(x.by)}</p><button class="ghost" data-rel="${i}">Release</button>`:`<button data-claim="${i}">Claim gift</button>`}</div>`).join("");
}
$("#giftList").onclick=e=>{
  const c=e.target.dataset.claim,r=e.target.dataset.rel,n=$("#giftName").value.trim();
  if(c!=null){if(!n){$("#giftName").focus();$("#giftName").placeholder="Enter your name first";return}S.gifts[c].by=n}
  else if(r!=null)S.gifts[r].by="";
  else return;
  save();renderGifts();
};
$("#fundForm").onsubmit=e=>{e.preventDefault();S.fund.raised+=+new FormData(e.target).get("amt");save();renderGifts();e.target.reset()};

/* ---------- Host tabs ---------- */
$$("[data-tab]").forEach(b=>b.onclick=()=>{
  $$("[data-tab]").forEach(x=>{const on=x===b;x.setAttribute("aria-selected",on);$("#tab-"+x.dataset.tab).hidden=!on});
});

renderGuests();renderVendors();renderBudget();renderGifts();
