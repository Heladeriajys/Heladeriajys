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

const PAYMENT_ALIAS = "jys.helados";
const PAYMENT_CBU = "4530000800064115348581";
const PAYMENT_HOLDER = "Aldana Rocio Sempolis";
const WHATSAPP_PHONE = "5492214949199";

let currentCategory = "Todos";
let searchQuery = "";
let cart = {};

try {
  cart = JSON.parse(localStorage.getItem("jys-cart")) || {};
} catch {
  cart = {};
}

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
  17: "foto-crema-val.jpg",
  18: "foto-rulito-may.jpg",
  19: "foto-copon-may.jpg",
  23: "foto-agua-val.jpg",
  25: "foto-balde-5-litros.jpg",
  26: "foto-mini-bombon-val.jpg",
  27: "foto-tortas-heladas.jpg",
  28: "foto-mini-bombon-crocante-val.jpg",
  29: "foto-tricolor.jpg",
  30: "foto-tricolor.jpg",
  31: "foto-tacitas-90cc.jpg"
};

const money = n =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n || 0);

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
}

function getCartTotal() {
  return Object.entries(cart).reduce((total, [idStr, qty]) => {
    const product = PRODUCTS.find(p => p.id === Number(idStr));
    return total + (product ? product.price * qty : 0);
  }, 0);
}

function openCartModal() {
  const modal =
    document.getElementById("cartModal") ||
    document.querySelector(".cart-sidebar");

  if (modal) modal.classList.add("open", "active");
}

function closeCartModal() {
  const modal =
    document.getElementById("cartModal") ||
    document.querySelector(".cart-sidebar");

  if (modal) modal.classList.remove("open", "active");
}

function renderFilters() {
  if (!filtersEl) return;

  filtersEl.innerHTML = categories().map(category => `
    <button
      type="button"
      class="filter ${category === currentCategory ? "active" : ""}"
      data-category="${category}">
      ${category}
    </button>
  `).join("");

  filtersEl.querySelectorAll(".filter").forEach(button => {
    button.onclick = () => {
      currentCategory = button.dataset.category;
      renderFilters();
      renderProducts();
    };
  });
}

function productImage(product) {
  const image = IMAGE_BY_ID[product.id];

  if (!image) {
    return `
      <div class="product-image-fallback"
        style="display:flex;width:100%;min-height:140px;align-items:center;justify-content:center;font-size:48px;background:#fff8fa;">
        ${product.emoji || "🍦"}
      </div>
    `;
  }

  return `
    <img
      src="${image}"
      alt="${product.name}"
      class="product-photo"
      style="width:100%;height:auto;object-fit:contain;"
      loading="lazy"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
    <div class="product-image-fallback"
      style="display:none;width:100%;min-height:140px;align-items:center;justify-content:center;font-size:48px;background:#fff8fa;">
      ${product.emoji || "🍦"}
    </div>
  `;
}

