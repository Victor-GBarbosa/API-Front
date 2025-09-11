import {
  showNotification,
  request,
  requestWithToken,
} from "../utils/apiUtils.mjs";

let cartItems = [];
let itensRequest;
//User cart request
try {
  itensRequest = await requestWithToken(
    "GET",
    `users/${localStorage.getItem("email")}/cart`,
    localStorage.getItem("token")
  );
} catch (TypeError) {
  showNotification("ERROR", "Não foi possivel carregar o carrinho");
}

console.log(itensRequest);

if (itensRequest[1].status == 200) {
  cartItems = itensRequest[0].orderProductList;
  console.log(cartItems);
} else if (itensRequest[1].status == 404) {
  showNotification(
    "ERROR",
    itensRequest[1].status + " Carrinho não encontrado"
  );
} else {
  showNotification(
    "ERROR",
    itensRequest[1].status + " Não foi possivel iniciar o carrinho"
  );
}

renderCartItens();
// =====================
// Renderização do Carrinho
// =====================

function renderCartItens() {
  if (cartItems.length > 0) {
    document.getElementById("empty-cart").remove();
    cartItems.forEach((item) => {
      console.log(item);
      console.log();
      document
        .getElementById("cart-items-list")
        .append(createCartItemElement(item.product, item));
    });
  }
}

function createCartItemElement(item, orderItem) {
  const cartItem = document.createElement(`div-${item.id}`);
  cartItem.className = "cart-item";
  cartItem.setAttribute("data-item-id", item.id);
  cartItem.style.animationDelay = `${Math.random() * 0.3}s`;

  cartItem.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.name}" class="item-image""/>
    <div class="item-details">
      <div class="item-name">${item.name}</div>
      <div class="item-description">${item.description}</div>
      <div class="item-category">📦 ${item.category.name}</div>
      <div class="item-price">R$ ${item.price
        .toFixed(2)
        .replace(".", ",")}</div>
    </div>
    <div class="item-controls">
      <div class="quantity-controls">
        <button class="quantity-btn decrease-btn" data-action="decrease" data-id="${
          item.id
        }">
          -
        </button>
        <input 
          type="number" 
          class="quantity-input" 
          value="${orderItem.quantity}" 
          min="1" 
          max="99"
          data-id="${item.id}"
        />
        <button class="quantity-btn increase-btn" data-action="increase" data-id="${
          item.id
        }">
          +
        </button>
      </div>
      <button class="remove-btn" data-action="remove" data-id="${item.id}">
        🗑️ Remover
      </button>
    </div>
  `;

  return cartItem;
}

// =====================
// Event Listeners
// =====================
function attachCartItemEventListeners() {
  // Botões de quantidade
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", handleQuantityChange);
  });

  // Inputs de quantidade
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", handleQuantityInputChange);
    input.addEventListener("blur", handleQuantityInputChange);
  });

  // Botões de remoção
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", handleItemRemove);
  });
}

function handleQuantityChange(event) {
  const action = event.target.getAttribute("data-action");
  const itemId = parseInt(event.target.getAttribute("data-id"));

  if (action === "increase") {
    changeItemQuantity(itemId, 1);
  } else if (action === "decrease") {
    changeItemQuantity(itemId, -1);
  }
}

function handleQuantityInputChange(event) {
  const itemId = parseInt(event.target.getAttribute("data-id"));
  const newQuantity = parseInt(event.target.value);

  if (newQuantity > 0 && newQuantity <= 99) {
    setItemQuantity(itemId, newQuantity);
  } else {
    // Restaurar valor anterior se inválido
    const item = cartItems.find((i) => i.id === itemId);
    if (item) {
      event.target.value = item.quantity;
    }
  }
}

function handleItemRemove(event) {
  const itemId = parseInt(event.target.getAttribute("data-id"));
  const item = cartItems.find((i) => i.id === itemId);

  if (item && confirm(`Deseja remover "${item.name}" do carrinho?`)) {
    removeItemFromCart(itemId);
  }
}

// =====================
// Lógica de Manipulação do Carrinho
// =====================
function changeItemQuantity(itemId, delta) {
  const item = cartItems.find((i) => i.id === itemId);
  if (!item) return;

  const newQuantity = item.quantity + delta;
  if (newQuantity > 0 && newQuantity <= 99) {
    item.quantity = newQuantity;
    saveCartToStorage();
    updateCartDisplay();
    showNotification("SUCCESS", "Quantidade atualizada");
  }
}

function setItemQuantity(itemId, quantity) {
  const item = cartItems.find((i) => i.id === itemId);
  if (!item) return;

  if (quantity > 0 && quantity <= 99) {
    item.quantity = quantity;
    saveCartToStorage();
    updateCartDisplay();
  }
}

function removeItemFromCart(itemId) {
  const itemIndex = cartItems.findIndex((i) => i.id === itemId);
  if (itemIndex > -1) {
    const removedItem = cartItems.splice(itemIndex, 1)[0];

    // Animação de remoção
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    if (itemElement) {
      itemElement.style.transition = "all 0.3s ease";
      itemElement.style.transform = "translateX(-100%)";
      itemElement.style.opacity = "0";

      setTimeout(() => {
        saveCartToStorage();
        updateCartDisplay();
        showNotification(
          "SUCCESS",
          `"${removedItem.name}" foi removido do carrinho`
        );
      }, 300);
    } else {
      saveCartToStorage();
      updateCartDisplay();
      showNotification(
        "SUCCESS",
        `"${removedItem.name}" foi removido do carrinho`
      );
    }
  }
}

function clearCart() {
  if (cartItems.length === 0) {
    showNotification("WARNING", "O carrinho já está vazio");
    return;
  }

  if (confirm("Tem certeza que deseja limpar todo o carrinho?")) {
    cartItems = [];
    saveCartToStorage();
    updateCartDisplay();
    showNotification("SUCCESS", "Carrinho limpo com sucesso");
  }
}

// =====================
// Função Principal de Inicialização
// =====================
function initCart() {
  console.log("Inicializando carrinho de compras...");

  // Verificar se usuário está logado
  if (!localStorage.getItem("userDetails")) {
    showNotification("ERROR", "Acesso negado. Faça login para continuar.");
    window.location.href = "../index.html";
    return;
  }

  initializeCart();
  initializeEventListeners();
  updateCartDisplay();

  // Mostrar mensagem de boas-vindas
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  if (userDetails && userDetails.name) {
    setTimeout(() => {
      showNotification(
        "INFO",
        `Olá ${userDetails.name}! Seu carrinho foi carregado.`
      );
    }, 1000);
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", initCart);
