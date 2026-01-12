// ===============================
// ELEMENTOS
// ===============================
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCounter = document.getElementById("cart-count");
const closeModalBtn = document.getElementById("close-modal-btn");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const paymentSelect = document.getElementById("payment-method");
const trocoContainer = document.getElementById("troco-container");
const trocoInput = document.getElementById("troco-input");

let cart = [];

// ===============================
// ABRIR / FECHAR CARRINHO
// ===============================
cartBtn.addEventListener("click", () => {
  updateCartModal();
  cartModal.style.display = "flex";

  // GA4 - view_cart
  gtag("event", "view_cart", {
    currency: "BRL",
    value: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items: cart.map(item => ({
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
});

cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.style.display = "none";
});

closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// ===============================
// ADICIONAR AO CARRINHO
// ===============================
menu.addEventListener("click", (event) => {
  const button = event.target.closest(".add-to-cart-btn");

  if (!button) return;

  const name = button.dataset.name;
  const price = Number(button.dataset.price);

  addToCart(name, price);

  // GA4 - add_to_cart
  gtag("event", "add_to_cart", {
    currency: "BRL",
    value: price,
    items: [{
      item_name: name,
      price: price,
      quantity: 1
    }]
  });
});

function addToCart(name, price) {
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

// ===============================
// ATUALIZAR CARRINHO
// ===============================
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("flex", "justify-between", "mb-4");

    div.innerHTML = `
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-bold">R$ ${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
      </button>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
}

// ===============================
// REMOVER DO CARRINHO
// ===============================
cartItemsContainer.addEventListener("click", (e) => {
  if (!e.target.classList.contains("remove-from-cart-btn")) return;

  const name = e.target.dataset.name;
  removeItemCart(name);
});

function removeItemCart(name) {
  const index = cart.findIndex(i => i.name === name);
  if (index === -1) return;

  const item = cart[index];

  // GA4 - remove_from_cart
  gtag("event", "remove_from_cart", {
    currency: "BRL",
    value: item.price,
    items: [{
      item_name: item.name,
      price: item.price,
      quantity: 1
    }]
  });

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart.splice(index, 1);
  }

  updateCartModal();
}

// ===============================
// FINALIZAR PEDIDO
// ===============================
checkoutBtn.addEventListener("click", () => {
  if (!checkLojaOpen()) {
    Toastify({
      text: "Ops! A loja está fechada",
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "#ef4444" }
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (!addressInput.value.trim()) {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  const paymentMethod = paymentSelect.value;
  if (!paymentMethod) {
    document.getElementById("payment-warn").classList.remove("hidden");
    return;
  }

  const totalValue = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // GA4 - purchase
  gtag("event", "purchase", {
    transaction_id: Date.now().toString(),
    currency: "BRL",
    value: totalValue,
    payment_type: paymentMethod,
    items: cart.map(item => ({
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });

  let pagamento = `💳 Forma de pagamento: ${paymentMethod}\n`;
  if (paymentMethod === "Dinheiro") {
    pagamento += `💵 Troco para: R$${trocoInput.value || "não informado"}\n`;
  }

  const itens = cart.map(item =>
    `• ${item.name} | Qtd: ${item.quantity} | R$ ${(item.price * item.quantity).toFixed(2)}`
  ).join("\n");

  const msg = encodeURIComponent(
`🛒 NOVO PEDIDO - MARISA STORE

${itens}

💰 Total: R$${totalValue.toFixed(2)}
${pagamento}
📍 Endereço: ${addressInput.value}`
  );

  window.open(`https://wa.me/54981232459?text=${msg}`, "_blank");

  cart = [];
  updateCartModal();
  cartModal.style.display = "none";
});

// ===============================
// HORÁRIO DE FUNCIONAMENTO
// ===============================
function checkLojaOpen() {
  const h = new Date().getHours();
  return h >= 8 && h < 22;
}

const spanItem = document.getElementById("date-span");
spanItem.classList.toggle("bg-green-600", checkLojaOpen());
spanItem.classList.toggle("bg-red-500", !checkLojaOpen());

// ===============================
// TROCO
// ===============================
paymentSelect.addEventListener("change", () => {
  trocoContainer.classList.toggle("hidden", paymentSelect.value !== "Dinheiro");
});
