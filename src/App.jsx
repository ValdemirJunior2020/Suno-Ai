import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const SHEETS_API_URL = import.meta.env.VITE_SHEETS_API_URL;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const WHATSAPP_NUMBER = "7543669922";

function uid() {
  return "MM-" + Math.random().toString(16).slice(2) + "-" + Date.now();
}

export default function App() {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState(1);
  const [savedStatus, setSavedStatus] = useState("idle"); // idle | saving | saved | error
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    package: "2_songs",
    priceUSD: 10,
    occasion: "Birthday",
    occasionOther: "",
    recipientName: "",
    relationship: "",
    dedication: "",
    musicStyle: "Pop",
    musicStyleOther: "",
    mood: "Happy",
    moodOther: "",
    languages: "en",
    whatsapp: WHATSAPP_NUMBER
  });

  const occasionValue = form.occasion === "Other" ? form.occasionOther : form.occasion;
  const styleValue = form.musicStyle === "Other" ? form.musicStyleOther : form.musicStyle;
  const moodValue = form.mood === "Other" ? form.moodOther : form.mood;

  const canGoNext = useMemo(() => {
    if (step === 1) return !!occasionValue?.trim();
    if (step === 2) return !!form.recipientName.trim() && !!form.relationship.trim() && !!form.dedication.trim();
    if (step === 3) return !!styleValue?.trim() && !!moodValue?.trim();
    return true;
  }, [step, occasionValue, styleValue, moodValue, form]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (!canGoNext) return;
    setStep((s) => Math.min(4, s + 1));
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function switchLang(lng) {
    i18n.changeLanguage(lng);
    setField("languages", lng);
  }

  async function saveToSheet({ orderId, payerEmail, status }) {
    if (!SHEETS_API_URL) throw new Error("Missing VITE_SHEETS_API_URL");
    setSavedStatus("saving");
    setErrorMsg("");

    const payload = {
      orderId,
      createdAt: new Date().toISOString(),
      package: "2_songs",
      priceUSD: 10,
      payerEmail: payerEmail || "",
      status,
      occasion: occasionValue,
      recipientName: form.recipientName,
      relationship: form.relationship,
      dedication: form.dedication,
      musicStyle: styleValue,
      mood: moodValue,
      languages: form.languages,
      whatsapp: form.whatsapp || WHATSAPP_NUMBER
    };

    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Sheets API error: ${res.status} ${txt}`);
    }

    setSavedStatus("saved");
  }

  const paypalOptions = useMemo(() => {
    return {
      clientId: PAYPAL_CLIENT_ID || "test",
      currency: "USD",
      intent: "CAPTURE"
    };
  }, []);

  return (
    <div className="page">
      <div className="overlay">
        <div className="container">
          <div className="header">
            <div className="brand">
              <h1>{t("appName")}</h1>
              <p>{t("tagline")}</p>
            </div>

            <div className="lang">
              <span className="small">{t("language")}:</span>
              <button className={i18n.language === "en" ? "active" : ""} onClick={() => switchLang("en")}>EN</button>
              <button className={i18n.language === "es" ? "active" : ""} onClick={() => switchLang("es")}>ES</button>
              <button className={i18n.language === "fr" ? "active" : ""} onClick={() => switchLang("fr")}>FR</button>
              <button className={i18n.language === "pt" ? "active" : ""} onClick={() => switchLang("pt")}>PT</button>
            </div>
          </div>

          <div className="card">
            <div className="small">{t("step")} {step} / 4</div>

            {step === 1 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("occasion")}</h2>
                <div className="row">
                  <div>
                    <label>{t("occasion")}</label>
                    <select value={form.occasion} onChange={(e) => setField("occasion", e.target.value)}>
                      <option value="Birthday">{t("occasionBirthday")}</option>
                      <option value="Anniversary">{t("occasionAnniversary")}</option>
                      <option value="Graduation">{t("occasionGraduation")}</option>
                      <option value="Tribute">{t("occasionTribute")}</option>
                      <option value="Other">{t("occasionOther")}</option>
                    </select>
                  </div>

                  {form.occasion === "Other" && (
                    <div>
                      <label>{t("occasionOther")}</label>
                      <input
                        value={form.occasionOther}
                        onChange={(e) => setField("occasionOther", e.target.value)}
                        placeholder={t("otherPlaceholder")}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("aboutPerson")}</h2>
                <div className="row">
                  <div>
                    <label>{t("recipientName")}</label>
                    <input value={form.recipientName} onChange={(e) => setField("recipientName", e.target.value)} />
                  </div>
                  <div>
                    <label>{t("relationship")}</label>
                    <input value={form.relationship} onChange={(e) => setField("relationship", e.target.value)} />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label>{t("dedication")}</label>
                  <textarea value={form.dedication} onChange={(e) => setField("dedication", e.target.value)} />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("songStyle")}</h2>
                <div className="row">
                  <div>
                    <label>{t("songStyle")}</label>
                    <select value={form.musicStyle} onChange={(e) => setField("musicStyle", e.target.value)}>
                      <option value="Pop">{t("stylePop")}</option>
                      <option value="Rock">{t("styleRock")}</option>
                      <option value="Sertanejo">{t("styleSertanejo")}</option>
                      <option value="Salsa">{t("styleSalsa")}</option>
                      <option value="Afro / Angola">{t("styleAfro")}</option>
                      <option value="Gospel">{t("styleGospel")}</option>
                      <option value="Other">{t("styleOther")}</option>
                    </select>
                  </div>

                  {form.musicStyle === "Other" && (
                    <div>
                      <label>{t("styleOther")}</label>
                      <input value={form.musicStyleOther} onChange={(e) => setField("musicStyleOther", e.target.value)} />
                    </div>
                  )}

                  <div>
                    <label>{t("mood")}</label>
                    <select value={form.mood} onChange={(e) => setField("mood", e.target.value)}>
                      <option value="Happy">{t("moodHappy")}</option>
                      <option value="Emotional">{t("moodEmotional")}</option>
                      <option value="Romantic">{t("moodRomantic")}</option>
                      <option value="Motivational">{t("moodMotivational")}</option>
                      <option value="Other">{t("moodOther")}</option>
                    </select>
                  </div>

                  {form.mood === "Other" && (
                    <div>
                      <label>{t("moodOther")}</label>
                      <input value={form.moodOther} onChange={(e) => setField("moodOther", e.target.value)} />
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("reviewPay")}</h2>

                <div className="row">
                  <div>
                    <div className="small">{t("packageTitle")}</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{t("packageDesc")}</div>
                  </div>
                  <div>
                    <div className="small">{t("contact")}: <strong>{WHATSAPP_NUMBER}</strong></div>
                  </div>
                </div>

                <div className="hr"></div>

                <div className="row">
                  <div>
                    <div className="small">{t("occasion")}</div>
                    <div style={{ fontWeight: 700 }}>{occasionValue}</div>
                  </div>
                  <div>
                    <div className="small">{t("recipientName")}</div>
                    <div style={{ fontWeight: 700 }}>{form.recipientName}</div>
                  </div>
                  <div>
                    <div className="small">{t("songStyle")}</div>
                    <div style={{ fontWeight: 700 }}>{styleValue}</div>
                  </div>
                  <div>
                    <div className="small">{t("mood")}</div>
                    <div style={{ fontWeight: 700 }}>{moodValue}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="small">{t("dedication")}</div>
                  <div style={{ whiteSpace: "pre-wrap", fontWeight: 600 }}>{form.dedication}</div>
                </div>

                <div className="hr"></div>

                <div style={{ marginBottom: 10, opacity: 0.95 }}>{t("payNote")}</div>

                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    disabled={savedStatus === "saving"}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          { description: "MelodyMagic - 2 songs", amount: { currency_code: "USD", value: "10.00" } }
                        ]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        setSavedStatus("saving");
                        setErrorMsg("");

                        const details = await actions.order.capture();
                        const payerEmail = details?.payer?.email_address || "";

                        await saveToSheet({
                          orderId: data.orderID || uid(),
                          payerEmail,
                          status: "PAID"
                        });
                      } catch (err) {
                        setSavedStatus("error");
                        setErrorMsg(String(err?.message || err));
                      }
                    }}
                    onError={(err) => {
                      setSavedStatus("error");
                      setErrorMsg(String(err));
                    }}
                  />
                </PayPalScriptProvider>

                <div style={{ marginTop: 12 }}>
                  {savedStatus === "saving" && <div className="small">{t("saving")}</div>}
                  {savedStatus === "saved" && <div className="success">{t("saved")}</div>}
                  {savedStatus === "error" && <div className="error">{t("error")} {errorMsg}</div>}
                </div>
              </>
            )}

            <div className="actions">
              <button className="btn" onClick={back} disabled={step === 1}>
                {t("back")}
              </button>

              {step < 4 ? (
                <button className="btnPrimary" onClick={next} disabled={!canGoNext}>
                  {t("next")}
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    setStep(1);
                    setSavedStatus("idle");
                    setErrorMsg("");
                    setForm((p) => ({
                      ...p,
                      occasion: "Birthday",
                      occasionOther: "",
                      recipientName: "",
                      relationship: "",
                      dedication: "",
                      musicStyle: "Pop",
                      musicStyleOther: "",
                      mood: "Happy",
                      moodOther: ""
                    }));
                  }}
                >
                  Start Over
                </button>
              )}
            </div>

            <div className="hr"></div>
            <div className="small">
              WhatsApp: <strong>{7543669922}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
