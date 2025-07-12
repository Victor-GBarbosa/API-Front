url = "https://course-java-springboot-e5baa3fb02c2.herokuapp.com";
url_m = url;

function getInsertInfo() {
  return user;
}

function getInfo() {
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const password = document.getElementById("user-password").value;
  const phone = document.getElementById("user-phone").value;

  userObj = {
    name: name,
    email: email,
    password: password,
    phone: phone,
  };

  return userObj;
}

async function createUser(user) {
  const resp = await fetch(url + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (resp.status === 201 || resp.status === 200) {
    const obj = await resp.json();
    console.log("usuário criado: " + JSON.stringify(user));
    return obj;
  } else {
    console.log("Erro ao criar usuário!!!\nStatus: " + resp.status);
  }
}
