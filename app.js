const WHATSAPP_NUMBER = "5492214949199"; // REEMPLAZAR por el número de WhatsApp de JyS.

const productsEl = document.getElementById("products");
const filtersEl = document.getElementById("filters");
const cartEl = document.getElementById("cart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const whatsappBtn = document.getElementById("whatsappBtn");

let currentCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("jys-cart") || "{}");

const money = n => n ? new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n) : "Consultar";

function categories(){
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}

function renderFilters(){
  filtersEl.innerHTML = categories().map(c =>
    `<button class="filter ${c===currentCategory ? "active":""}" data-category="${c}">${c}</button>`
  ).join("");
  filtersEl.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => { currentCategory = btn.dataset.category; renderFilters(); renderProducts(); };
  });
}

function renderProducts(){
  const list = currentCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  productsEl.innerHTML = list.map(p => `
    <article class="product-card" onclick="openProduct(${p.id})">
      <div class="product-image">${p.emoji}</div>

      <div class="product-body">
        <span class="brand">${p.brand}</span>
        <h3>${p.name}</h3>
        <div class="presentation">${p.presentation}</div>

        <button class="add-btn" onclick="event.stopPropagation(); openProduct(${p.id})">
          Ver producto
        </button>
      </div>
    </article>
  `).join("");
}
function openProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;

  const message = `Hola! 👋 Quiero consultar el precio de ${p.name} (${p.brand}).`;

  const modal = document.createElement("div");
  modal.id = "productModal";

  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.65);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
    padding:20px;
  `;

  modal.innerHTML = `
    <div style="background:white;width:100%;max-width:420px;border-radius:24px;padding:25px;text-align:center;">
      <button onclick="document.getElementById('productModal').remove()" style="float:right;border:0;background:none;font-size:28px;">×</button>

      <div style="font-size:80px;margin:20px;">${p.emoji}</div>

      <div style="color:#c76b82;font-weight:bold;">${p.brand}</div>

      <h2>${p.name}</h2>

      <p>${p.presentation || "Consultar presentación disponible"}</p>

      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}"
         target="_blank"
         style="display:block;background:#25D366;color:white;text-decoration:none;padding:15px;border-radius:14px;font-weight:bold;">
        📲 Consultar precio por WhatsApp
      </a>

      <button onclick="document.getElementById('productModal').remove()" style="margin-top:12px;border:0;background:none;padding:10px;">
        ← Volver al catálogo
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}
function save(){ localStorage.setItem("jys-cart", JSON.stringify(cart)); }

function addToCart(id){
  cart[id] = (cart[id] || 0) + 1;
  save(); renderCart(); cartEl.classList.add("open");
}

function changeQty(id, delta){
  cart[id] = (cart[id] || 0) + delta;
  if(cart[id] <= 0) delete cart[id];
  save(); renderCart();
}

function renderCart(){
  const entries = Object.entries(cart);
  if(!entries.length){
    cartItemsEl.innerHTML = `<p class="empty">Todavía no agregaste productos.</p>`;
  } else {
    cartItemsEl.innerHTML = entries.map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === Number(id));
      return `<div class="cart-row">
        <div><strong>${p.name}</strong><br><small>${p.brand} · ${money(p.price)}</small></div>
        <div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
      </div>`;
    }).join("");
  }
  const count = entries.reduce((s,[,q]) => s+q,0);
  const total = entries.reduce((s,[id,q]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return s + (p.price || 0) * q;
  },0);
  cartCountEl.textContent = count;
  cartTotalEl.textContent = money(total);
}

function sendWhatsApp(){
  const entries = Object.entries(cart);
  if(!entries.length){ alert("Agregá al menos un producto al pedido."); return; }
  const lines = entries.map(([id,qty]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return `• ${qty} x ${p.name} (${p.brand})`;
  });
  const total = entries.reduce((s,[id,q]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return s + (p.price || 0) * q;
  },0);
  const text = `Hola! 👋 Quiero hacer un pedido en Heladería JyS:%0A%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal estimado: ${encodeURIComponent(money(total))}%0A%0A¿Me pasan disponibilidad y forma de entrega?`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
}

openCartBtn.onclick = () => cartEl.classList.add("open");
closeCartBtn.onclick = () => cartEl.classList.remove("open");
whatsappBtn.onclick = sendWhatsApp;

renderFilters();
renderProducts();
renderCart();
