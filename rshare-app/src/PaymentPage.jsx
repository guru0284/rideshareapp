import { useState } from "react";

const paymentMethods = [
  { id: "creditCard", label: "Credit Card" },
  { id: "debitCard", label: "Debit Card" },
  { id: "upi", label: "UPI" },
  { id: "netBanking", label: "Net Banking" },
  { id: "cash", label: "Cash on Pickup" },
];

export default function PaymentPage({ bookingDetails, onBack, onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });
  const [error, setError] = useState("");

  const validatePayment = () => {
    setError("");
    if (!selectedMethod) {
      setError("Please select a payment method.");
      return false;
    }
    if (selectedMethod === "creditCard" || selectedMethod === "debitCard") {
      if (
        !/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s+/g, "")) ||
        !paymentInfo.nameOnCard.trim() ||
        !/^\d{2}\/\d{2}$/.test(paymentInfo.expiry) ||
        !/^\d{3}$/.test(paymentInfo.cvv)
      ) {
        setError("Please enter valid card details.");
        return false;
      }
    }
    if (selectedMethod === "upi" && !paymentInfo.upiId.trim()) {
      setError("Please enter valid UPI ID.");
      return false;
    }
    return true;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      // Mock payment processing
      alert("Payment successful! Booking confirmed.");
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <form
        onSubmit={handlePay}
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
        aria-label="Payment form"
      >
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
          Payment Details
        </h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          <p><strong>From:</strong> {bookingDetails.source}</p>
          <p><strong>To:</strong> {bookingDetails.destination}</p>
          <p><strong>Date:</strong> {bookingDetails.date}</p>
          <p><strong>Car:</strong> {bookingDetails.carType.charAt(0).toUpperCase() + bookingDetails.carType.slice(1)}</p>
          <p><strong>Seats:</strong> {bookingDetails.seats.join(", ")}</p>
        </div>

        <fieldset className="mb-6">
          <legend className="font-semibold mb-2">Select Payment Method</legend>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`px-4 py-2 rounded border font-semibold transition-colors ${
                  selectedMethod === method.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100"
                }`}
                aria-pressed={selectedMethod === method.id}
              >
                {method.label}
              </button>
            ))}
          </div>
        </fieldset>

        {(selectedMethod === "creditCard" || selectedMethod === "debitCard") && (
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Card Number (16 digits)"
              maxLength={19}
              value={paymentInfo.cardNumber}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={paymentInfo.nameOnCard}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, nameOnCard: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                maxLength={5}
                value={paymentInfo.expiry}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, expiry: e.target.value.replace(/[^\d\/]/g, "").slice(0, 5) })
                }
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="CVV"
                maxLength={3}
                value={paymentInfo.cvv}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {selectedMethod === "upi" && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={paymentInfo.upiId}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, upiId: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            &larr; Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold px-6 py-2 rounded"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
}
