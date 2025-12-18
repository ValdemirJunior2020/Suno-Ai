import { useTranslation } from "react-i18next";

const EXAMPLES = [
  { title: "Song 1", src: "/media/song1.mp3" },
  { title: "Song 2", src: "/media/song2.mp3" },
  { title: "Song 3", src: "/media/song3.mp3" },
];

export default function MediaExamples() {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="small">{t("mediaSub")}</div>
      <h2 style={{ margin: "8px 0 6px" }}>{t("mediaTitle")}</h2>

      {/* Always show BOTH English + Portuguese so visitors immediately understand */}
      <div className="notice" style={{ borderRadius: 14, marginTop: 10 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>
          🎶 Custom Songs for Any Occasion
        </div>
        <div style={{ opacity: 0.95, lineHeight: 1.35 }}>
          Tell us the occasion, style, mood, and message — we create your personalized songs.
        </div>

        <div className="hr" style={{ margin: "12px 0" }} />

        <div style={{ fontWeight: 900, marginBottom: 6 }}>
          🎶 Músicas Personalizadas para Qualquer Ocasião
        </div>
        <div style={{ opacity: 0.95, lineHeight: 1.35 }}>
          Diga a ocasião, estilo, emoção e mensagem — nós criamos suas músicas personalizadas.
        </div>
      </div>

      <div className="mediaList">
        {EXAMPLES.map((x) => (
          <div key={x.title} className="mediaCard">
            <div className="mediaTitle">{x.title}</div>
            <audio controls style={{ width: "100%" }}>
              <source src={x.src} type="audio/mpeg" />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
