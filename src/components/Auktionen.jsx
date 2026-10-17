
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";
import "./Auktionen.css";

function Auktionen() {
  const [auktionen, setAuktionen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuktionen() {
      try {
        const snapshot = await getDocs(collection(db, "auktionen"));

        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        data.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          if (Number.isNaN(dateA)) return 1;
          if (Number.isNaN(dateB)) return -1;

          return dateA - dateB;
        });

        setAuktionen(data);
      } catch (err) {
        console.error("Fehler beim Laden der Auktionen:", err);
        setError("Die Auktionen konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    loadAuktionen();
  }, []);

  function formatDate(date) {
    if (!date) return "";

    const parsedDate =
      typeof date.toDate === "function"
        ? date.toDate()
        : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(parsedDate);
  }

  return (
    <section className="auctions-page">
      <header className="auctions-heading">
        <h1>Aktuelle Auktionen</h1>
      </header>

      {loading && <p>Daten werden geladen …</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && auktionen.length === 0 && (
        <p>Zurzeit sind keine Auktionen vorhanden.</p>
      )}

      
{!loading && !error && auktionen.length > 0 && (
  
<div className="auctions-list">
  {auktionen.map((auktion) => (
    
<Link
    key={auktion.id}
    to={`/katalog/${auktion.auctionNumber}`}
    className="auction-row"
  >
  <div className="auction-row-tag">
    Auktionen
  </div>

  <div className="auction-row-info">
    <h2 className="auction-row-title">
      {auktion.title || "Unbenannte Auktion"}
    </h2>

    <p className="auction-row-date">
      {formatDate(auktion.date)}
    </p>
  </div>

  <div className="auction-row-image">
    {auktion.imageUrl && (
      <img
        src={auktion.imageUrl}
        alt={auktion.title || "Auktionsbild"}
        loading="lazy"
      />
    )}
  </div>
</Link>

  ))}
</div>

)}

    </section>
  );
}

export default Auktionen;
