// import { apiUrl } from "../../../server.js";

const registerButton = document.getElementById("register-button");
registerButton.addEventListener("click", registerSend);
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
  user.phone = phone.value;
  user.cpf = cpf.value;

  console.log(JSON.stringify(user));

  return user;
}

async function registerSend() {
  user = register();

  const resp = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  console.log(user);

  console.log(resp.headers);
}
