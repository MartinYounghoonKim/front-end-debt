import axios from "axios";

const result = {
  async render() {
    const res = await axios.get("/api/users");

    return (res.data || [])
      .map(user => {
        return `<div><strong>${user.id}</strong>:<p>${user.name}</p></div>`;
      })
      .join("");
  },
};

export default result;
