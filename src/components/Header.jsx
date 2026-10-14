
import { useState } from "react";
import "./Header.css";

const navigation = [
  {
    label: "Auktionen",
    href: "/auktionen",
    submenu: [
      { label: "Aktuelle Auktionen", href: "/auktionen" },
      { label: "Kataloge", href: "/kataloge" },
      { label: "Künstlerverzeichnis", href: "/kuenstler" },
      { label: "Online Live Auktionen", href: "/live-auktionen" },
      { label: "Werk- und Objektarchiv", href: "/archiv" },
      { label: "Auktionsergebnisse", href: "/ergebnisse" },
    ],
  },
  {
    label: "Kaufen",
    href: "/kaufen",
    submenu: [
      { label: "Kunst kaufen", href: "/kaufen" },
      { label: "Registrieren und bieten", href: "/registrieren" },
      { label: "Bezahlung und Transport", href: "/bezahlung-transport" },
    ],
  },
  {
    label: "Verkaufen",
    href: "/verkaufen",
    submenu: [
      { label: "Kunst einliefern", href: "/einliefern" },
      { label: "Schätzung und Beratung", href: "/beratung" },
      { label: "Einlieferungsbedingungen", href: "/einlieferungsbedingungen" },
    ],
  },
  {
    label: "Termine",
    href: "/termine",
  },
  {
    label: "Experten",
    href: "/experten",
  },
  {
    label: "Entdecken",
    href: "/entdecken",
    submenu: [
      { label: "Magazin", href: "/magazin" },
      { label: "Podcast", href: "/podcast" },
      { label: "Über uns", href: "/ueber-uns" },
    ],
  },
  {
    label: "Kontakt",
    href: "/kontakt",
  },
];

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  function toggleMenu(label) {
    setOpenMenu((current) => (current === label ? null : label));
  }

  function closeNavigation() {
    setMobileOpen(false);
    setOpenMenu(null);
  }

  const leftNavigation = navigation.slice(0, 5);
const rightNavigation = navigation.slice(5);

  return (
    <header className="site-header">
      
  <nav className="main-nav" aria-label="Hauptnavigation">
  <a className="site-title" href="/" onClick={closeNavigation}>
    AUKTIONSHAUS
  </a>

  <button
    className="mobile-toggle"
    type="button"
    aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
    aria-expanded={mobileOpen}
    onClick={() => setMobileOpen((open) => !open)}
  >
    {mobileOpen ? "Schließen" : "Menü"}
    <span className="menu-icon">
      {mobileOpen ? "×" : "☰"}
    </span>
  </button>


        
<div className={`nav-content ${mobileOpen ? "is-open" : ""}`}>
  <ul className="nav-list nav-left">
    {leftNavigation.map((item) => (
      <li
        className={`nav-item ${
          openMenu === item.label ? "menu-open" : ""
        }`}
        key={item.label}
        onMouseEnter={() => {
          if (window.matchMedia("(min-width: 769px)").matches) {
            setOpenMenu(item.label);
          }
        }}
        onMouseLeave={() => {
          if (window.matchMedia("(min-width: 769px)").matches) {
            setOpenMenu(null);
          }
        }}
      >
        <div className="nav-link-row">
          <a className="nav-link" href={item.href} onClick={closeNavigation}>
            {item.label}
          </a>

          {item.submenu && (
            <button
              className="submenu-toggle"
              type="button"
              aria-label={`${item.label} Untermenü`}
              aria-expanded={openMenu === item.label}
              onClick={() => toggleMenu(item.label)}
            >
              <span aria-hidden="true">
                {openMenu === item.label ? "−" : "+"}
              </span>
            </button>
          )}
        </div>

        {item.submenu && (
          <ul
            className={`submenu ${
              openMenu === item.label ? "submenu-visible" : ""
            }`}
          >
            {item.submenu.map((subitem) => (
              <li key={subitem.href}>
                <a href={subitem.href} onClick={closeNavigation}>
                  {subitem.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>

  <ul className="nav-list nav-right">
    {rightNavigation.map((item) => (
      <li
        className={`nav-item ${
          openMenu === item.label ? "menu-open" : ""
        }`}
        key={item.label}
        onMouseEnter={() => {
          if (window.matchMedia("(min-width: 769px)").matches) {
            setOpenMenu(item.label);
          }
        }}
        onMouseLeave={() => {
          if (window.matchMedia("(min-width: 769px)").matches) {
            setOpenMenu(null);
          }
        }}
      >
        <div className="nav-link-row">
          <a className="nav-link" href={item.href} onClick={closeNavigation}>
            {item.label}
          </a>

          {item.submenu && (
            <button
              className="submenu-toggle"
              type="button"
              aria-label={`${item.label} Untermenü`}
              aria-expanded={openMenu === item.label}
              onClick={() => toggleMenu(item.label)}
            >
              <span aria-hidden="true">
                {openMenu === item.label ? "−" : "+"}
              </span>
            </button>
          )}
        </div>

        {item.submenu && (
          <ul
            className={`submenu ${
              openMenu === item.label ? "submenu-visible" : ""
            }`}
          >
            {item.submenu.map((subitem) => (
              <li key={subitem.href}>
                <a href={subitem.href} onClick={closeNavigation}>
                  {subitem.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
    <li className="nav-item language-item">
      <a className="language-link" href="/en" aria-label="English">
        EN
      </a>
    </li>
  </ul>
</div>



      </nav>
    </header>
  );
}

export default Header;

