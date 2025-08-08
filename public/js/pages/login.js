import { config } from "../../config.mjs";
import {
  request,
  requestWithToken,
  showNotification,
} from "../utils/apiUtils.mjs";

let userLoginInfo;

export { userLoginInfo };

if (
  localStorage.getItem("email") != null &&
  localStorage.getItem("password") != null &&
  localStorage.getItem("token") != null
) {
  window.location.href = "./pages/mainPage.html";
}

// Form submit

const form = document.getElementById("login-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userLogin = getLoginValues();

  let resp = await request("POST", "auth/login", userLogin);

  console.log(resp);

  if (resp[1].status === 401) {
    showNotification("WARNING", "Credenciais invalidas");
    return;
  } else if (resp[1].status === 200) {
    const response = resp[0];
    userLogin.token = response.token;
    console.log(userLogin.token);
    const userRequest = await requestWithToken(
      "GET",
      `users/email/${userLogin.login}`,
      userLogin.token
    );

    const userResponse = userRequest[0];

    localStorage.setItem("userDetails", JSON.stringify(userResponse));

    localStorage.setItem("password", userResponse.password);
    localStorage.setItem("email", userResponse.email);
    localStorage.setItem("token", userLogin.token);
    window.location.reload(true);
  }
});

function getLoginValues() {
  let email = document.getElementById("email-input");
  let password = document.getElementById("password-input");

  let userLogin = {
    login: email.value,
    password: password.value,
  };

  return userLogin;
}
