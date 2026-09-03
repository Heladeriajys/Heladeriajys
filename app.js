const WHATSAPP_NUMBER = "5492214949199";

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

const IMAGE_BY_ID = {
  1: "foto-cono-val.jpg",
  2: "foto-cono-may.jpg",
  3: "foto-bombon-val.jpg",
  4: "foto-bombon-may.jpg",
  5: "foto-bombon-crocante-val.jpg",
  6: "foto-bombon-crocante-may.jpg",
  7: "foto-bombon-split.jpg",
  9: "foto-pote-360-may.jpg",
  10: "foto-pote-1400-may.jpg",
  11: "foto-pote-3-litros-may.jpg",
  12: "foto-carita-may.jpg",
  13: "foto-alfabom-may.jpg",
  14: "foto-rulito-may.jpg",
  15: "foto-cassata-may.jpg",
  16: "foto-agua-may.jpg",
  17: "foto-crema-may.jpg",
  18: "foto-torneado-may.jpg",
  19: "foto-copon-may.jpg",
  23: "foto-agua-val.jpg",
  
  25: "foto-balde-5-litros.jpg"
};

const money = n =>
  n ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n) : "Consultar";

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}

function renderFilters() {
  if (!filtersEl) return;
  filtersEl.innerHTML = categories()
    .map(c => `<button class="filter ${c === currentCategory ? "active" : ""}" data-category="${c}">${c}</button>`)
    .join("");

  filtersEl.querySelectorAll(".filter").forEach(btn => {
    btn.onclick = () => {
      currentCategory = btn.dataset.category;
      renderFilters();
      renderProducts();
    };
  });
}

function productImage(p) {
  const image = IMAGE_BY_ID[p.id];
  return image
    ? `<img src="${image}" alt="${p.name}" class="product-photo" style="width:100%;height:140px;object-fit:contain;padding:8px;">`
    : (p.emoji || "🍦");
}

function renderProducts() {
  if (!productsEl) return;
  const list = currentCategory === "Todos" ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCategory);

  productsEl.innerHTML = list
    .map(
      p => `
      <article class="product-card" style="border:1px solid #ddd; padding:12px; border-radius:8px; text-align:center;">
        <div class="product-image">${productImage(p)}</div>
        <div class="product-body">
          <small>${p.brand}</small>
          <h3 style="margin:4px 0;">${p.name}</h3>
          <div><strong>${money(p.price)}</strong></div>
          <button onclick="addToCart(${p.id})" style="margin-top:8px; padding:6px 12px; cursor:pointer;">
            Agregar al pedido
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCart();
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("jys-cart", JSON.stringify(cart));
}

function updateCart() {
  let total = 0;
  let count = 0;
  let itemsHtml = "";

  Object.keys(cart).forEach(id => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    if (p) {
      const qty = cart[id];
      const subtotal = (p.price || 0) * qty;
      total += subtotal;
      count += qty;

      itemsHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <strong>${p.name}</strong><br>
            <small>${money(p.price)} x ${qty}</small>
          </div>
          <div>
            <button onclick="removeFromCart(${p.id})">-</button>
            <span style="margin:0 4px;">${qty}</span>
            <button onclick="addToCart(${p.id})">+</button>
          </div>
        </div>
      `;
    }
  });

  if (cartItemsEl) cartItemsEl.innerHTML = itemsHtml || "<p>Todavía no agregaste productos.</p>";
  if (cartTotalEl) cartTotalEl.textContent = money(total);
  if (cartCountEl) cartCountEl.textContent = count;
}

function sendWhatsApp() {
  let text = "¡Hola! Quisiera realizar el siguiente pedido en HeladeríaJyS:\n\n";
  let total = 0;

  Object.keys(cart).forEach(id => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    if (p) {
      const qty = cart[id];
      const subtotal = (p.price || 0) * qty;
      total += subtotal;
      text += `• ${qty}x ${p.name} (${p.brand}) - ${money(subtotal)}\n`;
    }
  });

  text += `\n*Total estimado: ${money(total)}*`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
}

if (openCartBtn && cartEl) openCartBtn.onclick = () => cartEl.classList.add("active");
if (closeCartBtn && cartEl) closeCartBtn.onclick = () => cartEl.classList.remove("active");
if (whatsappBtn) whatsappBtn.onclick = sendWhatsApp;

renderFilters();
renderProducts();
updateCart();
      
