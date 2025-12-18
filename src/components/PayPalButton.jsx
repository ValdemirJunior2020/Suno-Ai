import { useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const SHEETS_API_URL = import.meta.env.VITE_SHEETS_API_URL;
const PAYPAL_ENV = (import.meta.env.VITE_PAYPAL_ENV || "live").toLowerCase();

const CLIENT_ID_LIVE = import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE || "";
const CLIENT_ID_SANDBOX = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX || "";

function pickClientId() {
  if (PAYPAL_ENV === "sandbox") return CLIENT_ID_SANDBOX;
  if (PAYPAL_ENV === "live") return CLIENT_ID_LIVE;

  // fallback: treat anything else as live in production
  return CLIENT_ID_LIVE || CLIENT_ID_SANDBOX;
}

export default function PayPalButton({ orderData, onSuccess }) {
  const [status, setStatus] = useState("idle"); // idle | saving | error
  const [errMsg, setErrMsg] = useState("");

  const clientId = pickClientId();

  const paypalOptions = useMemo(
    () => ({
      "client-id": clientId,
      currency: "USD",
      intent: "capture", // MUST be lowercase
      components: "buttons",
    }),
    [clientId]
  );

  async function saveToSheet(payload) {
    if (!SHEETS_API_URL) throw new Error("Missing VITE_SHEETS_API_URL");
    const res = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Sheets API error: ${res.status} ${txt}`);
    }
  }

  if (!clientId) {
    return (
      <div className="error">
        PayPal is not configured. Set VITE_PAYPAL_CLIENT_ID_LIVE / SANDBOX and rebuild.
      </div>
    );
  }

  return (
    <div>
      <PayPalScriptProvider options={paypalOptions} key={clientId}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          disabled={status === "saving"}
          forceReRender={[clientId, status]}
          createOrder={(data, actions) => {
            // IMPORTANT: only create the order here (same client-id will capture it)
            return actions.order.create({
              purchase_units: [
                {
                  description: "MelodyMagic — 2 songs",
                  amount: { currency_code: "USD", value: "10.00" },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setErrMsg("");
              setStatus("saving");

              const details = await actions.order.capture();
              const payerEmail = details?.payer?.email_address || "";

              // Save ONLY after successful capture
              await saveToSheet({
                orderId: data.orderID,
                createdAt: new Date().toISOString(),
                status: "PAID",
                payerEmail,
                ...orderData,
              });

              setStatus("idle");
              onSuccess?.(details);
            } catch (e) {
              setStatus("error");
              setErrMsg(String(e?.message || e));
            }
          }}
          onError={(e) => {
            setStatus("error");
            setErrMsg(String(e?.message || e));
          }}
        />
      </PayPalScriptProvider>

      {status === "error" && (
        <div className="error" style={{ marginTop: 12 }}>
          Error: {errMsg}
        </div>
      )}
    </div>
  );
}
