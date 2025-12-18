import PayPalButton from "../components/PayPalButton";

export default function StepReviewPay({ formData, onBack, onReset }) {
  return (
    <div>
      <h2>Review & Pay</h2>

      <p><b>Package:</b> $10 – 2 songs</p>
      <p><b>Occasion:</b> {formData.occasion}</p>
      <p><b>Recipient:</b> {formData.recipientName}</p>
      <p><b>Style:</b> {formData.musicStyle}</p>
      <p><b>Mood:</b> {formData.mood}</p>
      <p><b>Message:</b> {formData.dedication}</p>

      <p style={{ marginTop: 20 }}>
        After payment, we’ll save your request and deliver 2 songs in about 30 minutes.
      </p>

      <div style={{ marginTop: 20 }}>
        <PayPalButton
          orderData={formData}
          onSuccess={() => alert("Payment successful! Your songs are on the way 🎶")}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={onBack}>Back</button>
        <button onClick={onReset}>Start Over</button>
      </div>
    </div>
  );
}
