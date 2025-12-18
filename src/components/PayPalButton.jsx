import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function resolveEnvMode() {
  const configured = (import.meta.env.VITE_PAYPAL_ENV || "auto").toLowerCase();
  if (configured === "sandbox" || configured === "live") return configured;

  // auto mode: localhost => sandbox, otherwise live
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return "sandbox";
  return "live";
}

function resolveClientId(mode) {
  const live = import.meta.env.VITE_PAYPAL_CLIENT_ID_LIVE;
  const sandbox = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;

  const id = mode === "live" ? live : sandbox;
  return id || "";
}

export default function PayPalButton({
  amountUSD = "10.00",
  description = "MelodyMagic – 2 Custom Songs",
  disabled = false,
  onSuccess,
  onError,
}) {
  const mode = resolveEnvMode();
  const clientId = resolveClientId(mode);

  // Pay Later is enabled via "enable-funding"
  // Apple Pay shows automatically ONLY if your account + domain are eligible
  const options = {
    "client-id": clientId,
    currency: "USD",
    components: "buttons",
    "enable-funding": "paylater",
    // NOTE: do NOT set intent here (PayPal rejects CAPTURE in some setups)
  };

  if (!clientId) {
    return (
      <div className="error">
        PayPal is not configured. Missing client ID for <b>{mode}</b>.
        <div className="small" style={{ marginTop: 6 }}>
          Add VITE_PAYPAL_CLIENT_ID_{mode.toUpperCase()} in your .env and restart dev server.
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        disabled={disabled}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description,
                amount: { currency_code: "USD", value: amountUSD },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();

            const payerEmail = details?.payer?.email_address || "";
            const payerName =
              [details?.payer?.name?.given_name, details?.payer?.name?.surname]
                .filter(Boolean)
                .join(" ") || "";

            onSuccess?.({
              orderId: data.orderID,
              payerEmail,
              payerName,
              details,
            });
          } catch (e) {
            console.error(e);
            onError?.(e);
            alert("Payment capture failed. Please try again.");
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          onError?.(err);
          alert("PayPal could not load or complete the payment.");
        }}
      />
    </PayPalScriptProvider>
  );
}
