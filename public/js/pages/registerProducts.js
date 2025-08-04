import { request, requestWithToken } from "../utils/apiUtils.mjs";

const productNameInput = document.getElementById("product-name");
const productPriceInput = document.getElementById("product-price");
const productImageUrlInput = document.getElementById("product-image");
const productDescInput = document.getElementById("product-description");
const categoryIdSelect = document.getElementById("category-id");

const userDetails = JSON.parse(localStorage.getItem("userDetails"));

const form = document.getElementById("product-form");
const registerProductButton = document.getElementById("productRegister-button");
console.log(registerProductButton);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (form.checkValidity()) {
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

    let response1 = await request("POST", "product", product);
    console.log(JSON.stringify(product));
    console.log(response1);
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

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
}

async function loadCategories() {
  let categories = await request("GET", "category");
  console.log(categories);
  return categories;
}

async function renderCategories() {
  const categories = await loadCategories();
  const categorySelector = document.getElementById("category-id");
  console.log(categorySelector);
  console.log();
  console.log("a");
  let i;
  for (i = 0; i < categories.length; i++) {
    console.log("ola");
    let newOption = document.createElement("option");
    newOption.setAttribute("value", categories[i].id);
    newOption.innerText = categories[i].name;
    console.log(newOption);
    categorySelector.appendChild(newOption);
  }
}
renderCategories();
loadCategories();
dynamicInput();
