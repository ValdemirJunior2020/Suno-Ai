// src/i18n/index.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resources"; // ✅ FIX: default import (not { resources })

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
