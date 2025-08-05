import { config } from "../../../config.mjs";

async function request(method, path, body) {
  let request = null;
  if ((method == "GET")) {
    
    request = await fetch(config.apiUrl + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    request = await fetch(config.apiUrl + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  const response = await request.json();
  return response;
}

async function requestWithToken(method, path, token, body) {
  let request;

  if (method == "GET" || body != undefined) {
    request = await fetch(config.apiUrl + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
  } else {
    request = await fetch(config.apiUrl + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
  }

  const response = await request.json();
  return response;
}

async function getUserInfo() {
  let request;
  try {
    if (
      localStorage.getItem("token") != null &&
      localStorage.getItem("email")
    ) {
      request = await requestWithToken(
        "GET",
        `users/email/${localStorage.getItem("email")}`,
        `${localStorage.getItem("token")}`
      );
    }
  } catch (error) {
    console.log(error)
  }

  return request;
}

export { getUserInfo };
export { request };
export { requestWithToken}
