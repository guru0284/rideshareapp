import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const pricePerSeat = 4420;

const CarSeatLayout = ({ selectedSeats, onSeatSelect }) => {
  const seats = [
    { id: 1, style: "top-[50%] left-[30%]" },
    { id: 2, style: "top-[65%] left-[30%]" },
    { id: 3, style: "top-[65%] left-[55%]" }
  ];

  return (
    <div className="relative w-100 h-100">
      <img src="/carlayout.png" alt="Car Layout" className="w-full h-full object-contain" />
      {seats.map((seat) => (
        <motion.div
          key={seat.id}
          onClick={() => onSeatSelect(seat.id)}
          className={`absolute w-10 h-10 rounded cursor-pointer border-2 flex items-center justify-center ${
            selectedSeats.includes(seat.id) ? "bg-green-500 border-green-700" : "bg-gray-300 border-gray-500"
          } ${seat.style}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {seat.id}
        </motion.div>
      ))}
      <div className="flex gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-green-500 border-2 border-green-700"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 bg-gray-300 border-2 border-gray-500"></div>
          <span className="text-sm">Available</span>
        </div>
      </div>
    </div>
  );
};

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

const BookingPage = (props) => {
  const route = props.route || { from: "Koyambedu", to: "Bangalore" };
  const carDetails = props.carDetails || {
    driverName: "Krishna",
    carModel: "Innova",
    carNumber: "TN08 2004",
    carImg: "/car-1.png"
  };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayNow, setShowPayNow] = useState(false);

  const onSeatSelect = (id) => {
    setSelectedSeats((prev) => {
      if (prev.includes(id)) {
        return prev.filter((seatId) => seatId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (selectedSeats.length > 0) {
      setShowPayNow(true);
    } else {
      setShowPayNow(false);
    }
  }, [selectedSeats]);

  const routeCoordinates = [
    [13.0695, 80.2158], // Koyambedu
    [12.9716, 77.5946]  // Bangalore
  ];

  const totalFare = selectedSeats.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-purple-400 p-8 flex flex-col items-center">
      {/* Header - exact from previous code */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full flex items-center justify-center bg-white rounded-3xl shadow-lg p-4 mb-8 relative"
      >
     <button className="absolute left-4 text-purple-700 font-semibold" onClick={() => navigate("/VehicleSelection")}>
       &larr; Back
      </button>
        <h1 className="text-xl font-semibold text-gray-900">
          {route.from} ➔ {route.to}
        </h1>
      </motion.div>

      {/* Main Card */}
      <div className="max-w-5xl w-full flex gap-10 flex-col md:flex-row bg-white rounded-3xl shadow-lg p-10">
        {/* Left: Car Seat Layout */}
        <div className="flex flex-col justify-center items-center md:w-1/2">
          <CarSeatLayout selectedSeats={selectedSeats} onSeatSelect={onSeatSelect} />
        </div>

        {/* Right: Car details top and Map bottom */}
        <div className="flex flex-col md:w-1/2 justify-between">
          {/* Car Details */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center bg-gray-50 rounded-xl p-6 shadow mb-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{carDetails.carModel}</h2>
              <p className="text-gray-700">Driver: {carDetails.driverName}</p>
              <p className="text-gray-700">Car Number: {carDetails.carNumber}</p>
            </div>
            <img
              src={carDetails.carImg}
              alt={carDetails.carModel}
              className="w-36 h-24 object-cover rounded-lg shadow"
            />
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl shadow-lg h-64 md:h-80"
          >
            <MapContainer style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={routeCoordinates[0]}>
                <Popup>{route.from}</Popup>
              </Marker>
              <Marker position={routeCoordinates[1]}>
                <Popup>{route.to}</Popup>
              </Marker>
              <Polyline positions={routeCoordinates} color="purple" />
              <FitBounds positions={routeCoordinates} />
            </MapContainer>
          </motion.div>
        </div>
      </div>

      {/* Pay Now bar from footer if seat selected */}
      <AnimatePresence>
        {showPayNow && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 w-full bg-white text-grey-700 py-4 px-8 flex justify-between items-center shadow-lg z-50"
          >
            <span className="font-semibold text-lg">
              Total Fare: ₹{totalFare.toLocaleString()}
            </span>
            <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 py-2 font-bold transition">
              Pay Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
