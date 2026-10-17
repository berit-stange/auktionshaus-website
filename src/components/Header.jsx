
import { useState } from "react";
import { Link } from "react-router-dom";
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
      {
        label: "Einlieferungsbedingungen",
        href: "/einlieferungsbedingungen",
      },
    ],
  },
  {
    label: "Termine",
    href: "/termine",
  },
  {
    label: "Experten",
    href: "/experten",
    submenu: [
      { label: "Moderne Kunst", href: "/experten/moderne-kunst" },
      {
        label: "Zeitgenössische Kunst",
        href: "/experten/zeitgenoessische-kunst",
      },
      { label: "Online Only", href: "/experten/online-only" },
      {
        label: "Kunst des 19. Jahrhunderts",
        href: "/experten/kunst-19-jahrhundert",
      },
      { label: "Fotografie", href: "/experten/fotografie" },
      { label: "Repräsentanten", href: "/experten/repraesentanten" },
      {
        label: "Provenienzforschung",
        href: "/experten/provenienzforschung",
      },
      {
        label: "Wissenschaftliche Katalogisierung",
        href: "/experten/wissenschaftliche-katalogisierung",
      },
    ],
  },
  {
    label: "Entdecken",
    href: "/entdecken",
    submenu: [
      { label: "Grisebach Magazin", href: "/entdecken/magazin" },
      { label: "Grisebach Podcast", href: "/entdecken/grisebach-podcast" },
      { label: "Die Villa", href: "/entdecken/die-villa" },
      {
        label: "Philosophie und Geschichte",
        href: "/entdecken/philosophie-geschichte",
      },
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

  const activeMenu = navigation.find(
    (item) => item.label === openMenu && item.submenu
  );

  function renderNavigationItem(item) {
    const isOpen = openMenu === item.label;

    return (
      <li
        className={`nav-item ${isOpen ? "menu-open" : ""}`}
        key={item.label}
      >
        <div className="nav-link-row">
          {item.submenu ? (
            <button
              className="nav-link nav-parent-button"
              type="button"
              aria-expanded={isOpen}
              aria-controls="main-mega-menu"
              onClick={() => toggleMenu(item.label)}
            >
              {item.label}
              {/* die + und - Symbole sollen raus */}
              {/* <span className="submenu-indicator" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span> */}
            </button>
          ) : (
            <Link
              className="nav-link"
              to={item.href}
              onClick={closeNavigation}
            >
              {item.label}
            </Link>
          )}
        </div>
      </li>
    );
  }

  return (
    <header className={`site-header ${openMenu ? "mega-menu-open" : ""}`}>
      <nav className="main-nav" aria-label="Hauptnavigation">
        <Link className="site-title" to="/" onClick={closeNavigation}>
          AUKTIONSHAUS
        </Link>

        <button
          className="mobile-toggle"
          type="button"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen((open) => !open);
            setOpenMenu(null);
          }}
        >
          {mobileOpen ? "Schließen" : "Menü"}
          <span className="menu-icon" aria-hidden="true">
            {mobileOpen ? "×" : "☰"}
          </span>
        </button>

        <div className={`nav-content ${mobileOpen ? "is-open" : ""}`}>
          <ul className="nav-list nav-left">
            {leftNavigation.map(renderNavigationItem)}
          </ul>

          <ul className="nav-list nav-right">
            {rightNavigation.map(renderNavigationItem)}

            <li className="nav-item header-icon-item">
              <Link
                to="/suche"
                className="header-icon-link"
                aria-label="Suche"
                onClick={closeNavigation}
              >
                <span className="material-symbols-outlined">search</span>
              </Link>
            </li>

            <li className="nav-item header-icon-item">
              <Link
                to="/kundenkonto"
                className="header-icon-link"
                aria-label="Kundenkonto"
                onClick={closeNavigation}
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </Link>
            </li>

            <li className="nav-item language-item">
              <a
                className="language-link"
                href="/en"
                aria-label="English"
                onClick={closeNavigation}
              >
                EN
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mega-Menü als direktes Kind des Headers, nicht eines Menüpunktes */}
      {activeMenu && (
        <div
          className="submenu submenu-visible"
          id="main-mega-menu"
          aria-label={`${activeMenu.label} Untermenü`}
        >
          <div className="submenu-inner">
            <ul className="submenu-links">
              {activeMenu.submenu.map((subitem) => (
                <li key={subitem.href}>
                  <Link to={subitem.href} onClick={closeNavigation}>
                    {subitem.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="submenu-image">
              {/* Hier später ein Bild einfügen */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
