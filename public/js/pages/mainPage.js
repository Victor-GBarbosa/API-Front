import { config } from "../../../config.mjs";

// Dados mockados para produtos
const mockProducts = [
  {
    id: 1,
    name: "Smartphone Premium",
    price: "R$ 1.299,00",
  },
  {
    id: 2,
    name: "Notebook Gamer",
    price: "R$ 2.499,00",
  },
  {
    id: 3,
    name: "Headset Bluetooth",
    price: "R$ 199,00",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: "R$ 399,00",
  },
  {
    id: 5,
    name: "Câmera Digital",
    price: "R$ 899,00",
  },
  {
    id: 6,
    name: "Console de Jogos",
    price: "R$ 1.899,00",
  },
];

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

async function getApiProducts() {
  const productsRequest = await fetch(config.apiUrl + `product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const products = await productsRequest.json();
  return products;
}

async function renderProducts() {
  const productsGrid = document.getElementById("products-grid");

  const products = await getApiProducts();

  console.log(products);
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

renderProducts();
