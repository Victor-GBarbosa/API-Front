import {
  showNotification,
  request,
  requestWithToken,
} from "../utils/apiUtils.mjs";

//== Variaves globais ==

let cartItems = [];
let changed = false;
cartItems = await requestUserCart();
console.log(cartItems);

// == Inicialicação da pagina ==

initCart();

// == Funções ==

// =====================
// Renderização do Carrinho // Completa
// =====================

async function requestUserCart() {
  let itensRequest;
  try {
    itensRequest = await requestWithToken(
      "GET",
      `users/${localStorage.getItem("email")}/cart`,
      localStorage.getItem("token")
    );
  } catch (TypeError) {
    showNotification("ERROR", "Não foi possivel carregar o carrinho");
  }X
  } else if (itensRequest[1].status == 404) {
    showNotification(
      "ERROR",
      itensRequest[1].status + " Carrinho não encontrado"
    );
    return null;
  } else {
    showNotification(
      "ERROR",
      itensRequest[1].status + " Não foi possivel iniciar o carrinho"
    );
    return null;
  }
}

function renderCartItens() {
  if (cartItems.length > 0) {
    document.getElementById("empty-cart").remove();
    document.getElementById("checkout-btn").disabled = false;

    cartItems.forEach((orderItem, i) => {
      document
        .getElementById("cart-items-list")
        .append(createCartItemElement(orderItem.product, i, orderItem));
      changeItemBtnsEventListeners(orderItem.product.id + "-" + i);
      removeItemFromCart(orderItem.product.id + "-" + i);
    });
  }
}

function createCartItemElement(item, itemIndex, orderItem) {
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
        <button class="quantity-btn decrease-btn" id="decreaseBtn-${
          item.id + "-" + itemIndex
        }">
          -
        </button>
        <input 
          type="number" 
          class="quantity-input" 
          value="${orderItem.quantity}" 
          min="1" 
          max="99"
          id="quantityInput-${item.id + "-" + itemIndex}"
        />
        <button class="quantity-btn increase-btn" id="increaseBtn-${
          item.id + "-" + itemIndex
        }"
      >
          +
        </button>
      </div>
      <button class="remove-btn"  id="removeBtn-${item.id + "-" + itemIndex}">
        🗑️ Remover
      </button>
    </div>
  `;

  return cartItem;
}

// =====================
// Resumo do pedido
// =====================

function updateCartSummary() {
  let total = document.getElementById("total");
  let sum = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      sum += item.product.price * item.quantity;
    });
    total.textContent =
      "R$ " +
      (
        sum +
        parseFloat(
          document.getElementById("shipping").textContent.split(" ")[1]
        )
      ).toLocaleString("BRL");
  }
}

// =====================
// Event Listeners
// =====================

// =====================
// Lógica de Manipulação do Carrinho
// =====================
function changeItemBtnsEventListeners(id) {
  const increaseBtn = document.getElementById("increaseBtn-" + id);
  const deacreaseBtn = document.getElementById("decreaseBtn-" + id);
  const quantityCounter = document.getElementById("quantityInput-" + id);

  increaseBtn.onclick = (e) => {
    quantityCounter.value = parseInt(quantityCounter.value) + 1;
    cartItems[parseInt(id.split("-")[1])].quantity = quantityCounter.value;
    updateCartSummary();
  };

  deacreaseBtn.onclick = (e) => {
    if (quantityCounter.value > 0)
      quantityCounter.value = parseInt(quantityCounter.value) - 1;
    cartItems[parseInt(id.split("-")[1])].quantity = quantityCounter.value;
    updateCartSummary();
  };

  quantityCounter.onchange = (e) => {
    cartItems[parseInt(id.split("-")[1])].quantity = quantityCounter.value;
    updateCartSummary();
  };
}

function removeItemFromCart(id) {
  const removeBtn = document.getElementById("removeBtn-" + id);

  removeBtn.onclick = () => {
    cartItems = cartItems.filter(
      (orderProduct) => orderProduct.product.id != id.split("-")[0]
    );
    console.log(cartItems);

    updateCartSummary();
  };
}

// =====================
// Função Principal de Inicialização
// =====================
function initCart() {
  renderCartItens();
  updateCartSummary();
}
// Inicializar quando DOM estiver pronto
document.addEventListener("DOMContentLoaded", initCart);
