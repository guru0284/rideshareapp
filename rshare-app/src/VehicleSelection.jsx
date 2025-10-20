import { useState } from "react";
import { FaBus } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";
import { motion } from "framer-motion";

// Mock car data (can connect to backend)
const mockCars = Array.from({ length: 24 }).map((_, i) => ({
  id: `car${i + 1}`,
  carType: ["Innova", "Swift", "Ertiga"][i % 3],
  driver: ["Bathula", "Krishna", "Naveen"][i % 3],
  rating: (4.4 + (i % 3) * 0.2).toFixed(1),
  fare: 500 + i * 43,
  startTime: `${20 + (i % 3)}:30`,
  endTime: `${23 + (i % 3)}:25`,
  seats: Array.from({ length: 4 + (i % 3) }, (_, j) => ({
    seatId: `S${j + 1}`,
    available: !(j === 0 && i % 4 === 0),
  })),
  tripInfo: `${["Koyambedu", "Vellore", "Chennai"][i % 3]} → ${["Bangalore", "Mysore", "Hyderabad"][i % 3]}`,
  date: "20 Sep 2025",
  carImg: ["/car-1.png", "/car-1.png", "/car-1.png"][i % 3],
  route: [
    "Koyambedu",
    "Tambaram",
    "Vellore",
    "Bangalore",
  ][i % 4 === 0 ? 0 : 1],
}));

function Header({ source, destination, date, onBack }) {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 max-w-5xl w-full flex items-center justify-center gap-12 mb-10 relative"
    >
      {/* Back button inside box, clean and professional */}
      <button
        onClick={onBack}
        className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-700 text-base font-semibold bg-transparent border-none shadow-none m-0 p-0 outline-none"
      >
        &larr; Back
      </button>
      <div className="flex items-center gap-6 ml-20">
        <FaBus className="text-blue-600 text-xl" />
        <div>
          <p className="text-gray-500 text-sm">From</p>
          <p className="font-semibold text-lg">{source}</p>
        </div>
      </div>
      <MdKeyboardArrowRight className="self-center text-xl text-gray-400" />
      <div className="flex items-center gap-6">
        <FaBus className="text-blue-600 text-xl rotate-180" />
        <div>
          <p className="text-gray-500 text-sm">To</p>
          <p className="font-semibold text-lg">{destination}</p>
        </div>
      </div>
      <MdKeyboardArrowRight className="self-center text-xl text-gray-400" />
      <div className="flex items-center gap-6">
        <BsCalendar3 className="text-pink-600 text-xl" />
        <div>
          <p className="text-gray-500 text-sm">Date</p>
          <p className="font-semibold text-lg">{date}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function VehicleSelection({ tripDetails, onBack, onConfirm }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-400 flex flex-col items-center px-5 pt-12 pb-12">
      <div className="w-full flex flex-col items-center">
        <Header
          source={tripDetails.source}
          destination={tripDetails.destination}
          date={tripDetails.date}
          onBack={onBack}
        />
      </div>
      <motion.div
        className="bg-white rounded-3xl shadow-lg max-w-5xl w-full divide-y divide-gray-200"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
      >
        <div className="flex justify-between px-8 py-5 text-gray-700">
          <span className="font-semibold text-lg">{mockCars.length} cars found</span>
          <div className="flex gap-5 text-sm">
            <button type="button" className="hover:underline focus:outline-none">Ratings</button>
            <button type="button" className="hover:underline focus:outline-none">Departure</button>
            <button type="button" className="hover:underline focus:outline-none">Price</button>
          </div>
        </div>
        {mockCars.map((car, idx) => (
          <motion.div
            key={car.id}
            className={`flex items-center gap-6 cursor-pointer px-8 py-6 hover:shadow-lg transition-shadow rounded-2xl group ${
              idx !== mockCars.length - 1 ? "mb-6" : ""
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={car.carImg}
              alt={car.carType}
              loading="lazy"
              className="rounded-lg w-20 h-12 shadow object-cover"
            />
            <div className="flex-grow min-w-[260px]">
              <span className="inline-block bg-yellow-300 text-yellow-900 px-3 rounded-sm font-semibold shadow-sm mb-2">{`Driver: ${car.driver}`}</span>
              <h3 className="text-xl font-semibold group-hover:underline">{car.carType}</h3>
              <p className="text-gray-700">{car.tripInfo}</p>
              <div className="flex gap-6 items-center mt-1 text-gray-700">
                <span className="bg-green-100 font-semibold px-3 rounded-sm text-green-700 shadow-sm">{car.rating} ★</span>
                <span>{car.startTime} - {car.endTime}</span>
              </div>
            </div>
            <div className="flex flex-col items-center min-w-[120px]">
              <p className="text-xl font-bold mb-2">₹ {car.fare}</p>
              <button
                type="button"
                onClick={() => onConfirm(car)}
                className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700 transition"
              >
                View Seats
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
