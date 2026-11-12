
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
  3: "foto-bombon-val.jpg",
  5: "foto-bombon-crocante-val.jpg",
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
  31: "foto-tacitas-90cc.jpg",
  32: "foto-latidos.jpg",
  33: "foto-chupa-chups.jpg",
  34: "foto-alfa-granizado.jpg",
  35: "foto-alfatur.jpg",
  36: "foto-nevado.png"
};

const money = n =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(n || 0);

function cartKey(id, flavor = "") {
  return `${id}::${flavor}`;
}

function parseCartKey(key) {
  const parts = String(key).split("::");

  return {
    id: Number(parts[0]),
    flavor: parts.slice(1).join("::")
  };
}

function normalizeCart() {
  const normalized = {};

  Object.entries(cart).forEach(([key, qty]) => {
    if (typeof qty !== "number" || qty <= 0) return;

    if (key.includes("::")) {
      normalized[key] = (normalized[key] || 0) + qty;
    } else {
      const id = Number(key);

      if (PRODUCTS.some(p => p.id === id)) {
        const newKey = cartKey(id);
        normalized[newKey] = (normalized[newKey] || 0) + qty;
      }
    }
  });

  cart = normalized;
}

function getCartTotal() {
  return Object.entries(cart).reduce((total, [key, qty]) => {
    const { id } = parseCartKey(key);
    const product = PRODUCTS.find(p => p.id === id);

    return total + (product ? product.price * qty : 0);
  }, 0);
}

