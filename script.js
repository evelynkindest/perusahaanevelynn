const models = [
  {id:'street-bob',name:'Street Bob',type:'cruiser',label:'Cruiser',subtitle:'Minimalist spirit',year:'2026',image:'https://cdpcdn.dx1app.com/products/USA/HD/2026/MC/SOFTAIL/STREET_BOB/50/AURORA_BLUE_DENIM_WITH_CAST_WHEELS/2000000004.jpg',alt:'Harley-Davidson Street Bob 2026 berwarna biru',description:'Gaya bobber yang tegas dengan siluet minimalis dan karakter cruiser klasik. Pilihan untuk pengendara yang menyukai bentuk sederhana namun penuh karakter.',specs:['Milwaukee-Eight 117','Cruiser','Karakter klasik']},
  {id:'fat-boy',name:'Fat Boy',type:'cruiser',label:'Cruiser',subtitle:'Iconic presence',year:'2026',image:'https://www.harley-davidson.com/ctfasset/5vy1mse9fkav/72b8HNTtHG0m9vBeONRIHv/0ad3712415420fc0c5eb9de4a2c696b5/2026-fat-boy-m78-motorcycle-01',alt:'Harley-Davidson Fat Boy 2026',description:'Siluet ikonik dengan ban lebar, tampilan berotot, dan sentuhan krom yang kuat. Dirancang untuk tampil menonjol dengan bahasa desain yang langsung dikenali.',specs:['Milwaukee-Eight 117','Wide-tire stance','Desain ikonik']},
  {id:'road-glide',name:'Road Glide',type:'touring',label:'Touring',subtitle:'Long-distance icon',year:'2026',image:'https://cdpcdn.dx1app.com/products/USA/HD/2026/MC/TOUR/ROAD_GLIDE/50/AURORA_BLUE_DENIM_BLACK_FINISH/2000000004.jpg',alt:'Harley-Davidson Road Glide 2026 warna biru',description:'Motor touring dengan fairing khas, bagasi terintegrasi, dan desain yang dibentuk untuk perjalanan panjang. Perpaduan kenyamanan dan kehadiran yang berkarakter.',specs:['Grand American Touring','Fairing khas','Bagasi terintegrasi']},
  {id:'sportster-s',name:'Sportster S',type:'sport',label:'Sport',subtitle:'Modern muscle',year:'2026',image:'https://www.moto-seinajoki.fi/images/kuvapankki/maxi/Harley-Davidson-Sportster--S-2026-347799.png?mod=2025-11-16T18%3A23%3A44',alt:'Harley-Davidson Sportster S 2026 warna biru',description:'Interpretasi modern dari karakter Sportster. Postur agresif, ban depan lebar, dan detail kontemporer untuk tampilan yang berani.',specs:['Revolution Max 1250T','121 HP*','Gaya modern']},
  {id:'pan-america',name:'Pan America 1250 Special',type:'adventure',label:'Adventure',subtitle:'Explore further',year:'2026',image:'https://www.harley-davidson.com/ctfasset/5vy1mse9fkav/2ZUXz7safHKvRTUZzP0I4L/453f46505e3c1ff424f083d0578a0caf/2026-pan-america-1250-special-m72b-motorcycle',alt:'Harley-Davidson Pan America 1250 Special',description:'Adventure touring untuk menjelajahi lebih jauh. Postur tegak, desain utilitarian, dan identitas tangguh untuk pengendara yang menyukai rute beragam.',specs:['Adventure Touring','1250 cc class','Siap menjelajah']},
  {id:'heritage-classic',name:'Heritage Classic',type:'touring',label:'Cruiser / Touring',subtitle:'Classic soul',year:'2026',image:'https://www.harley-davidson.com/ctfasset/5vy1mse9fkav/3AXXEzMpmknsqKbIIHocox/15cf2adef2485b0e7929b8f04481f26b/2026-touring-group-beauty-ls.jpg?impolicy=myresize&rw=1920',alt:'Motor Harley-Davidson touring',description:'Nuansa klasik bertemu sentuhan modern. Siluet heritage dan detail touring menghadirkan karakter elegan bagi perjalanan santai maupun jarak jauh.',specs:['Classic styling','Touring character','Detail heritage']}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const grid = $('#productGrid');
const searchInput = $('#productSearch');
const emptyState = $('#emptyState');
const modal = $('#productModal');
const toast = $('#toast');
let activeFilter = 'all';
let currentModalModel = null;
let toastTimer = null;
let lastFocusedElement = null;

function getFavorites(){
  try { return JSON.parse(localStorage.getItem('starfall-favorites') || '[]'); }
  catch { return []; }
}
function setFavorites(ids){
  try { localStorage.setItem('starfall-favorites', JSON.stringify(ids)); }
  catch { /* Fitur favorit tetap berfungsi selama halaman terbuka. */ }
}
function showToast(message){
  $('#toastMessage').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function renderProducts(){
  const query = searchInput.value.trim().toLowerCase();
  const favorites = getFavorites();
  const filtered = models.filter(model => {
    const matchesFilter = activeFilter === 'all' || model.type === activeFilter || (activeFilter === 'cruiser' && model.id === 'heritage-classic');
    const searchable = `${model.name} ${model.label} ${model.subtitle} ${model.description}`.toLowerCase();
    return matchesFilter && searchable.includes(query);
  });
  grid.innerHTML = filtered.map((model,index) => `
    <article class="product-card" style="animation-delay:${Math.min(index*65,260)}ms">
      <div class="product-media">
        <span class="product-index">SD / 0${models.findIndex(m=>m.id===model.id)+1}</span>
        <span class="product-type">${escapeHTML(model.label)}</span>
        <img src="${model.image}" alt="${escapeHTML(model.alt)}" loading="lazy" onerror="this.style.opacity='.12';this.alt='Gambar tidak dapat dimuat';">
        <button class="favorite-btn ${favorites.includes(model.id)?'is-favorite':''}" data-favorite="${model.id}" aria-label="${favorites.includes(model.id)?'Hapus':'Tambahkan'} ${escapeHTML(model.name)} ke daftar minat" aria-pressed="${favorites.includes(model.id)}">${favorites.includes(model.id)?'♥':'♡'}</button>
      </div>
      <div class="product-info"><div class="product-subtitle">${escapeHTML(model.subtitle)}</div><h3>${escapeHTML(model.name)}</h3><p>${escapeHTML(model.description.slice(0,105))}${model.description.length>105?'…':''}</p>
        <div class="product-actions"><span>Hubungi untuk harga</span><button class="detail-link" data-details="${model.id}">Detail model <span>↗</span></button></div>
      </div>
    </article>`).join('');
  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
}
function toggleFavorite(id){
  const favorites = getFavorites();
  const model = models.find(item=>item.id===id);
  const isFavorite = favorites.includes(id);
  const updated = isFavorite ? favorites.filter(item=>item!==id) : [...favorites,id];
  setFavorites(updated);
  renderProducts();
  if(currentModalModel?.id === id) updateModalFavoriteButton();
  showToast(isFavorite ? `${model.name} dihapus dari daftar minat.` : `${model.name} ditambahkan ke daftar minat.`);
}
function updateModalFavoriteButton(){
  if(!currentModalModel) return;
  const isFavorite = getFavorites().includes(currentModalModel.id);
  $('#modalInterest').innerHTML = isFavorite ? 'Hapus dari daftar minat <span>♥</span>' : 'Tandai sebagai minat <span>♡</span>';
}
function openModelModal(id){
  const model = models.find(item=>item.id===id);
  if(!model) return;
  currentModalModel = model;
  lastFocusedElement = document.activeElement;
  $('#modalImage').src = model.image;
  $('#modalImage').alt = model.alt;
  $('#modalCategory').textContent = `${model.label} · MODEL YEAR ${model.year}`;
  $('#modalTitle').textContent = model.name;
  $('#modalDescription').textContent = model.description;
  $('#modalSpecs').innerHTML = model.specs.map(spec=>`<span class="modal-spec">${escapeHTML(spec)}</span>`).join('');
  updateModalFavoriteButton();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  $('#modalClose').focus();
}
function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  currentModalModel = null;
  if(lastFocusedElement) lastFocusedElement.focus();
}

// Katalog: event delegation membuat tombol tetap berjalan setelah filter diubah.
grid.addEventListener('click', event=>{
  const favoriteButton = event.target.closest('[data-favorite]');
  const detailButton = event.target.closest('[data-details]');
  if(favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
  if(detailButton) openModelModal(detailButton.dataset.details);
});
$$('.filter-chip').forEach(button=>button.addEventListener('click',()=>{
  activeFilter = button.dataset.filter;
  $$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip===button));
  renderProducts();
}));
searchInput.addEventListener('input',renderProducts);
$('#resetFilters').addEventListener('click',()=>{
  activeFilter='all'; searchInput.value='';
  $$('.filter-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.filter==='all'));
  renderProducts();
});

// Mobile navigation.
const navToggle = $('#navToggle');
const mainNav = $('#mainNav');
function closeNav(){mainNav.classList.remove('open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Buka menu');}
navToggle.addEventListener('click',()=>{
  const willOpen = !mainNav.classList.contains('open');
  mainNav.classList.toggle('open',willOpen);
  navToggle.setAttribute('aria-expanded',String(willOpen));
  navToggle.setAttribute('aria-label',willOpen?'Tutup menu':'Buka menu');
});
$$('.nav-link',mainNav).forEach(link=>link.addEventListener('click',closeNav));
document.addEventListener('click',event=>{if(!event.target.closest('.site-header')) closeNav();});

// Modal interaction and keyboard accessibility.
$('#modalClose').addEventListener('click',closeModal);
modal.addEventListener('click',event=>{if(event.target===modal) closeModal();});
$('#modalInterest').addEventListener('click',()=>{if(currentModalModel) toggleFavorite(currentModalModel.id);});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape') { if(modal.classList.contains('is-open')) closeModal(); closeNav(); }
  if(event.key==='Tab' && modal.classList.contains('is-open')){
    const focusable = $$('button:not([disabled]),a[href],input,select,textarea',modal).filter(el=>el.offsetParent!==null);
    if(!focusable.length) return;
    const first=focusable[0], last=focusable[focusable.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
});

// Demo form: validates input but intentionally does not send data to a backend.
$('#contactForm').addEventListener('submit',event=>{
  event.preventDefault();
  const form = event.currentTarget;
  if(!form.reportValidity()) return;
  const visitor = $('#visitorName').value.trim();
  const chosen = $('#interestModel').value;
  showToast(`Terima kasih, ${visitor}! Pesan demo berhasil disiapkan${chosen?` untuk ${chosen}`:''}.`);
  form.reset();
});

// Scroll animations and active navigation state.
const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
  });
},{threshold:0.12});
$$('.reveal').forEach(element=>revealObserver.observe(element));
const header = $('.site-header');
const scrollTopButton = $('#scrollTop');
const navLinks = $$('.nav-link');
const sections = $$('main section[id]');
window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>12);
  scrollTopButton.classList.toggle('visible',window.scrollY>500);
},{passive:true});
scrollTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
if('IntersectionObserver' in window){
  const sectionObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}
  }),{rootMargin:'-35% 0px -55% 0px'});
  sections.forEach(section=>sectionObserver.observe(section));
}
$('#currentYear').textContent = new Date().getFullYear();
renderProducts();
