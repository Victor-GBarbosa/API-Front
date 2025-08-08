import { config } from "../../config.mjs";

async function request(method, path, body) {
  let request = null;
  if (method == "GET") {
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

  let response = null;
  try {
    response = await request.json();
  } catch (error) {
    console.log(error);
  }

  return [response, request];
}

async function requestWithToken(method, path, token, body) {
  let request;

  if (method == "GET") {
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
  return [response, request];
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
  } catch (error) {}

  return request;
}

function showNotification(type, message) {
  //Verficando se há alguma notificação
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }
  let color;
  switch (type) {
    case "SUCCESS":
      color = "#27ae60";
      break;
    case "WARNING":
      color = "#e0cb0a";
      break;
    case "ERROR":
      color = "#e74c3c";
      break;
  }

  //Criando a div da notificação
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: white;
    color: #333;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border-left: 15px solid ${color};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    font-weight: 500;
    min-width: 300px;
    max-width: 400px;
  `;
  notification.textContent = message;

  //Adicionando a animação
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);
  // removendo a notificação apos 3 segundos
  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export { showNotification };
export { getUserInfo };
export { request };
export { requestWithToken };
