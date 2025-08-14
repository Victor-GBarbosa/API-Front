import { request, showNotification } from "../utils/apiUtils.mjs";

if (localStorage.getItem("userDetails") != null) {
  var userDetails = JSON.parse(localStorage.getItem("userDetails"));
} else {
  console.log("falha ao carregar user details");
}

startPage();

// User Dropdown
const dropdownToggle = document.getElementById("user-dropdown-toggle");
const dropdownMenu = document.getElementById("user-dropdown-menu");

if (dropdownToggle && dropdownMenu) {
  dropdownToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownToggle.classList.toggle("active");
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (
      !dropdownToggle.contains(e.target) &&
      !dropdownMenu.contains(e.target)
    ) {
      dropdownToggle.classList.remove("active");
      dropdownMenu.classList.remove("show");
    }
  });
}

// DOM consts
const userLogOutButton = document.getElementById("user-button");
userLogOutButton.addEventListener("click", logOut);

const welcomeMessage = document.getElementById("welcome-message");
welcomeMessage.innerText = `Bem vindo, ${userDetails.name}`;

// Navigation event listeners for dropdown items
const registerProductButton = document.getElementById(
  "register-product-button"
);
const cartButton = document.getElementById("cart-button");
const manageUsersButton = document.getElementById("manage-users-button");
const profileButton = document.getElementById("profile-button");
const ordersButton = document.getElementById("orders-button");
const myProductsButton = document.getElementById("my-products-button");
const settingsButton = document.getElementById("settings-button");
const adminReportsButton = document.getElementById("admin-reports-button");

if (registerProductButton) {
  registerProductButton.addEventListener("click", () => {
    window.location.href = "./product-register.html";
  });
}

if (cartButton) {
  cartButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade do carrinho será implementada em breve"
    );
  });
}

if (manageUsersButton) {
  manageUsersButton.addEventListener("click", () => {
    window.location.href = "./users.html";
  });
}

if (profileButton) {
  profileButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade de perfil será implementada em breve"
    );
  });
}

if (ordersButton) {
  ordersButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade de pedidos será implementada em breve"
    );
  });
}

if (myProductsButton) {
  myProductsButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade de meus produtos será implementada em breve"
    );
  });
}

if (settingsButton) {
  settingsButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade de configurações será implementada em breve"
    );
  });
}

if (adminReportsButton) {
  adminReportsButton.addEventListener("click", () => {
    showNotification(
      "INFO",
      "Funcionalidade de relatórios será implementada em breve"
    );
  });
}

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
  console.log(userDetails.authorities.length);
  const actionsHeader = document.getElementById("user-actions");
  const userInfo = JSON.parse(localStorage.getItem("userDetails"));

  // Verficação de roles
  const adminSections = document.querySelectorAll(".admin-section");
  const adminItems = document.querySelectorAll(".admin-item");

  if (userInfo.authorities.length > 3) {
    adminSections.forEach((section) => (section.style.display = "block"));
    adminItems.forEach((item) => (item.style.display = "flex"));
  } else {
    adminSections.forEach((section) => (section.style.display = "none"));
    adminItems.forEach((item) => (item.style.display = "none"));
  }

  if (userInfo.authorities.length < 2) {
    const sellerDropdownSection = document.getElementById(
      "seller-dropdown-section"
    );
    sellerDropdownSection.style.display = "none";
  }
}

async function startPage() {
  if (localStorage.getItem("userDetails") == null) {
    window.location.href = "../index.html";
  }
  renderProducts();
  renderUserActions();
}
