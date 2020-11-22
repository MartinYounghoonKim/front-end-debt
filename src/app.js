import { sum } from "./math";
import "./app.css";
import mini from "./mini.png";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
    <img src="${mini}"/>
  `;
})
console.log(sum(1, 2));
console.log(process.env.NODE_ENV);
console.log("FOO1 ->", FOO1);
