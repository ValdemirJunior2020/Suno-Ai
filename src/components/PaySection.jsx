import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

export default function PaySection({ amountUSD = "10.00", onApprove }) {
  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="error">
        PayPal is not configured. Add VITE_PAYPAL_CLIENT_ID in your .env and restart.
      </div>
    );
  }

  const options = {
    clientId: PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture", // ✅ MUST be lowercase "capture"
    components: "buttons",
  };

  return (
    <PayPalScriptProvider options={options}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: "MelodyMagic - 2 songs",
                amount: { currency_code: "USD", value: amountUSD },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          onApprove?.({ data, details });
        }}
      />
    </PayPalScriptProvider>
  );
}
