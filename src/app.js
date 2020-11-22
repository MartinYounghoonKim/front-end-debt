import { sum } from "./math";
import "./app.css";
import mini from "./mini.png";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
    <img src="${mini}"/>
  `;
})
console.log(sum(1, 2));
