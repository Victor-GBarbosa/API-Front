import { config } from "../../config.mjs";

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", registerSend);

console.log(config.apiUrl);

function register() {
  let user = {};

  const name = document.getElementById("name-input");
  const email = document.getElementById("email-input");
  const password = document.getElementById("password-input");
  const phone = document.getElementById("phone-input");
  const cpf = document.getElementById("cpf-input");

  console.log(name.value);

  // registerButton.removeEventListener("click", register);

  user.name = name.value;
  user.email = email.value;
  user.password = password.value;
  user.phoneNumber = phone.value;
  user.cpf = cpf.value;
  return user;
}

async function registerSend() {
  let user = register();
  console.log(JSON.stringify(user));

  const resp = await fetch(config.apiUrl + "auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (resp.ok) {
    window.alert("Usuario cadastrado com sucesso");
  } else {
    window.alert("Erro ao cadastrar o usuario");
  }
}
