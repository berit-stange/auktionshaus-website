
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/kundenkonto");
    } catch (err) {
      console.error("Login fehlgeschlagen:", err);

      setError(
        "Anmeldung fehlgeschlagen. Bitte überprüfe deine E-Mail-Adresse und dein Passwort."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <p className="login-eyebrow">KUNDENBEREICH</p>
        <h1>Anmelden</h1>
        <p>Logge dich ein, um dein Kundenkonto aufzurufen.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email">E-Mail-Adresse</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Anmeldung läuft …" : "Anmelden"}
          </button>
        </form>

        <p className="login-register-note">
          Du hast noch kein Kundenkonto? Die Registrierung richten wir
          als nächsten Schritt ein.
        </p>

        <Link className="login-back-link" to="/auktionen">
          Zurück zu den Auktionen
        </Link>
      </div>
    </main>
  );
}

export default Login;
