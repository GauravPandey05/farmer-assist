import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => alert("Logged out successfully!"))
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <div className="App">
      <header className="App-header">
        {user ? (
          <>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <h2>Please Log In or Register</h2>
            <Login />
            <Register />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
