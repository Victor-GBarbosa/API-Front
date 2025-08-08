import { config } from "../../config.mjs";
import { request, showNotification } from "../utils/apiUtils.mjs";

const form = document.getElementById("register-form");
const cancelButton = document.getElementById("cancel-button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let user = register();

  try {
    const resp = await request("POST", "auth/register", user);

    if (resp[1].status == 200 || resp[1].status == 201) {
      showNotification("SUCCESS", "Usuário criado com sucesso");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 2000);
    } else {
      showNotification(
        "ERROR",
        `Erro ${resp[1].status}: Não foi possível criar o usuário`
      );
    }
  } catch (error) {
    console.error("Erro no registro:", error);
    showNotification("ERROR", "Erro de conexão. Tente novamente.");
  }
});

cancelButton.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input[required]");
  let hasData = false;

  inputs.forEach((input) => {
    if (input.value.trim() !== "") {
      hasData = true;
    }
  });

  if (hasData) {
    const confirmCancel = confirm(
      "Tem certeza que deseja cancelar? Os dados inseridos serão perdidos."
    );
    if (!confirmCancel) return;
  }
  window.location.href = "../index.html";
});

function register() {
  let user = {};

  const name = document.getElementById("name-input");
  const email = document.getElementById("email-input");
  const password = document.getElementById("password-input");
  const phone = document.getElementById("phone-input");
  const cpf = document.getElementById("cpf-input");

  user.name = name.value;
  user.email = email.value;
  user.password = password.value;
  user.phoneNumber = phone.value;
  user.cpf = cpf.value;
  return user;
}
