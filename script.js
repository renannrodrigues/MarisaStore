const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const cartCounter = document.getElementById("cart-count")
const closeModalBtn = document.getElementById("close-modal-btn")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const paymentSelect = document.getElementById("payment-method");
const trocoContainer = document.getElementById("troco-container");
const trocoInput = document.getElementById("troco-input");
const pixContainer = document.getElementById("pix-container");


let cart= [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }
    else{
        cart.push({
        name,
        price,
        quantity: 1,
        })
    }
    updateCartModal()
}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
           <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
           </div>

        
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
           </div>  
        `
        
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)    

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

cartCounter.innerHTML = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// finalizar pedido
checkoutBtn.addEventListener("click", function () {
    gtag('event', 'finalizar_pedido'); // ✅ GA4 registra o clique
    const isOpen = checkLojaOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops a loja está fechada",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "#ef4444" },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    const paymentMethod = paymentSelect.value;

    if (paymentMethod === "") {
        document.getElementById("payment-warn").classList.remove("hidden");
        return;
    }

    // Texto do pagamento
    let pagamentoTexto = `💳 *Forma de pagamento:* ${paymentMethod}\n`;

    if (paymentMethod === "Pix") {
        pagamentoTexto += `🔑 *Chave Pix:* 54981232459\n`;
    }

    if (paymentMethod === "Dinheiro") {
        const trocoValue = trocoInput.value.trim();
        pagamentoTexto += trocoValue 
            ? `💵 *Troco para:* R$${trocoValue}\n`
            : `💵 *Troco:* Não informado\n`;
    }

    // Itens do carrinho
    const cartItems = cart.map((item) => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        return `• *${item.name}*\n  Quantidade: ${item.quantity}\n  Subtotal: R$${itemTotal}\n`;
    }).join("\n");

    const totalGeral = cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);

    const message = encodeURIComponent(
`🛒 *NOVO PEDIDO - MARISA STORE*

📦 *Itens do pedido:*
${cartItems}

💰 *Total geral:* R$${totalGeral}

${pagamentoTexto}
🏠 *Endereço:* ${addressInput.value}

✅ Pedido enviado via site`
    );

    const phone = "54981232459";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});

// verigicar a hora e manipular o card horario
function checkLojaOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 22;
    //true = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkLojaOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")}
    else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

paymentSelect.addEventListener("change", () => {
    if (paymentSelect.value === "Dinheiro") {
        trocoContainer.classList.remove("hidden");
        pixContainer.classList.add("hidden");
        trocoInput.value = "";
    } 
    else if (paymentSelect.value === "Pix") {
        pixContainer.classList.remove("hidden");
        trocoContainer.classList.add("hidden");
        trocoInput.value = "";
    } 
    else {
        trocoContainer.classList.add("hidden");
        pixContainer.classList.add("hidden");
        trocoInput.value = "";
    }
});
