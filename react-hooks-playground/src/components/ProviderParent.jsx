import * as React from "react";

const UserContext = React.createContext({ username: "" });

function ContextChild() {
  return (
    <UserContext.Consumer>
      {({ username }) => <div>THis is {username}</div>}
    </UserContext.Consumer>
  );
}

export default function () {
  const [username, setUsername] = React.useState({ username: "" });
  const [value, setValue] = React.useState("");
  return (
    <div>
      <UserContext.Provider value={username}>
        <div>
          <ContextChild />
        </div>
      </UserContext.Provider>
      <input value={value} onChange={e => setValue(e.currentTarget.value)} />
    </div>
  );
}
