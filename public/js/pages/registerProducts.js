import { request , requestWithToken } from "../utils/apiUtils.mjs";

const productNameInput = document.getElementById("product-name")
const productPriceInput = document.getElementById("product-price")
const productImageUrlInput = document.getElementById("product-image")

const productDescInput = document.getElementById("product-description")

const userDetails = JSON.parse(localStorage.getItem("userDetails"))

const form = document.getElementById("product-form")
const registerProductButton = document.getElementById("productRegister-button");
console.log(registerProductButton)
form.addEventListener("submit", (e) => {
    e.preventDefault()

    if(form.checkValidity()) {
        let product = {
            user : {},
            category : {}
        };
        product.name = productNameInput.value
        product.price = productPriceInput.value
        product.description = productDescInput.value
        product.imageUrl = productImageUrlInput.value
        product.user.id = userDetails.id
        product.category.id = 1;
        
        console.log(product)
    }  
})

function dynamicPreview() {
    const productNamePreview = document.getElementById("product-title-preview")
    const productPricePreview = document.getElementById("product-price-preview")
    const productImageUrlPreview = document.getElementById("preview-image")
}

function dynamicInput() {

    const productNamePreview = document.getElementById("preview-title")
    const productPricePreview = document.getElementById("preview-price")
    const productImageUrlPreview = document.getElementById("preview-image")

    
    productNameInput.addEventListener("input", () => {productNamePreview.innerHTML = productNameInput.value})
    productPriceInput.addEventListener("input", () => {productPricePreview.innerHTML = `R$${productPriceInput.value}`})
    productImageUrlInput.addEventListener("input", () => {productImageUrlPreview.setAttribute("src", productImageUrlInput.value)})

    let userDetails = JSON.parse(localStorage.getItem("userDetails"))
    console.log(userDetails.authorities.length)
    
}

dynamicInput()