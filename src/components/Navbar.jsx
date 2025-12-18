import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FlagButton({ active, onClick, src, alt }) {
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
      <div className="navInner">
        <div className="navLeft">
          <div className="navBrand">
            <div className="navTitle">MelodyMagic</div>
            <div className="navTag">{t("tagline")}</div>
          </div>

          <div className="navLinks">
            <NavLink to="/order" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
              {t("navOrder")}
            </NavLink>
            <NavLink to="/media" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
              {t("navMedia")}
            </NavLink>
          </div>
        </div>

        <div className="navRight">
          <div className="flagRow">
            <FlagButton
              active={i18n.language === "en"}
              onClick={() => setLang("en")}
              src="/flags/us.svg"
              alt="English (US)"
            />
            <FlagButton
              active={i18n.language === "es"}
              onClick={() => setLang("es")}
              src="/flags/es.svg"
              alt="Español (España)"
            />
            <FlagButton
              active={i18n.language === "fr"}
              onClick={() => setLang("fr")}
              src="/flags/fr.svg"
              alt="Français (France)"
            />
            <FlagButton
              active={i18n.language === "pt"}
              onClick={() => setLang("pt")}
              src="/flags/br.svg"
              alt="Português (Brasil)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
