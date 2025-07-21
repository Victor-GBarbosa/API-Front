import { config } from "../../../config.mjs";

let userLoginInfo;

export { userLoginInfo };

const loginBtn = document.getElementById("login-button");
loginBtn.addEventListener("click", login);

function getLoginValues() {
  let email = document.getElementById("email-input");
  let password = document.getElementById("password-input");

  let userLogin = {
    login: email.value,
    password: password.value,
  };

  return userLogin;
}

async function login() {
  const userLogin = getLoginValues();

  let resp = await fetch(config.apiUrl + "auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userLogin),
  });

  if (resp.status === 401) {
    console.log("credenciais invalidas");
    return;
  }

  const response = await resp.json();

  userLoginInfo = userLogin;
  userLoginInfo.token = response.token;
  console.log(userLoginInfo);

  return response.token;
}
