import { config } from "../../../config.mjs";

let userLoginInfo;

export { userLoginInfo };

if (
  localStorage.getItem("email") != null &&
  localStorage.getItem("password") != null &&
  localStorage.getItem("token") != null
) {
  console.log("passou");
  window.location.href = "./pages/mainPage.html";
}

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

  const response = await resp.json();
  userLoginInfo = userLogin;
  userLoginInfo.token = response.token;

  if (resp.status === 401) {
    console.log("credenciais invalidas");
    return;
  } else if (resp.status === 200) {
    const userRequest = await fetch(
      config.apiUrl + `users/email/${userLogin.login}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${userLogin.token}`,
        },
      }
    );

    let userResponse = await userRequest.json();

    localStorage.setItem("name", userResponse.name);
    localStorage.setItem("email", userResponse.email);
    localStorage.setItem("password", userResponse.password);
    localStorage.setItem("phone", userResponse.phone);
    localStorage.setItem("cpf", userResponse.cpf);
    localStorage.setItem("token", userLogin.token);
    window.location.reload(true);
  }
}
