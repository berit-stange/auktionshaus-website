
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";

import Header from "./components/Header";
import Auktionen from "./components/Auktionen";
import Kundenkonto from "./components/Kundenkonto";
import Katalogliste from "./components/Katalogliste";
import Los from "./components/Los";
import Login from "./components/Login";
import Startslider from "./components/Startslider";


function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header
        transparent={isHomePage}
        backgroundColor={isHomePage ? "transparent" : "#fff"}
      />

      <Routes>
        <Route path="/" element={<Startslider />} />
        <Route path="/auktionen" element={<Auktionen />} />
        <Route path="/kundenkonto" element={<Kundenkonto />} />
        <Route
          path="/katalog/:auctionNumber"
          element={<Katalogliste />}
        />
        <Route path="/los/:losId" element={<Los />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}


function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const snapshot = await getDocs(collection(db, "lose"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocuments(data);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
        setError("Die Daten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p>Daten werden geladen ...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
