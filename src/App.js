import LoginButton from './components/auth/LoginButton';
import LogoutButton from './components/auth/LogoutButton';
import { AuthContext } from './context/AuthContext';
import { useContext, useEffect, useState, action } from 'react';
import { createActor } from './declarations/backend'
import OpenChatFrame from './components/OpenChatFrame';

import './App.css';
import logo from './logo.svg';

function App() {
  const { isAuthenticated, identity } = useContext(AuthContext);
  const [names, setNames] = useState([]);
  const [name, setName] = useState("");
  console.log("isAuthenticated", isAuthenticated);
  console.log("identity", identity);
  

  let canisterId = process.env.REACT_APP_BACKEND_CANISTER_ID;

  let backend = createActor(canisterId, {
    agentOptions: {
      identity: identity,
      host: "http://localhost:4943",
    },
  });

  useEffect(() => {
    getNames();
    console.log("name", name);
    console.log("names", names);
  }, []);
  
  async function addName(name) {
    console.log("addname", name);
    try {
      const result = await backend.addName(name);
      console.log(result);
      if ("ok" in result) {
        getNames();
        alert("Nombre añadido con éxito.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al añadir el nombre.");
    }
  }
  
  async function getNames() {
    try {
      const result = await backend.getNames();
      console.log("result.ok", result.ok);
      if ("ok" in result) {
        setNames(result.ok);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function removeName(name) {
    console.log("removeName", name);
    try {
      const result = await backend.removeName(name);
      console.log(result);
      if ("ok" in result) {
        alert("Nombre borrado con éxito.");
        getNames();
      }
    } catch (err) {
      alert("Error al borrar el nombre.");
      console.error(err);
    }
  }

  const handleAction = async (action) => {
    if (name) {
      try {
        if (action === 'add') {
          await addName(name);
          alert(`Added name: ${name}`);
        } else if (action === 'remove') {
          await removeName(name);
          alert(`Removed name: ${name}`);
        }
        setName("");
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    } else {
      alert("Please provide a name.");
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </header>
      <main>
        <h1>Names</h1>
        <div className="form">
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
          <button className="button" type="button" onClick={() => handleAction('add')}>
            Add Name
          </button>
          <button className="button" type="button" onClick={() => handleAction('remove')}>
            Remove Name
          </button>
        </div>
        <ul className="name-list">
          {names.map((name, index) => (
            <li className="name-item" key={index}>
              {name}
            </li>
          ))}
        </ul>
        <OpenChatFrame/>
      </main>
    </div>
  );
}

export default App;
