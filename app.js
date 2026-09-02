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
  const list = currentCategory === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCategory);
  productsEl.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">${p.emoji}</div>
      <div class="product-body">
        <span class="brand">${p.brand}</span>
        <h3>${p.name}</h3>
        <div class="presentation">${p.presentation}</div>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn" onclick="addToCart(${p.id})">Agregar al pedido</button>
      </div>
    </article>
  `).join("");
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
