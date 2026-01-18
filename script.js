// Produtos
const products = [
    
    {
        id: 3,
        name: "Alvejante com Cloro Lírios",
        description: "Alvejante potente para roupas brancas",
        category: "Alvejante",
        prices: { "1L": 9.90, "5L": 17.90 },
        image: "images/alvejante-cloro.png"
    },
    {
        id: 4,
        name: "Alvejante Sem Cloro Lírios",
        description: "Alvejante suave para roupas coloridas",
        category: "Alvejante",
        prices: { "1L": 12.00, "5L": 21.90 },
        image: "images/alvejante-sem-cloro.png"
    },
    {
        id: 1,
        name: "Amaciante Lírios Carícia",
        description: "Amaciante com fragrância suave e duradoura",
        category: "Amaciante",
        prices: { "1L": 11.90, "5L": 19.99 },
        image: "images/amaciante-caricia.png"
    },
    {
        id: 2,
        name: "Amaciante Lírios Mundo Azul",
        description: "Amaciante refrescante com perfume marcante",
        category: "Amaciante",
        prices: { "1L": 11.90, "5L": 19.99 },
        image: "images/amaciante-mundo-azul.png"
    },
    {
        id: 5,
        name: "Detergente Lava Louça Lírios",
        description: "Detergente neutro de alta performance",
        category: "Detergente",
        prices: { "1L": 11.50, "5L": 18.90 },
        image: "images/detergente-lava-louca.png"
    },
    {
        id: 6,
        name: "Lava Roupas Lírios",
        description: "Lava roupas concentrado e eficiente",
        category: "Lava Roupas",
        prices: { "1L": 11.50, "5L": 21.99 },
        image: "images/lava-roupas.png"
    },
    {
        id: 7,
        name: "Limpador Perfumado Floral",
        description: "Limpador multiuso com fragrância floral",
        category: "Limpador",
        prices: { "1L": 10.90, "5L": 17.99 },
        image: "images/limpador-floral.png"
    },
    {
        id: 8,
        name: "Limpador Perfumado Kaiak",
        description: "Limpador multiuso várias fragrâncias",
        category: "Limpador",
        prices: { "1L": 10.90, "5L": 17.99 },
        image: "images/limpador-kaiak.png"
    },
    {
        id: 9,
        name: "Odorizador de Ambiente",
        description: "Odorizador de ambiente com fragrância duradoura",
        category: "Odorizador",
        prices: { "1L": 15.90, "350ML": 5.90 },
        image: "images/perfumador-ambiente.png"
    },
    {
        id: 10,
        name: "Pretinho",
        description: "De brilho nos pneus do seu carro ou moto",
        category: "Pretinho",
        prices: { "1L": 40.00, "5L": 170.00, "500ML": 30.00 },
        image: "images/preteador.png"
    },
    {
        id: 11,
        name: "Sabonete Líquido",
        description: "Sabonete líquido para uso doméstico",
        category: "Sabonete",
        prices: {"5L": 39.99,},
        image: "images/sabonete-liquido.png"
    }
];

// Estado do carrinho
let cart = [];
let selectedPayment = null;
let selectedSizes = {};

// Inicializar tamanhos selecionados (padrão 5L)
products.forEach(product => {
    selectedSizes[product.id] = "5L";
});

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(product => {
        // Criar botões de tamanho dinamicamente apenas para os tamanhos existentes
        const sizeButtons = Object.keys(product.prices).map(size => {
            // Verifica se é o tamanho selecionado
            const isSelected = selectedSizes[product.id] === size;
            return `
                <button 
                    onclick="selectSize(${product.id}, '${size}')" 
                    id="size-${product.id}-${size}" 
                    class="border-2 ${isSelected ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'} py-3 rounded-lg text-sm hover:border-cyan-500 transition-all"
                >
                    <div class="font-medium text-gray-700">${size === '1L' ? '1 Litro' : size === '5L' ? '5 Litros' : size}</div>
                    <div class="text-cyan-600 font-bold">R$ ${product.prices[size].toFixed(2).replace('.', ',')}</div>
                </button>
            `;
        }).join('');

        return `
        <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 text-center relative">
                <span class="absolute top-4 left-4 inline-block bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium">${product.category}</span>
                <img src="${product.image}" alt="${product.name}" class="w-full h-70 object-contain mb-4">
            </div>
            <div class="p-6">
                <h3 class="font-bold text-lg mb-2 text-gray-900">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                
                <div class="mb-4">
                    <div class="grid grid-cols-2 gap-2 mb-3">
                        ${sizeButtons}
                    </div>
                </div>
                
                <button 
                    onclick="addToCart(${product.id})" 
                    class="w-full gradient-btn text-white py-3 rounded-full font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
        `;
    }).join('');
}

// Selecionar tamanho
function selectSize(productId, size) {
    selectedSizes[productId] = size;
    
    // Atualizar visual dos botões
    document.getElementById(`size-${productId}-1L`).className = "border-2 border-gray-300 py-3 rounded-lg text-sm hover:border-cyan-500 transition-all";
    document.getElementById(`size-${productId}-5L`).className = "border-2 border-gray-300 py-3 rounded-lg text-sm hover:border-cyan-500 transition-all";
    document.getElementById(`size-${productId}-${size}`).className = "border-2 border-cyan-500 bg-cyan-50 py-3 rounded-lg text-sm";
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const size = selectedSizes[productId];
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            size: size,
            price: product.prices[size],
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
}