function renderProducts() {
  if (!productsEl) return;

  let list = currentCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  if (searchQuery.trim()) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (!list.length) {
    productsEl.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;padding:20px;color:#777">
        No se encontraron productos.
      </p>
    `;
    return;
  }

  productsEl.innerHTML = list.map(product => `
    <div class="product-card">
      <div class="product-image-container">
        ${productImage(product)}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${money(product.price)}</p>
        <button type="button" class="add-to-cart-btn"
          onclick="addToCart(${product.id})">
          Agregar al carrito
        </button>
      </div>
    </div>
  `).join("");
}

if (searchInput) {
  searchInput.addEventListener("input", event => {
    searchQuery = event.target.value;
    renderProducts();
  });
}

function saveCart() {
  localStorage.setItem("jys-cart", JSON.stringify(cart));
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

/* PANEL DE PAGO */

function createPaymentPanel() {
  if (!paymentMethodEl || document.getElementById("paymentDetailsPanel")) {
    return;
  }

  const panel = document.createElement("div");
  panel.id = "paymentDetailsPanel";
  panel.style.cssText =
    "display:none;margin:12px 0;padding:16px;border:1px solid #dce8ec;border-radius:12px;background:#f3fbfc;color:#333;line-height:1.6;";

  paymentMethodEl.insertAdjacentElement("afterend", panel);

  panel.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;

    const value = button.dataset.copy;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = value;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";
        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        if (!copied) throw new Error("No se pudo copiar");
      }

      const originalText = button.textContent;
      button.textContent = "¡Copiado!";

      setTimeout(() => {
        button.textContent = originalText;
      }, 1500);
    } catch {
      window.prompt("Copiá este dato:", value);
    }
  });
}

function renderPaymentPanel() {
  if (!paymentMethodEl) return;

  createPaymentPanel();

  const panel = document.getElementById("paymentDetailsPanel");
  if (!panel) return;

  const method = paymentMethodEl.value;
  const total = getCartTotal();

  if (method === "Transferencia") {
    panel.style.display = "block";

    panel.innerHTML = `
      <h3 style="margin:0 0 10px;font-size:18px">Datos para transferir</h3>

      <p style="margin-bottom:8px">
        <strong>Titular:</strong><br>${PAYMENT_HOLDER}
      </p>

      <p style="margin-bottom:10px">
        <strong>Alias:</strong><br>
        <span style="overflow-wrap:anywhere">${PAYMENT_ALIAS}</span><br>
        <button type="button" data-copy="${PAYMENT_ALIAS}"
          style="margin-top:6px;padding:8px 12px;border:0;border-radius:7px;background:#d8f3f5;cursor:pointer;font-weight:600">
          Copiar alias
        </button>
      </p>

      <p style="margin-bottom:10px">
        <strong>CBU:</strong><br>
        <span style="overflow-wrap:anywhere">${PAYMENT_CBU}</span><br>
        <button type="button" data-copy="${PAYMENT_CBU}"
          style="margin-top:6px;padding:8px 12px;border:0;border-radius:7px;background:#d8f3f5;cursor:pointer;font-weight:600">
          Copiar CBU
        </button>
      </p>

      <div style="padding:12px;background:#fff;border-radius:8px;margin-top:8px">
        <strong>Total del pedido:</strong>
        <div style="font-size:23px;font-weight:700;color:#087e8b">
          ${money(total)}
        </div>
      </div>

      <p style="font-size:13px;margin-top:10px">
        Verificá el titular y el importe antes de transferir.
        El pago queda pendiente hasta que se confirme la transferencia.
      </p>
    `;
  } else if (method === "Mercado Pago") {
    panel.style.display = "block";

    panel.innerHTML = `
      <h3 style="margin:0 0 8px;font-size:18px">Pago con billetera virtual</h3>
      <p>El total de tu pedido es <strong>${money(total)}</strong>.</p>
      <p style="margin-top:8px">
        Enviá tu pedido por WhatsApp para solicitar un enlace de pago.
        El enlace debe generarse por el importe correcto.
      </p>
      <p style="font-size:13px;margin-top:8px">
        Todavía no se realizó ningún pago.
      </p>
    `;
  } else {
    panel.style.display = "none";
    panel.innerHTML = "";
  }
}

if (paymentMethodEl) {
  paymentMethodEl.addEventListener("change", renderPaymentPanel);
}

function renderCart() {
  if (!cartItemsEl) return;

  const entries = Object.entries(cart);
  let count = 0;

  if (!entries.length) {
    cartItemsEl.innerHTML = "<p class='empty-cart'>Tu carrito está vacío</p>";
  } else {
    cartItemsEl.innerHTML = entries.map(([idStr, qty]) => {
      const id = Number(idStr);
      const product = PRODUCTS.find(p => p.id === id);

      if (!product) return "";

      count += qty;
      const subtotal = product.price * qty;

      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <div>${money(product.price)} x ${qty} = ${money(subtotal)}</div>
          </div>
          <div class="cart-controls">
            <button type="button" onclick="removeFromCart(${id})">-</button>
            <span>${qty}</span>
            <button type="button" onclick="addToCart(${id})">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const total = getCartTotal();

  if (cartTotalEl) cartTotalEl.textContent = money(total);
  if (cartCountEl) cartCountEl.textContent = ` (${count})`;

  if (minAmountNoticeEl) minAmountNoticeEl.style.display = "none";

  if (whatsappBtn) {
    whatsappBtn.disabled = false;
    whatsappBtn.style.opacity = "1";
    whatsappBtn.style.cursor = "pointer";
  }

  document.querySelectorAll(".cart-btn-header, #openCart, #openCartBtn")
    .forEach(button => {
      button.onclick = openCartModal;
    });

  renderPaymentPanel();
}

if (closeCartBtn) {
  closeCartBtn.onclick = closeCartModal;
}

if (whatsappBtn) {
  whatsappBtn.onclick = () => {
    const entries = Object.entries(cart);

    if (!entries.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    const total = getCartTotal();
    const address = deliveryAddressEl ? deliveryAddressEl.value.trim() : "";
    const payment = paymentMethodEl ? paymentMethodEl.value : "No especificada";
    const notes = orderNotesEl ? orderNotesEl.value.trim() : "";

    if (!address) {
      alert("Por favor, ingresá tu dirección de entrega antes de enviar.");
      return;
    }

    let message = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";

    entries.forEach(([idStr, qty]) => {
      const product = PRODUCTS.find(p => p.id === Number(idStr));

      if (product) {
        message += `• ${product.name} x${qty} - ${money(product.price * qty)}\n`;
      }
    });

    message += `\n*Total:* ${money(total)}`;
    message += `\n*Forma de pago:* ${payment}`;
    message += `\n*Dirección:* ${address}`;

    if (payment === "Transferencia") {
      message += "\n\n*Datos para transferir*";
      message += `\nTitular: ${PAYMENT_HOLDER}`;
      message += `\nAlias: ${PAYMENT_ALIAS}`;
      message += `\nCBU: ${PAYMENT_CBU}`;
      message += `\nImporte: ${money(total)}`;
      message += "\nEl pago queda pendiente de verificación.";
    }

    if (payment === "Mercado Pago") {
      message += "\n\nQuisiera recibir un enlace de pago por billetera virtual.";
    }

    if (notes) message += `\n*Notas:* ${notes}`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
}

/* INICIALIZACIÓN */
createPaymentPanel();
renderFilters();
renderProducts();
renderCart();