function categories() {
  return ["Todos", ...new Set(PRODUCTS.map(p => p.category))];
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

// SELECTOR DE SABORES MEJORADO
function renderFlavorSelector(product) {
  if (!product.flavors || !product.flavors.length) {
    return "";
  }

  return `
    <div class="flavor-selector" style="
      margin:10px 0;
      width:100%;
      max-width:100%;
      min-width:0;
      box-sizing:border-box;
      overflow:hidden;
    ">

      <label style="
        display:block;
        font-weight:600;
        margin-bottom:8px;
        font-size:13px;
        color:#444;
      ">
        Elegí uno o varios sabores:
      </label>

      <div style="
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:6px;
        width:100%;
        max-width:100%;
        box-sizing:border-box;
      ">

        ${product.flavors.map(flavor => `
          <label style="
            display:flex;
            align-items:center;
            justify-content:flex-start;
            gap:5px;
            min-width:0;
            max-width:100%;
            box-sizing:border-box;
            padding:8px 6px;
            border:1px solid #f3b5c8;
            border-radius:9px;
            background:#fff8fa;
            font-size:11px;
            line-height:1.3;
            cursor:pointer;
            overflow:hidden;
          ">

            <input
              type="checkbox"
              class="product-flavor-checkbox"
              data-product-id="${product.id}"
              value="${flavor}"
              style="
                accent-color:#f76f96;
                width:14px;
                height:14px;
                min-width:14px;
                margin:0;
                flex-shrink:0;
                cursor:pointer;
              ">

            <span style="
              display:block;
              min-width:0;
              flex:1;
              white-space:normal;
              overflow-wrap:anywhere;
              word-break:normal;
            ">${flavor}</span>

          </label>
        `).join("")}

      </div>

      <small style="
        display:block;
        color:#888;
        margin-top:7px;
        font-size:11px;
        line-height:1.4;
      ">
        Cada sabor seleccionado agrega una caja completa.
      </small>

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

        ${renderFlavorSelector(product)}

        <button type="button" class="add-to-cart-btn"
          onclick="window.addToCart(${product.id})">
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

// AGREGAR PRODUCTOS Y VARIOS SABORES
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) return;

  if (product.flavors && product.flavors.length) {

    const selectedFlavors = [
      ...document.querySelectorAll(
        `.product-flavor-checkbox[data-product-id="${id}"]:checked`
      )
    ].map(input => input.value);

    if (!selectedFlavors.length) {
      alert("Por favor, elegí al menos un sabor.");
      return;
    }

    selectedFlavors.forEach(flavor => {
      const key = cartKey(id, flavor);

      cart[key] = (cart[key] || 0) + 1;
    });

    document.querySelectorAll(
      `.product-flavor-checkbox[data-product-id="${id}"]`
    ).forEach(input => {
      input.checked = false;
    });

  } else {

    const key = cartKey(id, "");

    cart[key] = (cart[key] || 0) + 1;
  }

  saveCart();
  renderCart();
  openCartModal();
}

window.addToCart = addToCart;

// BOTONES DEL CARRITO: +, - Y PAPELERA
if (cartItemsEl) {

  cartItemsEl.addEventListener("click", event => {

    const button = event.target.closest("[data-cart-action]");

    if (!button || !cartItemsEl.contains(button)) return;

    const key = decodeURIComponent(button.dataset.cartKey || "");
    const action = button.dataset.cartAction;

    if (!Object.prototype.hasOwnProperty.call(cart, key)) return;

    if (action === "increase") {
      cart[key] += 1;
    }

    if (action === "decrease") {
      cart[key] -= 1;

      if (cart[key] <= 0) {
        delete cart[key];
      }
    }

    if (action === "remove") {
      delete cart[key];
    }

    saveCart();
    renderCart();

  });

}

function createPaymentPanel() {
  if (
    !paymentMethodEl ||
    document.getElementById("paymentDetailsPanel")
  ) return;

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
      <h3 style="margin:0 0 10px;font-size:18px">
        Datos para transferir
      </h3>

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
      <h3 style="margin:0 0 8px;font-size:18px">
        Pago con billetera virtual
      </h3>

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

// MOSTRAR CARRITO
function renderCart() {
  if (!cartItemsEl) return;

  const entries = Object.entries(cart);

  if (!entries.length) {

    cartItemsEl.innerHTML =
      "<p class='empty-cart'>Tu carrito está vacío</p>";

  } else {

    cartItemsEl.innerHTML = entries.map(([key, qty]) => {

      const { id, flavor } = parseCartKey(key);

      const product = PRODUCTS.find(p => p.id === id);

      if (!product) return "";

      const subtotal = product.price * qty;

      const encodedKey = encodeURIComponent(key);

      return `
        <div class="cart-item">

          <div>

            <strong>${product.name}</strong>

            ${flavor ? `
              <div style="color:#087e8b;font-weight:600;margin-top:4px;">
                Sabor: ${flavor}
              </div>
            ` : ""}

            <div>
              ${money(product.price)} x ${qty} = ${money(subtotal)}
            </div>

          </div>

          <div class="cart-controls"
            style="display:flex;align-items:center;gap:7px;">

            <button type="button"
              data-cart-action="decrease"
              data-cart-key="${encodedKey}"
              aria-label="Quitar una unidad"
              title="Quitar una unidad">
              −
            </button>

            <span>${qty}</span>

            <button type="button"
              data-cart-action="increase"
              data-cart-key="${encodedKey}"
              aria-label="Agregar una unidad"
              title="Agregar una unidad">
              +
            </button>

            <button type="button"
              data-cart-action="remove"
              data-cart-key="${encodedKey}"
              aria-label="Eliminar producto completo"
              title="Eliminar producto completo"
              style="border:0;background:#ffe3eb;color:#c43d68;border-radius:8px;padding:7px 9px;cursor:pointer;font-size:16px;">
              🗑️
            </button>

          </div>

        </div>
      `;

    }).join("");

  }

  const count = Object.values(cart).reduce(
    (sum, qty) => sum + qty, 0
  );

  if (cartTotalEl) {
    cartTotalEl.textContent = money(getCartTotal());
  }

  if (cartCountEl) {
    cartCountEl.textContent = `(${count})`;
  }

  if (minAmountNoticeEl) {
    minAmountNoticeEl.style.display = "none";
  }

  if (whatsappBtn) {
    whatsappBtn.disabled = false;
    whatsappBtn.style.opacity = "1";
    whatsappBtn.style.cursor = "pointer";
  }

  document.querySelectorAll(
    ".cart-btn-header, #openCart, #openCartBtn"
  ).forEach(button => {
    button.onclick = openCartModal;
  });

  renderPaymentPanel();
}

// VACIAR CARRITO AUTOMÁTICAMENTE
function clearCartAfterOrder() {
  cart = {};

  localStorage.removeItem("jys-cart");

  renderCart();

  if (deliveryAddressEl) {
    deliveryAddressEl.value = "";
  }

  if (orderNotesEl) {
    orderNotesEl.value = "";
  }

  renderPaymentPanel();
  closeCartModal();
}

if (closeCartBtn) {
  closeCartBtn.onclick = closeCartModal;
}

// PEDIDO POR WHATSAPP
if (whatsappBtn) {

  whatsappBtn.onclick = () => {

    const entries = Object.entries(cart).filter(([key, qty]) => {

      const { id } = parseCartKey(key);

      return PRODUCTS.some(p => p.id === id) && qty > 0;

    });

    if (!entries.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    const total = getCartTotal();

    const address = deliveryAddressEl
      ? deliveryAddressEl.value.trim()
      : "";

    const payment = paymentMethodEl
      ? paymentMethodEl.value
      : "No especificada";

    const notes = orderNotesEl
      ? orderNotesEl.value.trim()
      : "";

    if (!address) {
      alert("Por favor, ingresá tu dirección de entrega antes de enviar.");
      return;
    }

    let message =
      "¡Hola! Quisiera realizar el siguiente pedido:\n\n";

    entries.forEach(([key, qty]) => {

      const { id, flavor } = parseCartKey(key);

      const product = PRODUCTS.find(p => p.id === id);

      if (product) {

        message += `• ${product.name}`;

        if (flavor) {
          message += ` - Sabor: ${flavor}`;
        }

        message += ` x${qty} - ${money(product.price * qty)}\n`;

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

      message +=
        "\n\nQuisiera recibir un enlace de pago por billetera virtual.";

    }

    if (notes) {
      message += `\n*Notas:* ${notes}`;
    }

    const url =
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    const whatsappWindow = window.open(url, "_blank");

    if (whatsappWindow) {

      clearCartAfterOrder();

    } else {

      alert(
        "No se pudo abrir WhatsApp. Permití las ventanas emergentes e intentá nuevamente. Tu carrito sigue guardado."
      );

    }

  };

}

// INICIALIZACIÓN
createPaymentPanel();

if (typeof PRODUCTS === "undefined" || !Array.isArray(PRODUCTS)) {

  if (productsEl) {

    productsEl.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;padding:20px;color:#b00020">
        No se pudieron cargar los productos. Recargá la página o intentá más tarde.
      </p>
    `;

  }

} else {

  normalizeCart();

  Object.keys(cart).forEach(key => {

    const { id } = parseCartKey(key);

    if (!PRODUCTS.some(p => p.id === id)) {
      delete cart[key];
    }

  });

  saveCart();
  renderFilters();
  renderProducts();
  renderCart();

}
