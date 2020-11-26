import { sum } from "./math";
import "./app.css";
import form from "./form";
import result from "./result";

let resultElement = null;
document.addEventListener("DOMContentLoaded", async () => {
  const formElement = document.createElement("div");
  formElement.innerHTML = form.render();
  document.body.appendChild(formElement);

  resultElement = document.createElement("div");
  resultElement.innerHTML = await result.render();
  document.body.appendChild(resultElement);
});
console.log(sum(1, 2));
console.log(process.env.NODE_ENV);
console.log("FOO1 ->", FOO1);

if (module.hot) {
  module.hot.accept("./result", async () => {
    console.log("result 모듈 변경됨");
    resultElement.innerHTML = await result.render();
  });
}
