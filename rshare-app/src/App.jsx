import { useState } from "react";
import OtpLogin from "./OtpLogin";
import TripDetailsForm from "./TripDetailsForm";
import VehicleSelection from "./VehicleSelection";
import BookingPage from "./bookingpage";
import PaymentPage from "./PaymentPage";

function App() {
  const [userPhone, setUserPhone] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!userPhone) {
    return <OtpLogin onLogin={setUserPhone} />;
  }

  if (!tripDetails) {
    return <TripDetailsForm onNext={setTripDetails} />;
  }

  if (!selectedCar) {
    return (
      <VehicleSelection
        tripDetails={tripDetails}
        onBack={() => setTripDetails(null)}
        onConfirm={(car) => setSelectedCar(car)}
      />
    );
  }

  if (!selectedSeats) {
    return (
      <BookingPage
        car={selectedCar}
        tripDetails={tripDetails}
        onSelectSeats={(seats) => setSelectedSeats(seats)}
        onBack={() => setSelectedCar(null)}
      />
    );
  }

  if (!showPayment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-gray-100 to-gray-300">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Booking Summary</h2>
        <div className="max-w-xl bg-white p-6 rounded shadow w-full">
          <p><strong>Phone:</strong> {userPhone}</p>
          <p><strong>Source:</strong> {tripDetails.source}</p>
          <p><strong>Destination:</strong> {tripDetails.destination}</p>
          <p><strong>Date:</strong> {tripDetails.date}</p>
          <p><strong>Car Type:</strong> {selectedCar.carType}</p>
          <p><strong>Driver:</strong> {selectedCar.driver}</p>
          <p><strong>Seats:</strong> {selectedSeats.join(", ")}</p>
          <button
            onClick={() => setShowPayment(true)}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            Proceed to Payment
          </button>
          <button
            onClick={() => setSelectedSeats(null)}
            className="mt-2 underline text-blue-600"
          >
            Modify Seats
          </button>
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-green-100 to-green-200">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Booking Confirmed!</h1>
        <p className="text-green-800">Thank you for using VIT Ride Sharing.</p>
      </div>
    );
  }

  return (
    <PaymentPage
      bookingDetails={{ ...tripDetails, car: selectedCar, seats: selectedSeats }}
      onBack={() => setShowPayment(false)}
      onComplete={() => setBookingConfirmed(true)}
    />
  );
}

export default App;
