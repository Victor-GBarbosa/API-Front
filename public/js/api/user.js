import { userLoginInfo } from "../pages/login";
import { config } from "../../../config.mjs";

const resp2 = await fetch(
  config.apiUrl + `users/email/${userLoginInfo.login}`,
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${userLoginInfo.token}`,
    },
  }
);

let returnedUser = await resp2.json();

console.log(returnedUser);
