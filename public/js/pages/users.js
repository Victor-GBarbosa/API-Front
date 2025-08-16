import {
  request,
  requestWithToken,
  showNotification,
} from "../utils/apiUtils.mjs";
import { createAccounts } from "../../../testing/tests.mjs";

if (localStorage.getItem("userDetails") != null) {
  var userDetails = JSON.parse(localStorage.getItem("userDetails"));
  if (!userDetails.authorities || userDetails.authorities.length <= 3) {
    showNotification(
      "ERROR",
      "Acesso negado. Você não tem permissões administrativas."
    );
    window.location.href = "./mainPage.html";
  }
} else {
  console.log("falha ao carregar user details");
  window.location.href = "../index.html";
}

startPage();
loadUsers();

function deleteUser(userEmail, elementId) {
  const deleteRequest = requestWithToken(
    "DELETE",
    `users/${userEmail}`,
    localStorage.getItem("token")
  );
  console.log(deleteRequest[1]);
  const element = document.getElementById(elementId);
  element.remove();
}

async function loadUsers() {
  console.log(userDetails);
  let usersRequest = await requestWithToken(
    "GET",
    "users",
    localStorage.getItem("token")
  );
  if (usersRequest[1].status == 200) {
    const users = usersRequest[0];
    usersRequest[0].map((element) => {
      const userCardHtml = `<div class="users-grid admin-users" id="${element.email}-user-card">
          <div class="user-card">
            <div class="user-avatar-section">
              <div class="user-avatar large admin-avatar">👤</div>
              <div class="user-status online"></div>
            </div>
            <div class="user-info">
              <h3 class="user-name">${element.name}</h3>
              <p class="user-email">${element.email}</p>
              <p class="user-joined">Membro desde: Jan 2024</p>
            </div>
            <div class="user-permissions">
              <label for="permission-1">Nível de Permissão:</label>
              <select class="permission-dropdown" id="permission-1">
              <option value="" selected>Selecione um valor</option>
                <option value="admin" >🔴 Administrador</option>
                <option value="moderator">🔵 Moderador</option>
                <option value="seller">🟡 Vendedor</option>
                <option value="customer">🟢 Cliente</option>
              </select>
            </div>
            <div class="user-actions">
              <button class="btn-save" id="${element.email}-updateButton">💾 Salvar</button>
              <button class="btn-delete" id="${element.email}-deleteButton">🗑️ Deletar</button>
            </div>
          </div>`;
      switch (element.authorities.length) {
        case 4: // Admin
          const adminSection = document.getElementById("admin-users");
          adminSection.innerHTML += userCardHtml;

          break;
        case 3: // Moderator
          const modSection = document.getElementById("moderator-users");
          modSection.innerHTML += userCardHtml;
          break;
        case 2: // Seller
          const sellerSection = document.getElementById("seller-users");
          sellerSection.innerHTML += userCardHtml;
          break;
        case 1: // Customer
        default:
          const customerSection = document.getElementById("customer-users");
          customerSection.innerHTML += userCardHtml;
          break;
      }
    });
    usersRequest[0].forEach((element) => {
      const elementUpdateButton = document.getElementById(
        `${element.email}-updateButton`
      );
      elementUpdateButton.addEventListener("click", (e) => {
        console.log(document.getElementById(`${element.email}-user-card`));
      });

      const elementDeleteButton = document.getElementById(
        `${element.email}-deleteButton`
      );
      elementDeleteButton.addEventListener("click", () =>
        deleteUser(element.email, `${element.email}-user-card`)
      );
    });

    // Atualizar contadores após carregar usuários
    updateUserCounts();
  }
}

function updateUserCounts() {
  const adminCount = document.getElementById("admin-users").children.length;
  const moderatorCount =
    document.getElementById("moderator-users").children.length;
  const sellerCount = document.getElementById("seller-users").children.length;
  const customerCount =
    document.getElementById("customer-users").children.length;
  const totalCount = adminCount + moderatorCount + sellerCount + customerCount;

  // Atualizar estatísticas no topo
  document.querySelector(
    ".users-stats .stat-item:nth-child(1) strong"
  ).textContent = `${totalCount} usuários`;
  document.querySelector(
    ".users-stats .stat-item:nth-child(2) strong"
  ).textContent = adminCount;
  document.querySelector(
    ".users-stats .stat-item:nth-child(3) strong"
  ).textContent = moderatorCount;
  document.querySelector(
    ".users-stats .stat-item:nth-child(4) strong"
  ).textContent = sellerCount;
  document.querySelector(
    ".users-stats .stat-item:nth-child(5) strong"
  ).textContent = customerCount;

  // Atualizar contadores das categorias
  document.querySelector(
    ".admin-category .category-count"
  ).textContent = `${adminCount} usuários`;
  document.querySelector(
    ".moderator-category .category-count"
  ).textContent = `${moderatorCount} usuários`;
  document.querySelector(
    ".seller-category .category-count"
  ).textContent = `${sellerCount} usuários`;
  document.querySelector(
    ".customer-category .category-count"
  ).textContent = `${customerCount} usuários`;
}
//
// ========
// DropDown
// ========
//
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

// DOM elements
const userLogOutButton = document.getElementById("user-button");
userLogOutButton.addEventListener("click", logOut);

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
    dropdownToggle.classList.remove("active");
    dropdownMenu.classList.remove("show");
    showNotification(
      "INFO",
      "Você já está na página de gerenciamento de usuários"
    );
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

  window.location.href = "../index.html";
}

function renderUserActions() {
  const userInfo = JSON.parse(localStorage.getItem("userDetails"));

  const adminSections = document.querySelectorAll(".admin-section");
  const adminItems = document.querySelectorAll(".admin-item");

  if (userInfo.authorities && userInfo.authorities.length > 3) {
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
    if (sellerDropdownSection) {
      sellerDropdownSection.style.display = "none";
    }
  }
  const userDisplayName = document.querySelector(".user-display-name");
  if (userDisplayName) {
    userDisplayName.textContent = `Bem-vindo, ${userInfo.name}`;
  }

  const userName = document.getElementById("user-name");
  if (userName) {
    userName.textContent = userInfo.name;
  }
}

async function startPage() {
  if (localStorage.getItem("userDetails") == null) {
    window.location.href = "../index.html";
  }
  renderUserActions();
}
