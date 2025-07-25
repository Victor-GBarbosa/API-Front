import { request, getUserInfo } from "../utils/apiUtils.mjs";

startPage();

// DOM consts
const userLogOutButton = document.getElementById("user-button");
userLogOutButton.addEventListener("click", logOut);

const welcomeMessage = document.getElementById("welcome-message");
welcomeMessage.innerText = `Bem vindo, ${localStorage.getItem("name")}`;

if (localStorage.getItem("token") == null) {
  window.location.href = "../index.html";
}

function logOut() {
  localStorage.removeItem("cpf");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("password");
  localStorage.removeItem("phone");
  localStorage.removeItem("token");

  window.location.reload(true);
}

async function renderProducts() {
  const productsGrid = document.getElementById("products-grid");

  const products = await request("GET", "product");

  const productsHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <div class="product-image"><img src="${product.imageUrl}"></div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">${product.price}</p>
      <button class="product-button" onclick="addToCart(${product.id})">
        Adicionar ao Carrinho
      </button>
    </div>
  `
    )
    .join("");

  productsGrid.innerHTML = productsHTML;
}

async function renderUserActions () {
  const actionsHeader = document.getElementById("user-actions")
  const userInfo = await getUserInfo();
  if (userInfo.authorities.length > 1) {
    
    const newButton = document.createElement("button")
    newButton.classList.add("user-button");
    newButton.setAttribute("onclick", "() => window.location.href = './product-register'")
    newButton.onclick = () => window.location.href = './product-register.html'

    const spam = document.createElement("span");
    spam.innerText = "Registrar produto";

    newButton.appendChild(spam)
    actionsHeader.appendChild(newButton);
    if (userInfo.authorities.length > 2) {

      if (userInfo.authorities.length >3) {
        const newButton = document.createElement("button")
    newButton.classList.add("user-button");
    newButton.setAttribute("onclick", "")
    
    const spam = document.createElement("span");
    spam.innerText = "usuarios";

    newButton.appendChild(spam)
    actionsHeader.appendChild(newButton);
      }
    }
  }
}

async function startPage() {
  renderProducts();
  renderUserActions();
  const userInfo = await getUserInfo();
  console.log(userInfo.authorities)

}