// Atualizar carrinho
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4 opacity-50">🛒</div>
                <p class="text-gray-500">Seu carrinho está vazio</p>
                <button onclick="toggleCart()" class="mt-4 text-cyan-600 font-medium hover:underline">
                    Continuar comprando
                </button>
            </div>
        `;
        cartCount.classList.add('hidden');
        document.getElementById('finish-btn').disabled = true;
    } else {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
        cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="flex gap-4 bg-gray-50 p-4 rounded-xl">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain bg-white rounded-lg">
                <div class="flex-1">
                    <h4 class="font-medium text-sm text-gray-900 mb-1">${item.name}</h4>
                    <p class="text-xs text-gray-500 mb-2">${item.size}</p>
                    <p class="text-cyan-600 font-bold mb-2">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                    <div class="flex items-center gap-2">
                        <button 
                            onclick="updateQuantity(${index}, -1)" 
                            class="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all">
                            −
                        </button>
                        <span class="text-sm font-medium w-8 text-center">${item.quantity}</span>
                        <button 
                            onclick="updateQuantity(${index}, 1)" 
                            class="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all">
                            +
                        </button>
                        <button 
                            onclick="removeFromCart(${index})" 
                            class="ml-auto text-red-500 hover:bg-red-50 p-2 rounded transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        if (selectedPayment) {
            document.getElementById('finish-btn').disabled = false;
        }
        
        // Atualizar valor PIX se PIX estiver selecionado
        const pixTotal = document.getElementById('pix-total');
        if (pixTotal) {
            pixTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        }
    }
}

// Atualizar quantidade
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
    calculateChange();
}

// Remover do carrinho
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    calculateChange();
}

// Toggle carrinho
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('translate-x-full');
}

// Selecionar pagamento
function selectPayment(method) {
    selectedPayment = method;
    
    // Resetar botões
    document.getElementById('btn-dinheiro').className = "border-2 border-gray-300 p-4 rounded-xl hover:border-cyan-500 transition-all text-center";
    document.getElementById('btn-pix').className = "border-2 border-gray-300 p-4 rounded-xl hover:border-cyan-500 transition-all text-center";
    
    // Destacar selecionado
    document.getElementById(`btn-${method}`).className = "border-2 border-cyan-500 bg-cyan-50 p-4 rounded-xl text-center";
    
    // Mostrar/ocultar seções
    document.getElementById('troco-section').classList.toggle('hidden', method !== 'dinheiro');
    document.getElementById('pix-section').classList.toggle('hidden', method !== 'pix');
    
    // Habilitar botão finalizar
    document.getElementById('finish-btn').disabled = cart.length === 0;
}

// Calcular troco
function calculateChange() {
    const trocoInput = document.getElementById('troco-input').value.replace(',', '.');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const trocoValue = parseFloat(trocoInput);
    const trocoResult = document.getElementById('troco-result');
    
    if (trocoValue && trocoValue > total) {
        const change = trocoValue - total;
        trocoResult.innerHTML = `Troco: <span class="font-bold text-gray-900">R$ ${change.toFixed(2).replace('.', ',')}</span>`;
        trocoResult.className = "text-sm mt-2 text-gray-600";
    } else if (trocoValue && trocoValue < total) {
        trocoResult.innerHTML = '<span class="text-red-500">Valor insuficiente para o pagamento</span>';
        trocoResult.className = "text-sm mt-2";
    } else {
        trocoResult.textContent = '';
    }
}

// Copiar PIX
function copyPix() {
    navigator.clipboard.writeText('54981232459');
    const copyBtn = document.getElementById('copy-btn');
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '✓ Copiado!';
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
    }, 2000);
}

// Finalizar pedido
function finishOrder() {
    if (cart.length === 0 || !selectedPayment) return;
    
    let message = '🛒 *PEDIDO MARISASTORE*\n\n';
    
    cart.forEach(item => {
        message += `• ${item.quantity}x ${item.name} (${item.size}) - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    
    if (selectedPayment === 'dinheiro') {
        message += '💵 *Pagamento:* Dinheiro\n';
        const trocoInput = document.getElementById('troco-input').value;
        if (trocoInput) {
            const trocoValue = parseFloat(trocoInput.replace(',', '.'));
            const change = trocoValue - total;
            if (change > 0) {
                message += `💱 *Troco para:* R$ ${trocoInput}\n`;
                message += `🔄 *Troco:* R$ ${change.toFixed(2).replace('.', ',')}\n`;
            }
        }
    } else if (selectedPayment === 'pix') {
        message += '📱 *Pagamento:* PIX\n';
        message += '🔑 *Chave PIX:* 54981232459\n';
    }
    
    const whatsappUrl = `https://wa.me/5554981232459?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho após envio
    setTimeout(() => {
        cart = [];
        selectedPayment = null;
        updateCart();
        toggleCart();
        
        // Resetar campos
        document.getElementById('troco-input').value = '';
        document.getElementById('troco-result').textContent = '';
        document.getElementById('btn-dinheiro').className = "border-2 border-gray-300 p-4 rounded-xl hover:border-cyan-500 transition-all text-center";
        document.getElementById('btn-pix').className = "border-2 border-gray-300 p-4 rounded-xl hover:border-cyan-500 transition-all text-center";
    }, 500);
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});