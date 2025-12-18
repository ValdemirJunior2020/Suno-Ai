import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FLAGS = [
  { lng: "en", src: "/flags/us.svg", alt: "English (US)" },
  { lng: "es", src: "/flags/es.svg", alt: "Español (España)" },
  { lng: "fr", src: "/flags/fr.svg", alt: "Français (France)" },
  { lng: "pt", src: "/flags/br.svg", alt: "Português (Brasil)" },
];

function FlagButton({ lng, src, alt, active, onClick }) {
  return (
    <button
      type="button"
      className={`flagBtn ${active ? "active" : ""}`}
      onClick={onClick}
      aria-label={alt}
      title={alt}
    >
      <img className="flagIcon" src={src} alt={alt} />
    </button>
  );
}

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const setLang = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="nav">
      <div className="nav__left">
        <div className="nav__brand">
          <div className="nav__title">{t("appName")}</div>
          <div className="nav__subtitle">{t("tagline")}</div>
        </div>

        <div className="nav__links">
          <NavLink
            to="/order"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Order
          </NavLink>

          <NavLink
            to="/media"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            Media Examples
          </NavLink>
        </div>
      </div>

      <div className="nav__right">
        <div className="flagRow" aria-label={t("language")}>
          {FLAGS.map((f) => (
            <FlagButton
              key={f.lng}
              lng={f.lng}
              src={f.src}
              alt={f.alt}
              active={i18n.language === f.lng}
              onClick={() => setLang(f.lng)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
