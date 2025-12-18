import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FlagButton({ lng, src, alt, active, onClick }) {
  return (
    <button
      type="button"
      className={`flagBtn ${active ? "active" : ""}`}
      onClick={() => onClick(lng)}
      aria-label={alt}
      title={alt}
    >
      <img className="flag" src={src} alt="" />
    </button>
  );
}

export default function Navbar() {
  const { i18n, t } = useTranslation();

  const setLang = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="navBar">
      <div className="navLeft">
        <div className="navBrand">
          <div className="navTitle">MelodyMagic</div>
          <div className="navSub">{t("tagline")}</div>
        </div>

        <div className="navLinks">
          <NavLink
            to="/order"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            {t("order")}
          </NavLink>

          <NavLink
            to="/media"
            className={({ isActive }) => `navLink ${isActive ? "active" : ""}`}
          >
            {t("mediaExamples")}
          </NavLink>
        </div>
      </div>

      {/* FLAGS RIGHT */}
      <div className="navRight">
        <div className="flagRow">
          <FlagButton
            lng="en"
            src="/flags/us.svg"
            alt="English (USA)"
            active={i18n.language === "en"}
            onClick={setLang}
          />
          <FlagButton
            lng="es"
            src="/flags/es.svg"
            alt="Español (España)"
            active={i18n.language === "es"}
            onClick={setLang}
          />
          <FlagButton
            lng="fr"
            src="/flags/fr.svg"
            alt="Français (France)"
            active={i18n.language === "fr"}
            onClick={setLang}
          />
          <FlagButton
            lng="pt"
            src="/flags/br.svg"
            alt="Português (Brasil)"
            active={i18n.language === "pt"}
            onClick={setLang}
          />
        </div>
      </div>
    </div>
  );
}
