// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { i18n } = useTranslation();

  const switchLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="nav">
      <div className="nav__inner">
        {/* LEFT: Brand */}
        <div className="nav__brand">
          <div className="nav__title">MelodyMagic</div>
          <div className="nav__subtitle">
            Create personalized AI songs in minutes
          </div>
        </div>

        {/* CENTER: Service description */}
        <div className="nav__description">
          <div className="desc-en">
            🎵 Create personalized songs made just for you.
            <br />
            Perfect for birthdays, tributes, and special moments.
          </div>
          <div className="desc-pt">
            🎵 Crie músicas personalizadas feitas especialmente para você.
            <br />
            Perfeito para aniversários, homenagens e momentos especiais.
          </div>
        </div>

        {/* RIGHT: Language flags */}
        <div className="nav__flags">
          <button onClick={() => switchLang("en")} aria-label="English">
            <img src="/flags/us.svg" alt="English" />
          </button>
          <button onClick={() => switchLang("es")} aria-label="Spanish">
            <img src="/flags/es.svg" alt="Spanish" />
          </button>
          <button onClick={() => switchLang("fr")} aria-label="French">
            <img src="/flags/fr.svg" alt="French" />
          </button>
          <button onClick={() => switchLang("pt")} aria-label="Portuguese">
            <img src="/flags/br.svg" alt="Portuguese" />
          </button>
        </div>
      </div>
    </nav>
  );
}
