
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import Login from "./Login";

export default function SiteLoginGate({ children }) {
  const [user, setUser] = useState(null);
  const [authGeprueft, setAuthGeprueft] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthGeprueft(true);
    });

    return unsubscribe;
  }, []);

  if (!authGeprueft) {
    return <p>Website wird geladen …</p>;
  }

  if (!user) {
    return <Login />;
  }

  return children;
}
