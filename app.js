const productsEl = document.getElementById("products");
const filtersEl = document.getElementById("filters");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const whatsappBtn = document.getElementById("whatsappBtn");

let currentCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("jys-cart")) || {};

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
  11: "foto-pote-3-litros.jpg",
  12: "foto-carita-may.jpg",
  13: "foto-alfabom-may.jpg",
  14: "foto-rulo-relleno.jpg",
  15: "foto-cassata-may.jpg",
  16: "palito-agua-may.jpg",
  17: "foto-crema-may.jpg",
  18: "foto-torneado-may.jpg",
  19: "foto-copon-may.jpg",
  23: "foto-agua-val.jpg",
  25: "foto-balde-5-litros.jpg"
};

const money = n =>
  n ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n) : "";

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
    ? `<img src="${image}" alt="${p.name}" class="product-photo" style="width:100%; height:auto; object-fit:cover;">`
    : (p.emoji || "🍦");
}

function renderProducts() {
  if (!productsEl) return;

  const list = currentCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  productsEl.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image-container">
        ${productImage(p)}
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">${money(p.price)}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();

  // Abre el carrito automáticamente al presionar el botón
  const cartModal = document.getElementById("cartModal");
  if (cartModal) {
    cartModal.classList.add("open");
    cartModal.classList.add("active");
  }
}

function removeFromCart(id) {
  if (cart[id]) {
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("jys-cart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartItemsEl) return;

  const entries = Object.entries(cart);
  let total = 0;
  let count = 0;

  if (entries.length === 0) {
    cartItemsEl.innerHTML = "<p class='empty-cart'>Tu carrito está vacío</p>";
  } else {
    cartItemsEl.innerHTML = entries.map(([idStr, qty]) => {
      const id = Number(idStr);
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return "";

      const subtotal = product.price * qty;
      total += subtotal;
      count += qty;

      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <div>${money(product.price)} x ${qty} = ${money(subtotal)}</div>
          </div>
          <div class="cart-controls">
            <button onclick="removeFromCart(${id})">-</button>
            <span>${qty}</span>
            <button onclick="addToCart(${id})">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  if (cartTotalEl) cartTotalEl.textContent = money(total);
  if (cartCountEl) cartCountEl.textContent = count;
}

if (openCartBtn) {
  openCartBtn.onclick = () => {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.classList.add("open");
      cartModal.classList.add("active");
    }
  };
}

if (closeCartBtn) {
  closeCartBtn.onclick = () => {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.classList.remove("open");
      cartModal.classList.remove("active");
    }
  };
}

if (whatsappBtn) {
  whatsappBtn.onclick = () => {
    const entries = Object.entries(cart);
    if (entries.length === 0) return alert("Tu carrito está vacío.");

    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
    let total = 0;

    entries.forEach(([idStr, qty]) => {
      const id = Number(idStr);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        const subtotal = product.price * qty;
        total += subtotal;
        message += `• ${product.name} x${qty} - ${money(subtotal)}\n`;
      }
    });

    message += `\n*Total:* ${money(total)}`;

    const phone = "5492213524121";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
}

// Inicialización
renderFilters();
renderProducts();
renderCart();
