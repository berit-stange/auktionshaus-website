
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import Header from "./components/Header";
import Auktionen from "./components/Auktionen";

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
    <>
    <Header />
<Auktionen />
    <main>
      <h1>Auktionshaus</h1>

      {documents.length === 0 ? (
        <p>Keine Dokumente gefunden.</p>
      ) : (
        documents.map((document) => (
          <article key={document.id}>
            <h2>{document.title ?? document.id}</h2>
            <pre>{JSON.stringify(document, null, 2)}</pre>
          </article>
        ))
      )}
    </main>
    </>
  );
}

export default App;
