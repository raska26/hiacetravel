const fmt=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
const today=new Date(); const iso=d=>d.toISOString().slice(0,10); const todayStr=iso(today);
const dateOffset=n=>{let d=new Date();d.setDate(d.getDate()+n);return iso(d)};
let bookings=JSON.parse(localStorage.getItem('ht_bookings')||'null')||[
 {code:'HT-26001',name:'Andi Saputra',phone:'0812-3456-7890',type:'Reguler',route:'Kotabumi → Tanjung Karang',date:todayStr,time:'08:00',seat:'A1',total:150000,paid:true},
 {code:'HT-26002',name:'Siti Rahma',phone:'0821-1111-2233',type:'Reguler',route:'Tanjung Karang → Kotabumi',date:todayStr,time:'10:00',seat:'A2',total:150000,paid:true},
 {code:'HT-26003',name:'Budi Santoso',phone:'0813-2222-3344',type:'Carter',route:'Kotabumi → Tanjung Karang',date:dateOffset(1),time:'13:00',seat:'Satu kendaraan',total:1200000,paid:false},
 {code:'HT-26004',name:'Dewi Lestari',phone:'0857-3333-4455',type:'Reguler',route:'Kotabumi → Tanjung Karang',date:todayStr,time:'15:00',seat:'A3',total:150000,paid:true},
 {code:'HT-26005',name:'Rizky Pratama',phone:'0812-4444-5566',type:'Reguler',route:'Tanjung Karang → Kotabumi',date:todayStr,time:'16:00',seat:'A4',total:150000,paid:false}
];
let costs=JSON.parse(localStorage.getItem('ht_costs')||'null')||[
 {date:todayStr,category:'Uang Jalan',note:'Uang jalan keberangkatan pagi',amount:500000},
 {date:todayStr,category:'BBM',note:'Pengisian bahan bakar',amount:250000},
 {date:todayStr,category:'Operasional',note:'Parkir dan tol',amount:100000}
];
let activities=[{icon:'✓',title:'Data demo berhasil dimuat',desc:'Anda dapat mencoba menambahkan pemesanan baru.',time:'Baru saja'},{icon:'▣',title:'Jadwal keberangkatan tersedia',desc:'Rute Kotabumi dan Tanjung Karang.',time:'Hari ini'},{icon:'↗',title:'Rekap keuangan',desc:'Pemasukan dan pengeluaran contoh ditampilkan.',time:'Hari ini'}];
const schedules=[
 {route:'Kotabumi → Tanjung Karang',date:todayStr,time:'08:00',vehicle:'Armada 01',filled:9},
 {route:'Tanjung Karang → Kotabumi',date:todayStr,time:'10:00',vehicle:'Armada 02',filled:7},
 {route:'Kotabumi → Tanjung Karang',date:todayStr,time:'15:00',vehicle:'Armada 01',filled:11},
 {route:'Tanjung Karang → Kotabumi',date:dateOffset(1),time:'08:00',vehicle:'Armada 02',filled:4}
];
function save(){localStorage.setItem('ht_bookings',JSON.stringify(bookings));localStorage.setItem('ht_costs',JSON.stringify(costs));}
function toast(msg){let el=document.getElementById('toast');el.textContent=msg;el.style.display='block';setTimeout(()=>el.style.display='none',2600)}
function showView(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('#nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));document.getElementById('crumb').textContent=({dashboard:'Dashboard',bookings:'Pemesanan',schedules:'Jadwal & Kendaraan',passengers:'Data Penumpang',finance:'Keuangan',reports:'Laporan',settings:'Pengaturan'})[id]||id;renderAll();window.scrollTo(0,0)}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
function routeShort(route){return route.replace('Kotabumi','Kotabumi').replace('Tanjung Karang','Tanjung Karang')}
function renderDashboard(){
 document.getElementById('schedulePreview').innerHTML=schedules.slice(0,3).map(s=>`<tr><td><span class="route">${s.route}</span><span class="sub">${s.vehicle}</span></td><td>${s.time}<span class="sub">${s.date}</span></td><td>${s.filled}/14 kursi</td><td><span class="pill ${s.filled>=14?'red':'green'}">${s.filled>=14?'Penuh':'Tersedia'}</span></td></tr>`).join('');
 document.getElementById('activityList').innerHTML=activities.map(a=>`<div class="activity-item"><div class="activity-icon">${a.icon}</div><div><strong>${a.title}</strong><p>${a.desc}</p><time>${a.time}</time></div></div>`).join('');
 document.getElementById('routeCards').innerHTML=schedules.slice(0,3).map(s=>`<div class="route-card"><div class="route-line"><strong>${s.route}</strong><span>${s.time} · ${s.filled}/14 kursi</span></div><div class="bar"><span style="width:${Math.min(100,s.filled/14*100)}%"></span></div><div class="route-meta"><span>${14-s.filled} kursi tersedia</span><span>${Math.round(s.filled/14*100)}% terisi</span></div></div>`).join('');
}
function renderBookings(){
 let q=(document.getElementById('bookingSearch')?.value||'').toLowerCase(),type=document.getElementById('bookingType')?.value||'';
 let rows=bookings.filter(b=>(b.name+' '+b.code).toLowerCase().includes(q)&&(!type||b.type===type));
 document.getElementById('bookingRows').innerHTML=rows.length?rows.map(b=>`<tr><td><b>${b.code}</b></td><td>${b.name}<span class="sub">${b.phone}</span></td><td><span class="pill ${b.type==='Carter'?'orange':'blue'}">${b.type}</span></td><td>${b.route}</td><td>${b.date}<span class="sub">${b.time||'-'}</span></td><td><b>${fmt(b.total)}</b></td><td><span class="pill ${b.paid?'green':'orange'}">${b.paid?'Lunas':'Belum lunas'}</span></td></tr>`).join(''):'<tr><td colspan="7" class="empty">Tidak ada data pemesanan yang cocok.</td></tr>';
}
function renderPassengers(){
 let q=(document.getElementById('passengerSearch')?.value||'').toLowerCase(),rows=bookings.filter(b=>b.name.toLowerCase().includes(q));
 document.getElementById('passengerRows').innerHTML=rows.length?rows.map(b=>`<tr><td><b>${b.name}</b></td><td>${b.phone||'-'}</td><td><span class="pill ${b.type==='Carter'?'orange':'blue'}">${b.type}</span></td><td>${b.route}</td><td>${b.date}</td><td>${b.seat||'-'}</td></tr>`).join(''):'<tr><td colspan="6" class="empty">Belum ada data.</td></tr>';
}
function renderSchedules(){document.getElementById('allSchedules').innerHTML=schedules.map(s=>`<tr><td><b>${s.route}</b></td><td>${s.date}</td><td>${s.time}</td><td>${s.vehicle}</td><td>${s.filled}/14</td><td><span class="pill ${s.filled>=14?'red':'green'}">${s.filled>=14?'Penuh':'Tersedia'}</span></td></tr>`).join('')}
function renderFinance(){
 let rev=bookings.filter(b=>b.paid).reduce((s,b)=>s+b.total,0)+2750000;let cost=costs.reduce((s,c)=>s+c.amount,0)+0;
 document.getElementById('financeRevenue').textContent=fmt(rev);document.getElementById('financeCosts').textContent=fmt(cost);document.getElementById('financeNet').textContent=fmt(rev-cost);
 document.getElementById('costRows').innerHTML=costs.map(c=>`<tr><td>${c.date}</td><td><span class="pill blue">${c.category}</span></td><td>${c.note}</td><td><b>${fmt(c.amount)}</b></td></tr>`).join('')||'<tr><td colspan="4" class="empty">Belum ada pengeluaran.</td></tr>';
 document.getElementById('statRevenue').textContent=rev>=1000000?'Rp '+(rev/1000000).toFixed(1).replace('.',',')+' jt':fmt(rev);
 document.getElementById('statCosts').textContent=cost>=1000000?'Rp '+(cost/1000000).toFixed(1).replace('.',',')+' jt':cost>=1000?'Rp '+Math.round(cost/1000)+' rb':fmt(cost);
 document.getElementById('reportRevenue').textContent=document.getElementById('statRevenue').textContent;document.getElementById('reportCosts').textContent=document.getElementById('statCosts').textContent;
}
function renderReports(){
 document.getElementById('reportRows').innerHTML=bookings.map(b=>`<tr><td>${b.code}</td><td>${b.name}</td><td>${b.type}</td><td>${b.route}</td><td>${b.date}</td><td>${fmt(b.total)}</td><td><span class="pill ${b.paid?'green':'orange'}">${b.paid?'Lunas':'Belum lunas'}</span></td></tr>`).join('');
 document.getElementById('statBookings').textContent=bookings.length+19;document.getElementById('reportBookings').textContent=bookings.length+19;
 document.getElementById('statPassengers').textContent=bookings.filter(b=>b.date===todayStr).length+13;document.getElementById('reportPassengers').textContent=bookings.length+13;
}
function renderAll(){renderDashboard();renderBookings();renderPassengers();renderSchedules();renderFinance();renderReports()}
function openBooking(){
 document.getElementById('modalRoot').innerHTML=`<div style="position:fixed;inset:0;background:#0c1d2c99;display:grid;place-items:center;padding:15px;z-index:20" id="modalBackdrop"><div style="background:white;border-radius:16px;width:min(620px,100%);max-height:92vh;overflow:auto;box-shadow:0 20px 70px #0003"><div class="panel-head"><div><h2>Tambah Pemesanan</h2><p>Masukkan data pemesanan pelanggan</p></div><button class="btn" onclick="closeModal()">✕</button></div><form id="bookingForm" class="panel-body"><div class="form-grid">
 <div class="field"><label>Nama Pelanggan *</label><input name="name" required placeholder="Nama lengkap"/></div><div class="field"><label>No. Telepon</label><input name="phone" placeholder="08xxxxxxxxxx"/></div>
 <div class="field"><label>Jenis Layanan *</label><select name="type" id="typeField" required onchange="toggleSeat(this.value)"><option>Reguler</option><option>Carter</option></select></div>
 <div class="field"><label>Rute *</label><select name="route"><option>Kotabumi → Tanjung Karang</option><option>Tanjung Karang → Kotabumi</option></select></div>
 <div class="field"><label>Tanggal Berangkat *</label><input type="date" name="date" value="${todayStr}" required/></div><div class="field"><label>Jam Berangkat</label><select name="time"><option>08:00</option><option>10:00</option><option>13:00</option><option>15:00</option><option>16:00</option></select></div>
 <div class="field" id="seatField"><label>Pilih Kursi</label><select name="seat"><option>A1</option><option>A2</option><option>A3</option><option>A4</option><option>B1</option><option>B2</option><option>B3</option><option>B4</option><option>C1</option><option>C2</option><option>C3</option><option>C4</option><option>D1</option><option>D2</option></select></div><div class="field"><label>Total Biaya (Rp) *</label><input type="number" name="total" min="0" required value="150000"/></div>
 <div class="field"><label>Status Pembayaran</label><select name="paid"><option value="true">Lunas</option><option value="false">Belum lunas</option></select></div></div><div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn primary" type="submit">Simpan Pemesanan</button></div><p class="footnote">Data disimpan pada browser ini. Sistem belum terhubung ke server/database.</p></form></div></div>`;
 document.getElementById('bookingForm').addEventListener('submit',e=>{e.preventDefault();let f=new FormData(e.target),type=f.get('type');let b={code:'HT-'+String(Date.now()).slice(-6),name:f.get('name'),phone:f.get('phone'),type,route:f.get('route'),date:f.get('date'),time:f.get('time'),seat:type==='Carter'?'Satu kendaraan':f.get('seat'),total:Number(f.get('total')),paid:f.get('paid')==='true'};bookings.unshift(b);activities.unshift({icon:'＋',title:'Pemesanan baru ditambahkan',desc:b.name+' · '+b.type,time:'Baru saja'});save();closeModal();renderAll();showView('bookings');toast('Pemesanan berhasil disimpan di browser.');});
}
function toggleSeat(type){let field=document.getElementById('seatField');if(field)field.style.display=type==='Carter'?'none':'block'}
function openCost(){
 document.getElementById('modalRoot').innerHTML=`<div style="position:fixed;inset:0;background:#0c1d2c99;display:grid;place-items:center;padding:15px;z-index:20"><div style="background:white;border-radius:16px;width:min(500px,100%);box-shadow:0 20px 70px #0003"><div class="panel-head"><h2>Catat Biaya Operasional</h2><button class="btn" onclick="closeModal()">✕</button></div><form id="costForm" class="panel-body"><div class="form-grid"><div class="field"><label>Tanggal</label><input name="date" type="date" value="${todayStr}" required/></div><div class="field"><label>Kategori</label><select name="category"><option>Uang Jalan</option><option>BBM</option><option>Tol/Parkir</option><option>Perawatan</option><option>Operasional</option></select></div><div class="field full"><label>Keterangan</label><input name="note" required placeholder="Contoh: uang jalan keberangkatan pagi"/></div><div class="field full"><label>Jumlah (Rp)</label><input name="amount" type="number" min="0" required placeholder="500000"/></div></div><div class="form-actions"><button type="button" class="btn" onclick="closeModal()">Batal</button><button class="btn primary">Simpan Biaya</button></div></form></div></div>`;
 document.getElementById('costForm').addEventListener('submit',e=>{e.preventDefault();let f=new FormData(e.target);costs.unshift({date:f.get('date'),category:f.get('category'),note:f.get('note'),amount:Number(f.get('amount'))});save();closeModal();renderAll();toast('Biaya berhasil dicatat.');});
}
function closeModal(){document.getElementById('modalRoot').innerHTML=''}
function downloadCSV(){let rows=[['Kode','Pelanggan','Jenis','Rute','Tanggal','Total','Pembayaran'],...bookings.map(b=>[b.code,b.name,b.type,b.route,b.date,b.total,b.paid?'Lunas':'Belum lunas'])];let csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'}));a.download='laporan-hiacetravel.csv';a.click();URL.revokeObjectURL(a.href);toast('Laporan CSV berhasil diekspor.')}
renderAll();
