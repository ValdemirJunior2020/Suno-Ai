import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ orderData, onSuccess }) {
  const SHEETS_API = import.meta.env.VITE_SHEETS_API_URL;

  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: "10.00"
              },
              description: "MelodyMagic – 2 Custom AI Songs"
            }
          ]
        });
      }}
      onApprove={async (data, actions) => {
        const details = await actions.order.capture();

        // Save order to Google Sheets
        await fetch(SHEETS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderID,
            payerEmail: details.payer.email_address,
            status: "PAID",
            ...orderData
          })
        });

        onSuccess();
      }}
    />
  );
}
