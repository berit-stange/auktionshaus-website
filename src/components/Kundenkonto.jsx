
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/config";
import "./Kundenkonto.css";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Kundenkonto() {
  const [user, setUser] = useState(null);
  const [authGeprueft, setAuthGeprueft] = useState(false);
  const [merkliste, setMerkliste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogout() {
  try {
    await signOut(auth);
    navigate("/login");
  } catch (error) {
    console.error("Fehler beim Logout:", error);
  }
}

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthGeprueft(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authGeprueft) return;

    let abgebrochen = false;

    async function ladeMerkliste() {
      setLoading(true);
      setError("");

      if (!user) {
        setMerkliste([]);
        setLoading(false);
        return;
      }

      try {
        const merklisteRef = collection(
          db,
          "kunden",
          user.uid,
          "merkliste"
        );

        const snapshot = await getDocs(merklisteRef);

        const loseMitDaten = await Promise.all(
          snapshot.docs.map(async (merklisteDokument) => {
            const losId = merklisteDokument.id;
            const losRef = doc(db, "lose", losId);
            const losSnapshot = await getDoc(losRef);

            if (!losSnapshot.exists()) {
              return null;
            }

            return {
              id: losSnapshot.id,
              ...losSnapshot.data(),
            };
          })
        );

        const vorhandeneLose = loseMitDaten.filter(Boolean);

        // Losnummern aufsteigend sortieren
        vorhandeneLose.sort(
          (a, b) =>
            Number(a.lotNumber ?? a.losnummer ?? 0) -
            Number(b.lotNumber ?? b.losnummer ?? 0)
        );

        if (!abgebrochen) {
          setMerkliste(vorhandeneLose);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Merkliste:", err);

        if (!abgebrochen) {
          setError(
            "Deine Merkliste konnte nicht geladen werden."
          );
        }
      } finally {
        if (!abgebrochen) {
          setLoading(false);
        }
      }
    }

    ladeMerkliste();

    return () => {
      abgebrochen = true;
    };
  }, [user, authGeprueft]);

  async function losEntfernen(id) {
    if (!user) return;

    try {
      await deleteDoc(
        doc(db, "kunden", user.uid, "merkliste", id)
      );

      setMerkliste((aktuell) =>
        aktuell.filter((los) => los.id !== id)
      );
    } catch (err) {
      console.error("Fehler beim Entfernen des Loses:", err);
      setError("Das Los konnte nicht entfernt werden.");
    }
  }

  if (!authGeprueft || loading) {
    return (
      <main className="kundenkonto-page">
        <p>Merkliste wird geladen …</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="kundenkonto-page">
        <h1>Meine Merkliste</h1>
        <p>Bitte melde dich an, um deine Merkliste aufzurufen.</p>
        <Link to="/login">Zur Anmeldung</Link>
      </main>
    );
  }

  return (
    <main className="kundenkonto-page">
      <div className="kundenkonto-layout">
    <aside className="kundenkonto-sidebar">
    <p className="kundenkonto-sidebar-title">MEIN KONTO</p>

    <nav aria-label="Kundenbereich">
      <NavLink
        to="/kundenkonto"
        end
        className={({ isActive }) =>
          `kundenkonto-nav-link${isActive ? " active" : ""}`
        }
      >
        Merkliste
      </NavLink>

      <NavLink
        to="/auktionen"
        className={({ isActive }) =>
          `kundenkonto-nav-link${isActive ? " active" : ""}`
        }
      >
        Auktionen
      </NavLink>

      <NavLink
        to="/veranstaltungen"
        className={({ isActive }) =>
          `kundenkonto-nav-link${isActive ? " active" : ""}`
        }
      >
        Veranstaltungen
      </NavLink>

      <NavLink
        to="/kuenstler"
        className={({ isActive }) =>
          `kundenkonto-nav-link${isActive ? " active" : ""}`
        }
      >
        Künstler
      </NavLink>

      <NavLink
        to="/benachrichtigungen"
        className={({ isActive }) =>
          `kundenkonto-nav-link${isActive ? " active" : ""}`
        }
      >
        Benachrichtigungen
      </NavLink>
    </nav>

    <button
      type="button"
      className="kundenkonto-logout"
      onClick={handleLogout}
    >Abmelden
    </button>

    </aside>

    <section className="kundenkonto-content">
      <header className="kundenkonto-heading">
        <p className="kundenkonto-eyebrow">KUNDENBEREICH</p>
        <h1>Meine Merkliste</h1>
        <p className="kundenkonto-description">
          Hier findest du die Lose, die du für später vorgemerkt hast.
        </p>
      </header>

      {error && <p role="alert">{error}</p>}

      {!error && merkliste.length === 0 ? (
        <div className="merkliste-empty">
          <h2>Deine Merkliste ist noch leer.</h2>
          <p>
            Wenn du interessante Lose entdeckst, kannst du sie hier
            für später vormerken.
          </p>
          <Link to="/auktionen">Zu den Auktionen</Link>
        </div>
      ) : (
        <div className="merkliste-list">
          {merkliste.map((los) => (
            <article className="merkliste-item" key={los.id}>
              <Link
                to={`/los/${los.id}`}
                className="merkliste-item-link"
              >
                {los.imageUrl && (
                  <div className="merkliste-image">
                    <img
                      src={los.imageUrl}
                      alt={los.title || los.artist || "Auktionslos"}
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="merkliste-info">
                  <p className="merkliste-lot-number">
                    Los {los.lotNumber ?? los.losnummer ?? "–"}
                  </p>

                  <h2>{los.title || "Ohne Titel"}</h2>

                  {los.artist && <p>{los.artist}</p>}

                  {los.year && <p>{los.year}</p>}

                  {los.estimate && (
                    <p>Schätzung: {los.estimate}</p>
                  )}
                </div>
              </Link>

              <button
                className="merkliste-remove"
                type="button"
                onClick={() => losEntfernen(los.id)}
              >
                Aus Merkliste entfernen
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
    </div>
    </main>
  );
}

export default Kundenkonto;
