// Dados mockados para produtos (simulando uma API)
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

const userLogOutButton = document.getElementById("user-button");
userLogOutButton.addEventListener("click", logOut);

if (localStorage.getItem("token") == null) {
  window.location.href = "../index.html";
}

console.log("coisa");

function logOut() {
  localStorage.removeItem("cpf");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("password");
  localStorage.removeItem("phone");
  localStorage.removeItem("token");

  window.location.reload(true);
}
