import {
  request,
  requestWithToken,
  showNotification,
} from "../utils/apiUtils.mjs";

const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productImageUrlInput = document.getElementById("product-image");
const productDescInput = document.getElementById("product-description");
const categoryIdSelect = document.getElementById("category-id");

const userDetails = JSON.parse(localStorage.getItem("userDetails"));

const form = document.getElementById("product-form");
const registerProductButton = document.getElementById("productRegister-button");

//Logica de envio do registro de produtos
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("coisado");
  let isSubmited = false;

  if (form.checkValidity() && isSubmited == false) {
    let product = {
      user: {},
      category: {},
    };
    product.name = productNameInput.value;
    product.price = productPriceInput.value;
    product.description = productDescInput.value;
    product.imageUrl = productImageUrlInput.value;
    product.user.id = userDetails.id;
    product.category.id = parseInt(categoryIdSelect.value);
    let productRequest;

    productRequest = await requestWithToken(
      "POST",
      "product",
      localStorage.getItem("token"),
      product
    );

    if (productRequest[1].status == 200 || productRequest[1].status == 201) {
      isSubmited = true;
      // window.location.reload(true);
      // form.removeEventListener("submit");
      showNotification("SUCCESS", "Produto adicionado com sucesso");
    } else if (
      productRequest[1].status == 500 ||
      productRequest[1].status == 403
    ) {
      if (productRequest[1].status == 500) {
        showNotification(
          "ERROR",
          "Erro ao tentar registrar o produto, tente novamente mais tarde"
        );
        isSubmited = false;
      }
      if (productRequest[1].status == 403) {
        showNotification(
          "ERROR",
          "Voce não tem permição para registrar um produto"
        );
        isSubmited = false;
      }
    } else {
      isSubmited = false;
      showNotification(
        "WARNING",
        `${productRequest[1].status}: Erro ao registrar o propduto`
      );
    }
  }
});

function dynamicInput() {
  const productNamePreview = document.getElementById("preview-title");
  const productPricePreview = document.getElementById("preview-price");
  const productImageUrlPreview = document.getElementById("preview-image");

  productNameInput.addEventListener("input", () => {
    productNamePreview.innerHTML = productNameInput.value;
  });
  productPriceInput.addEventListener("input", () => {
    productPricePreview.innerHTML = `R$${productPriceInput.value}`;
  });
  productImageUrlInput.addEventListener("input", () => {
    productImageUrlPreview.setAttribute("src", productImageUrlInput.value);
  });
}

async function loadCategories() {
  let categories = await request("GET", "category");
  return categories[0];
}

async function renderCategories() {
  const categories = await loadCategories();
  const categorySelector = document.getElementById("category-id");

  let i;
  for (i = 0; i < categories.length; i++) {
    let newOption = document.createElement("option");
    newOption.setAttribute("value", categories[i].id);
    newOption.innerText = categories[i].name;
    categorySelector.appendChild(newOption);
  }
}
renderCategories();
loadCategories();
dynamicInput();
