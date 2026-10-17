
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "./Los.css";

function Los() {
  const { losId } = useParams();

  const [los, setLos] = useState(null);
  const [auctionNumber, setAuctionNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function ladeLos() {
      setLoading(true);
      setError("");
      setLos(null);
      setAuctionNumber(null);

      try {
        // Los anhand seiner Dokument-ID laden
        const losRef = doc(db, "lose", losId);
        const losSnapshot = await getDoc(losRef);

        if (!losSnapshot.exists()) {
          setError("Dieses Los wurde nicht gefunden.");
          return;
        }

        const losDaten = {
          id: losSnapshot.id,
          ...losSnapshot.data(),
        };

        setLos(losDaten);

        // Zugehörige Auktion ermitteln
        if (losDaten.auctionId) {
          const auktionRef = doc(
            db,
            "auktionen",
            losDaten.auctionId
          );

          const auktionSnapshot = await getDoc(auktionRef);

          if (auktionSnapshot.exists()) {
            setAuctionNumber(
              auktionSnapshot.data().auctionNumber
            );
          }
        }
      } catch (err) {
        console.error("Fehler beim Laden des Loses:", err);
        setError("Das Los konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    if (losId) {
      ladeLos();
    }
  }, [losId]);

  if (loading) {
    return (
      <main className="los-page">
        <p>Los wird geladen …</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="los-page">
        <p>{error}</p>
        <Link to="/auktionen">Zurück zu den Auktionen</Link>
      </main>
    );
  }

  if (!los) return null;

  return (
    <main className="los-page">
      <div className="los-breadcrumb">
        <Link to="/auktionen">Auktionen</Link>

        {auctionNumber != null && (
          <>
            <span> / </span>
            <Link to={`/katalog/${auctionNumber}`}>
              Auktion {auctionNumber}
            </Link>
          </>
        )}

        <span> / Los {los.lotNumber ?? los.losnummer ?? "–"}</span>
      </div>

      <div className="los-detail">
        <div className="los-detail-image">
          {los.imageUrl ? (
            <img
              src={los.imageUrl}
              alt={los.title || los.artist || "Auktionslos"}
            />
          ) : (
            <p>Kein Bild verfügbar</p>
          )}
        </div>

        <section className="los-detail-info">
          <p className="los-eyebrow">
            {auctionNumber != null
              ? `AUKTION ${auctionNumber}`
              : "AUKTIONSKATALOG"}
          </p>

          <p className="los-number">
            Los {los.lotNumber ?? los.losnummer ?? "–"}
          </p>

          <h1>{los.title || "Ohne Titel"}</h1>

          {los.artist && (
            <p className="los-artist">{los.artist}</p>
          )}

          {los.year && <p>Jahr: {los.year}</p>}

          {los.technique && <p>Technik: {los.technique}</p>}

          {los.dimensions && (
            <p>Maße: {los.dimensions}</p>
          )}

          {los.estimate != null && (
            <p className="los-estimate">
              Schätzung: {los.estimate}
            </p>
          )}

          {los.description && (
            <div className="los-description">
              <h2>Beschreibung</h2>
              <p>{los.description}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Los;
