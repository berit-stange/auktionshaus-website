
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/config";
import "./Katalogliste.css";

function Katalogliste() {
  const { auctionNumber } = useParams();
  const navigate = useNavigate();

  const [lose, setLose] = useState([]);
  const [gemerkteIds, setGemerkteIds] = useState([]);
  const [user, setUser] = useState(null);
  const [authGeprueft, setAuthGeprueft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speicherFehler, setSpeicherFehler] = useState("");
  const [speicherndesLos, setSpeicherndesLos] = useState(null);

  // Angemeldeten Benutzer ermitteln
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthGeprueft(true);
    });

    return unsubscribe;
  }, []);

  // Persönliche Merkliste in Firestore beobachten
  useEffect(() => {
    if (!authGeprueft) return;

    if (!user) {
      setGemerkteIds([]);
      return;
    }

    const merklisteRef = collection(
      db,
      "kunden",
      user.uid,
      "merkliste"
    );

    const unsubscribe = onSnapshot(
      merklisteRef,
      (snapshot) => {
        setGemerkteIds(snapshot.docs.map((dokument) => dokument.id));
      },
      (err) => {
        console.error("Fehler beim Laden der Merkliste:", err);
        setSpeicherFehler("Die Merkliste konnte nicht geladen werden.");
      }
    );

    return unsubscribe;
  }, [user, authGeprueft]);

  // Lose der ausgewählten Auktion laden
  useEffect(() => {
    async function ladeLose() {
      setLoading(true);
      setError("");

      try {
        const auktionenCollection = collection(db, "auktionen");

        let auktionenQuery = query(
          auktionenCollection,
          where("auctionNumber", "==", Number(auctionNumber))
        );

        let auktionenSnapshot = await getDocs(auktionenQuery);

        if (auktionenSnapshot.empty) {
          auktionenQuery = query(
            auktionenCollection,
            where("auctionNumber", "==", auctionNumber)
          );

          auktionenSnapshot = await getDocs(auktionenQuery);
        }

        if (auktionenSnapshot.empty) {
          setLose([]);
          return;
        }

        const auktion = auktionenSnapshot.docs[0];
        const auctionId = auktion.id;

        const loseQuery = query(
          collection(db, "lose"),
          where("auctionId", "==", auctionId)
        );

        const loseSnapshot = await getDocs(loseQuery);

        const geladeneLose = loseSnapshot.docs.map((dokument) => ({
          id: dokument.id,
          ...dokument.data(),
        }));

        geladeneLose.sort(
          (a, b) =>
            Number(a.lotNumber ?? a.losnummer ?? 0) -
            Number(b.lotNumber ?? b.losnummer ?? 0)
        );

        setLose(geladeneLose);
      } catch (err) {
        console.error("Fehler beim Laden der Lose:", err);
        setError("Die Lose konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    if (auctionNumber) {
      ladeLose();
    }
  }, [auctionNumber]);

  // Los merken oder aus der Merkliste entfernen
  async function merklisteUmschalten(los) {
    setSpeicherFehler("");

    if (!user) {
      navigate("/login");
      return;
    }

    setSpeicherndesLos(los.id);

    try {
      const losRef = doc(
        db,
        "kunden",
        user.uid,
        "merkliste",
        los.id
      );

      if (gemerkteIds.includes(los.id)) {
        await deleteDoc(losRef);
      } else {
        await setDoc(losRef, {
          losId: los.id,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Fehler beim Speichern der Merkliste:", err);
      setSpeicherFehler(
        "Das Los konnte nicht gespeichert werden. Bitte prüfe deine Anmeldung und die Firestore-Regeln."
      );
    } finally {
      setSpeicherndesLos(null);
    }
  }

  if (loading) {
    return (
      <main className="katalogliste">
        <p>Katalog wird geladen …</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="katalogliste">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="katalogliste">
      <header className="katalogliste-header">
        <h1>Auktion {auctionNumber}</h1>
        <p>{lose.length} Lose</p>
      </header>

      {speicherFehler && (
        <p role="alert">{speicherFehler}</p>
      )}

      {lose.length === 0 ? (
        <p>Für diese Auktion wurden keine Lose gefunden.</p>
      ) : (
        <div className="katalogliste-grid">
          {lose.map((los) => {
            const istGemerkt = gemerkteIds.includes(los.id);

            return (
              <article className="katalogliste-card" key={los.id}>
                <Link
                  to={`/los/${los.id}`}
                  className="katalogliste-card-link"
                >
                  <div className="katalogliste-image">
                    {los.imageUrl && (
                      <img
                        src={los.imageUrl}
                        alt={los.title || los.artist || "Auktionslos"}
                        loading="lazy"
                      />
                    )}
                  </div>

                  <div className="katalogliste-info">
                    <p className="katalogliste-lot">
                      Los {los.lotNumber ?? los.losnummer ?? "–"}
                    </p>

                    <h2>{los.title || "Ohne Titel"}</h2>

                    {los.artist && <p>{los.artist}</p>}

                    {los.estimate && (
                      <p className="katalogliste-estimate">
                        Schätzung: {los.estimate}
                      </p>
                    )}
                  </div>
                </Link>

                <button
                  type="button"
                  className="katalogliste-merkliste-button"
                  onClick={() => merklisteUmschalten(los)}
                  disabled={
                    !authGeprueft || speicherndesLos === los.id
                  }
                  aria-pressed={istGemerkt}
                >
                  {speicherndesLos === los.id
                    ? "Speichert …"
                    : istGemerkt
                    ? "✓ Gemerkt – entfernen"
                    : "♡ Merken"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Katalogliste;
