import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.orderId) {
    return (
      <div className="card">
        <h2>Payment Success</h2>
        <p className="small">No order details found. Go back to Order.</p>
        <Link className="btnPrimary" to="/order" style={{ display: "inline-block", textAlign: "center" }}>
          Back to Order
        </Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>✅ Payment Successful!</h2>

      <div className="hr" />

      <div className="row">
        <div>
          <div className="small">Order ID</div>
          <div style={{ fontWeight: 900 }}>{state.orderId}</div>
        </div>
        <div>
          <div className="small">Email</div>
          <div style={{ fontWeight: 900 }}>{state.payerEmail || "—"}</div>
        </div>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <div className="small">Customer Name</div>
          <div style={{ fontWeight: 900 }}>{state.customerName || "—"}</div>
        </div>
        <div>
          <div className="small">Customer Phone</div>
          <div style={{ fontWeight: 900 }}>{state.customerPhone || "—"}</div>
        </div>
      </div>

      <div className="hr" />

      <p style={{ margin: 0 }}>
        We received your request 🎶 You’ll get your songs soon.
      </p>

      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => navigate("/order", { replace: true })}>
          Create another order
        </button>
        <Link className="btnPrimary" to="/media" style={{ textAlign: "center", textDecoration: "none" }}>
          See Media Examples
        </Link>
      </div>
    </div>
  );
}
