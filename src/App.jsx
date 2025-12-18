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
  const [validationMsg, setValidationMsg] = useState("");

  const [form, setForm] = useState({
    package: "2_songs",
    priceUSD: 10,

    // ✅ NEW: buyer info (required)
    customerName: "",
    customerPhone: "",

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
    whatsapp: WHATSAPP_NUMBER,
  });

  const occasionValue = form.occasion === "Other" ? form.occasionOther : form.occasion;
  const styleValue = form.musicStyle === "Other" ? form.musicStyleOther : form.musicStyle;
  const moodValue = form.mood === "Other" ? form.moodOther : form.mood;

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setValidationMsg("");
  }

  function switchLang(lng) {
    i18n.changeLanguage(lng);
    setField("languages", lng);
  }

  function getMissingForStep(s) {
    const missing = [];

    if (s === 1) {
      if (!form.occasion?.trim()) missing.push(t("occasion") || "Occasion");
      if (form.occasion === "Other" && !form.occasionOther.trim())
        missing.push(t("occasionOther") || "Occasion (Other)");
    }

    if (s === 2) {
      if (!form.customerName.trim()) missing.push(t("customerName") || "Your name");
      if (!form.customerPhone.trim()) missing.push(t("customerPhone") || "Your phone number");

      if (!form.recipientName.trim()) missing.push(t("recipientName") || "Recipient name");
      if (!form.relationship.trim()) missing.push(t("relationship") || "Relationship");
      if (!form.dedication.trim()) missing.push(t("dedication") || "Dedication");
    }

    if (s === 3) {
      if (!form.musicStyle?.trim()) missing.push(t("songStyle") || "Music style");
      if (form.musicStyle === "Other" && !form.musicStyleOther.trim())
        missing.push(t("styleOther") || "Music style (Other)");

      if (!form.mood?.trim()) missing.push(t("mood") || "Mood");
      if (form.mood === "Other" && !form.moodOther.trim())
        missing.push(t("moodOther") || "Mood (Other)");
    }

    return missing;
  }

  const canGoNext = useMemo(() => getMissingForStep(step).length === 0, [step, form]);

  function next() {
    const missing = getMissingForStep(step);
    if (missing.length) {
      setValidationMsg(`${t("requiredMissing") || "Missing required fields"}: ${missing.join(", ")}`);
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }

  function back() {
    setValidationMsg("");
    setStep((s) => Math.max(1, s - 1));
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

      // ✅ NEW fields
      customerName: form.customerName,
      customerPhone: form.customerPhone,

      status,
      occasion: occasionValue,
      recipientName: form.recipientName,
      relationship: form.relationship,
      dedication: form.dedication,
      musicStyle: styleValue,
      mood: moodValue,
      languages: form.languages,
      whatsapp: form.whatsapp || WHATSAPP_NUMBER,
    };

    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Sheets API error: ${res.status} ${txt}`);
    }

    setSavedStatus("saved");
  }

  // ✅ PayPal provider expects "client-id" (NOT clientId)
  const paypalOptions = useMemo(() => {
    return {
      "client-id": PAYPAL_CLIENT_ID || "",
      currency: "USD",
      intent: "CAPTURE",
      components: "buttons",
    };
  }, [PAYPAL_CLIENT_ID]);

  // Block checkout if any step would still fail
  const checkoutMissing = useMemo(() => {
    const all = [
      ...getMissingForStep(1),
      ...getMissingForStep(2),
      ...getMissingForStep(3),
    ];
    // de-dup
    return Array.from(new Set(all));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, t]);

  const checkoutValid = checkoutMissing.length === 0;

  return (
    <div className="page">
      <div className="overlay">
        <div className="container">
          <div className="header">
            <div className="brand">
              <h1>{t("appName")}</h1>
              <p>{t("tagline")}</p>

              <div className="notice small">
                Env check — PayPal ID loaded: <b>{PAYPAL_CLIENT_ID ? "YES" : "NO"}</b>
              </div>
            </div>

           <div className="lang">
  <span className="small">{t("language")}:</span>

  <button className={i18n.language === "en" ? "active" : ""} onClick={() => switchLang("en")}>
    <img className="flag" src="/flags/us.svg" alt="US" />
    EN
  </button>

  <button className={i18n.language === "es" ? "active" : ""} onClick={() => switchLang("es")}>
    <img className="flag" src="/flags/es.svg" alt="ES" />
    ES
  </button>

  <button className={i18n.language === "fr" ? "active" : ""} onClick={() => switchLang("fr")}>
    <img className="flag" src="/flags/fr.svg" alt="FR" />
    FR
  </button>

  <button className={i18n.language === "pt" ? "active" : ""} onClick={() => switchLang("pt")}>
    <img className="flag" src="/flags/br.svg" alt="BR" />
    PT
  </button>
</div>

          </div>

          <div className="card">
            <div className="small">
              {t("step")} {step} / 4
            </div>

            {validationMsg && <div className="error" style={{ marginTop: 10 }}>{validationMsg}</div>}

            {/* STEP 1 */}
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

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("aboutPerson")}</h2>

                <div className="row">
                  <div>
                    <label>{t("customerName")}</label>
                    <input
                      value={form.customerName}
                      onChange={(e) => setField("customerName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label>{t("customerPhone")}</label>
                    <input
                      value={form.customerPhone}
                      onChange={(e) => setField("customerPhone", e.target.value)}
                      placeholder="+1 754 366 9922"
                    />
                  </div>
                </div>

                <div className="row" style={{ marginTop: 12 }}>
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

            {/* STEP 3 */}
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

            {/* STEP 4 */}
            {step === 4 && (
              <>
                <h2 style={{ margin: "10px 0 8px" }}>{t("reviewPay")}</h2>

                <div className="row">
                  <div>
                    <div className="small">{t("packageTitle")}</div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>{t("packageDesc")}</div>
                  </div>
                  <div>
                    <div className="small">{t("contact")}: <strong>{WHATSAPP_NUMBER}</strong></div>
                  </div>
                </div>

                <div className="hr"></div>

                <div className="row">
                  <div>
                    <div className="small">{t("customerName")}</div>
                    <div style={{ fontWeight: 800 }}>{form.customerName}</div>
                  </div>
                  <div>
                    <div className="small">{t("customerPhone")}</div>
                    <div style={{ fontWeight: 800 }}>{form.customerPhone}</div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 10 }}>
                  <div>
                    <div className="small">{t("occasion")}</div>
                    <div style={{ fontWeight: 800 }}>{occasionValue}</div>
                  </div>
                  <div>
                    <div className="small">{t("recipientName")}</div>
                    <div style={{ fontWeight: 800 }}>{form.recipientName}</div>
                  </div>
                  <div>
                    <div className="small">{t("songStyle")}</div>
                    <div style={{ fontWeight: 800 }}>{styleValue}</div>
                  </div>
                  <div>
                    <div className="small">{t("mood")}</div>
                    <div style={{ fontWeight: 800 }}>{moodValue}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div className="small">{t("dedication")}</div>
                  <div style={{ whiteSpace: "pre-wrap", fontWeight: 650 }}>{form.dedication}</div>
                </div>

                <div className="hr"></div>

                <div style={{ marginBottom: 10, opacity: 0.95 }}>
                  {t("payNote")}
                </div>

                {!checkoutValid && (
                  <div className="error" style={{ marginBottom: 10 }}>
                    {t("requiredMissing") || "Missing required fields"}: {checkoutMissing.join(", ")}
                  </div>
                )}

                {!PAYPAL_CLIENT_ID ? (
                  <div className="error">PayPal is not configured. Add VITE_PAYPAL_CLIENT_ID in .env and restart.</div>
                ) : (
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={!checkoutValid || savedStatus === "saving"}
                      forceReRender={[checkoutValid, savedStatus]}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              description: "MelodyMagic - 2 songs",
                              amount: { currency_code: "USD", value: "10.00" },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const details = await actions.order.capture();
                          const payerEmail = details?.payer?.email_address || "";

                          await saveToSheet({
                            orderId: data.orderID || uid(),
                            payerEmail,
                            status: "PAID",
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
                )}

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
                    setValidationMsg("");
                    setForm((p) => ({
                      ...p,
                      customerName: "",
                      customerPhone: "",
                      occasion: "Birthday",
                      occasionOther: "",
                      recipientName: "",
                      relationship: "",
                      dedication: "",
                      musicStyle: "Pop",
                      musicStyleOther: "",
                      mood: "Happy",
                      moodOther: "",
                    }));
                  }}
                >
                  Start Over
                </button>
              )}
            </div>

            <div className="hr"></div>
            <div className="small">
              WhatsApp: <strong>{WHATSAPP_NUMBER}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
