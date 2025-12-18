// src/pages/MediaExamples.jsx
import { useTranslation } from "react-i18next";

export default function MediaExamples() {
  const { t } = useTranslation();

  const tracks = [
    { title: "Arena y Sal", src: "/media/arena-y-sal.mp3" },
    { title: "Salt in the Air", src: "/media/salt-in-the-air.mp3" },
    { title: "Sol na Pele", src: "/media/sol-na-pele.mp3" },
  ];

  return (
    <div className="card">
      <div className="small">
        🎧 {t("mediaSubtitle") || "Listen to sample songs created with MelodyMagic"}
      </div>

      <h2 style={{ margin: "8px 0 14px" }}>
        {t("mediaTitle") || "Media Examples"}
      </h2>

      <div className="mediaGrid">
        {tracks.map((track) => (
          <div key={track.src} className="mediaCard">
            <div style={{ fontWeight: 900, marginBottom: 10 }}>
              {track.title}
            </div>

            <audio controls preload="metadata" style={{ width: "100%" }}>
              <source src={track.src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
