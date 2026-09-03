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

/*
  FOTOS VERIFICADAS A PARTIR DE LAS IMÁGENES ORIGINALES.
  Si un producto no tiene una foto claramente identificada,
  se mantiene su emoji en lugar de poner una foto equivocada.
*/
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
  n
    ? new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
      }).format(n)
    : "Consultar";

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}

function renderFilters() {
  filtersEl.innerHTML = categories()
    .map(
      c =>
        `<button class="filter ${c === currentCategory ? "active" : ""}" data-category="${c}">${c}</button>`
    )
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
    ? `<img src="${image}" alt="${p.name} ${p.brand}" class="product-photo"
        style="width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box;">`
    : (p.emoji || "🍦");
}

function renderProducts() {
  const list =
    currentCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === currentCategory);

  productsEl.innerHTML = list
    .map(
      p => `
      <article class="product-card" onclick="openProduct(${p.id})">
        <div class="product-image">${productImage(p)}</div>
        <div class="product-body">
          <span class="brand">${p.brand}</span>
          <h3>${p.name}</h3>
          <div class="price">${money(p.price)}</div>
          <div class="presentation">${p.presentation || "Consultar presentación"}</div>
          <button class="add-btn" onclick="event.stopPropagation(); openProduct(${p.id})">
            Ver producto
          </button>
        </div>
      </article>
    `
    )
    .join("");
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const image = IMAGE_BY_ID[p.id];
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

  const visual = image
    ? `<img src="${image}" alt="${p.name} ${p.brand}"
        style="width:100%;height:260px;object-fit:contain;border-radius:18px;background:#fff4ee;">`
    : `<div style="font-size:80px;margin:20px;">${p.emoji || "🍦"}</div>`;

  modal.innerHTML = `
    <div style="background:white;width:100%;max-width:420px;border-radius:24px;padding:20px;text-align:center;max-height:90vh;overflow:auto;">
      <button onclick="document.getElementById('productModal').remove()"
        style="float:right;border:0;background:none;font-size:28px;">×</button>
      ${visual}
      <div style="color:#c76b82;font-weight:bold;margin-top:12px;">${p.brand}</div>
      <h2>${p.name}</h2>
      <p>${p.presentation || "Consultar presentación disponible"}</p>
      <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}"
        target="_blank"
        style="display:block;background:#25D366;color:white;text-decoration:none;padding:15px;border-radius:14px;font-weight:bold;">
        📲 Consultar precio por WhatsApp
      </a>
      <button onclick="document.getElementById('productModal').remove()"
        style="margin-top:12px;border:0;background:none;padding:10px;">
        ← Volver al catálogo
      </button>
    </div>
  `;

  document.body.appendChild(modal);
}

function save() {
  localStorage.setItem("jys-cart", JSON.stringify(cart));
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  save();
  renderCart();
  cartEl.classList.add("open");
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  save();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart);

  cartItemsEl.innerHTML = !entries.length
    ? `<p class="empty">Todavía no agregaste productos.</p>`
    : entries.map(([id, qty]) => {
        const p = PRODUCTS.find(x => x.id === Number(id));
        return `
          <div class="cart-row">
            <div>
              <strong>${p.name}</strong><br>
              <small>${p.brand} · ${money(p.price)}</small>
            </div>
            <div class="qty">
              <button onclick="changeQty(${p.id},-1)">−</button>
              <span>${qty}</span>
              <button onclick="changeQty(${p.id},1)">+</button>
            </div>
          </div>
        `;
      }).join("");

  const count = entries.reduce((s, [, q]) => s + q, 0);
  const total = entries.reduce((s, [id, q]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return s + (p.price || 0) * q;
  }, 0);

  cartCountEl.textContent = count;
  cartTotalEl.textContent = money(total);
}

function sendWhatsApp() {
  const entries = Object.entries(cart);

  if (!entries.length) {
    alert("Agregá al menos un producto al pedido.");
    return;
  }

  const lines = entries.map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return `• ${qty} x ${p.name} (${p.brand})`;
  });

  const total = entries.reduce((s, [id, q]) => {
    const p = PRODUCTS.find(x => x.id === Number(id));
    return s + (p.price || 0) * q;
  }, 0);

  const text =
    `Hola! 👋 Quiero hacer un pedido en Heladería JyS:\n\n` +
    `${lines.join("\n")}\n\n` +
    `Total estimado: ${money(total)}\n\n` +
    `¿Me pasan disponibilidad y forma de entrega?`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
    "_blank"
  );
}

openCartBtn.onclick = () => cartEl.classList.add("open");
closeCartBtn.onclick = () => cartEl.classList.remove("open");
whatsappBtn.onclick = sendWhatsApp;

renderFilters();
renderProducts();
renderCart();
