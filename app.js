const productsEl = document.getElementById("products");
const filtersEl = document.getElementById("filters");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const closeCartBtn = document.getElementById("closeCart");
const whatsappBtn = document.getElementById("whatsappBtn");
const searchInput = document.getElementById("searchInput");
const paymentMethodEl = document.getElementById("paymentMethod");
const deliveryAddressEl = document.getElementById("deliveryAddress");
const orderNotesEl = document.getElementById("orderNotes");
const minAmountNoticeEl = document.getElementById("minAmountNotice");

const MIN_ORDER_AMOUNT = 35000;
let currentCategory = "Todos";
let searchQuery = "";
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
  18: "foto-rulito-may.jpg",
  19: "foto-copon-may.jpg",
  23: "foto-agua-val.jpg",
  25: "foto-balde-5-litros.jpg",
  26: "foto-mini-bombon-val.jpg"
};

const money = n =>
  n ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n) : "$0";

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}

function openCartModal() {
  const cartModal = document.getElementById("cartModal") || document.querySelector(".cart-sidebar");
  if (cartModal) {
    cartModal.classList.add("open");
    cartModal.classList.add("active");
  }
}

function closeCartModal() {
  const cartModal = document.getElementById("cartModal") || document.querySelector(".cart-sidebar");
  if (cartModal) {
    cartModal.classList.remove("open");
    cartModal.classList.remove("active");
  }
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

  let list = currentCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  if (searchQuery.trim() !== "") {
    list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (list.length === 0) {
    productsEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px; color: #777;">No se encontraron productos.</p>`;
    return;
  }

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

if (searchInput) {
  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderProducts();
  };
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  openCartModal();
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
  if (cartCountEl) cartCountEl.textContent = ` (${count})`;

  // Control del mínimo de compra
  if (minAmountNoticeEl && whatsappBtn) {
    if (total >= MIN_ORDER_AMOUNT) {
      minAmountNoticeEl.style.background = "#d4edda";
      minAmountNoticeEl.style.color = "#155724";
      minAmountNoticeEl.style.borderColor = "#c3e6cb";
      minAmountNoticeEl.textContent = "¡Mínimo alcanzado!";
      whatsappBtn.disabled = false;
      whatsappBtn.style.opacity = "1";
      whatsappBtn.style.cursor = "pointer";
    } else {
      const diff = MIN_ORDER_AMOUNT - total;
      minAmountNoticeEl.style.background = "#ffe6e6";
      minAmountNoticeEl.style.color = "#d9534f";
      minAmountNoticeEl.style.borderColor = "#f5c6cb";
      minAmountNoticeEl.textContent = `Faltan ${money(diff)} para el mínimo ($35.000)`;
      whatsappBtn.disabled = true;
      whatsappBtn.style.opacity = "0.5";
      whatsappBtn.style.cursor = "not-allowed";
    }
  }

  const headerCartBtns = document.querySelectorAll(".cart-btn-header, #openCart");
  headerCartBtns.forEach(btn => {
    btn.onclick = openCartModal;
  });
}

if (closeCartBtn) {
  closeCartBtn.onclick = closeCartModal;
}

if (whatsappBtn) {
  whatsappBtn.onclick = () => {
    const entries = Object.entries(cart);
    if (entries.length === 0) return alert("Tu carrito está vacío.");

    let total = 0;
    entries.forEach(([idStr, qty]) => {
      const p = PRODUCTS.find(prod => prod.id === Number(idStr));
      if (p) total += p.price * qty;
    });

    if (total < MIN_ORDER_AMOUNT) {
      return alert(`El monto mínimo de compra es de $35.000. Te faltan ${money(MIN_ORDER_AMOUNT - total)}.`);
    }

    const address = deliveryAddressEl ? deliveryAddressEl.value.trim() : "";
    const payment = paymentMethodEl ? paymentMethodEl.value : "No especificada";
    const notes = orderNotesEl ? orderNotesEl.value.trim() : "";

    if (!address) {
      return alert("Por favor, ingresá tu dirección de entrega antes de enviar.");
    }

    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";

    entries.forEach(([idStr, qty]) => {
      const id = Number(idStr);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        const subtotal = product.price * qty;
        message += `• ${product.name} x${qty} - ${money(subtotal)}\n`;
      }
    });

    message += `\n*Total:* ${money(total)}`;
    message += `\n*Forma de Pago:* ${payment}`;
    message += `\n*Dirección:* ${address}`;
    if (notes) {
      message += `\n*Notas:* ${notes}`;
    }

    const phone = "5492214949199";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
}

// Inicialización
renderFilters();
renderProducts();
renderCart();
      
