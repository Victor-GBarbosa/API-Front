import { request, showNotification } from "../utils/apiUtils.mjs";

if (localStorage.getItem("userDetails") != null) {
  var userDetails = JSON.parse(localStorage.getItem("userDetails"));
} else {
  console.log("falha ao carregar user details");
}

startPage();

// DOM consts
const userLogOutButton = document.getElementById("user-button");
userLogOutButton.addEventListener("click", logOut);

const welcomeMessage = document.getElementById("welcome-message");
welcomeMessage.innerText = `Bem vindo, ${userDetails.name}`;

function logOut() {
  localStorage.removeItem("email");
  localStorage.removeItem("password");
  localStorage.removeItem("token");
  localStorage.removeItem("userDetails");

  window.location.reload(true);
}

async function renderProducts() {
  const productsGrid = document.getElementById("products-grid");

  const products = await request("GET", "product");
  if (products[1].status == 200) {
    const productsHTML = products[0]
      .map(
        (product) => `
    <div class="product-card">
      <div class="product-image"><img src="${product.imageUrl}"></div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">R$${product.price}</p>
      <button class="product-button" onclick="addToCart(${parseFloat(
        product.id
      )})">
        Adicionar ao Carrinho
      </button>
    </div>
  `
      )
      .join("");
    productsGrid.innerHTML = productsHTML;
  } else {
    showNotification(
      "ERROR",
      products[1].status + ": Não foi possivel carregar os produtos"
    );
  }
}

async function renderUserActions() {
  const actionsHeader = document.getElementById("user-actions");
  const userInfo = JSON.parse(localStorage.getItem("userDetails"));
  if (userInfo.authorities.length > 1) {
    const newButton = document.createElement("button");
    newButton.classList.add("user-button");
    newButton.setAttribute(
      "onclick",
      "() => window.location.href = './product-register'"
    );
    newButton.onclick = () =>
      (window.location.href = "./product-register.html");

    const spam = document.createElement("span");
    spam.innerText = "Registrar produto";

    newButton.appendChild(spam);
    actionsHeader.appendChild(newButton);
    if (userInfo.authorities.length > 2) {
      if (userInfo.authorities.length > 3) {
        const newButton = document.createElement("button");
        newButton.classList.add("user-button");
        newButton.setAttribute("onclick", "");

        const spam = document.createElement("span");
        spam.innerText = "usuarios";

        newButton.appendChild(spam);
        actionsHeader.appendChild(newButton);
      }
    }
  }
}

async function startPage() {
  if (localStorage.getItem("userDetails") == null) {
    window.location.href = "../index.html";
  }
  renderProducts();
  renderUserActions();
}
