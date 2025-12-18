import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaySection({ amount = "10.00", onPaid }) {
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="error">
        PayPal not configured. Add VITE_PAYPAL_CLIENT_ID in .env and restart.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12 }}>
      <PayPalScriptProvider
        options={{
          clientId: PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "CAPTURE",
          components: "buttons"
        }}
      >
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: "MelodyMagic - 2 songs",
                  amount: { currency_code: "USD", value: amount }
                }
              ]
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            await onPaid({ orderID: data.orderID, details });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
