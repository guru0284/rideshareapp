import { useState } from "react";
import { FaBus, FaCar, FaUser } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BsCalendar3 } from "react-icons/bs";

const todayStr = new Date().toISOString().split("T")[0];
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = tomorrowDate.toISOString().split("T")[0];

export default function TripSelectionPage({ onNext, initialData }) {
  const [source, setSource] = useState(initialData?.source || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [date, setDate] = useState(initialData?.date || todayStr);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!source.trim()) errs.source = "Please enter source.";
    if (!destination.trim()) errs.destination = "Please enter destination.";
    if (!date) errs.date = "Please select travel date.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onNext({ source, destination, date,});
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-purple-400 p-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl p-10 flex flex-row items-center justify-between gap-10 flex-wrap"
        aria-label="Trip details form"
      >
        {/* Source */}
        <div className="flex flex-col items-start gap-2 flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 text-xl text-blue-700 font-semibold">
            <FaCar className="text-3xl" />
            From
          </div>
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="Enter starting point"
            className={`font-semibold text-xl w-full border-b-2 border-gray-300 focus:border-blue-700 rounded outline-none py-3 px-2 mt-1
              ${errors.source ? "border-red-600" : ""}`}
          />
          {errors.source && <span className="text-red-600 text-sm">{errors.source}</span>}
        </div>
        {/* Arrow */}
        <MdKeyboardArrowRight className="text-5xl text-gray-400" />
        {/* Destination */}
        <div className="flex flex-col items-start gap-2 flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 text-xl text-blue-700 font-semibold">
            <FaCar className="text-3xl rotate-180" />
            To
          </div>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="Enter destination"
            className={`font-semibold text-xl w-full border-b-2 border-gray-300 focus:border-blue-700 rounded outline-none py-3 px-2 mt-1
              ${errors.destination ? "border-red-600" : ""}`}
          />
          {errors.destination && <span className="text-red-600 text-sm">{errors.destination}</span>}
        </div>
        {/* Date and Buttons */}
        <div className="flex flex-col items-start gap-3 flex-1 min-w-[250px]">
          <div className="flex items-center gap-2 text-xl text-pink-600 font-semibold">
            <BsCalendar3 className="text-3xl" />
            Date of Journey
          </div>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            min={todayStr}
            className={`font-semibold text-xl w-full border-b-2 border-gray-300 focus:border-pink-600 rounded outline-none py-3 px-2 mt-1
              ${errors.date ? "border-red-600" : ""}`}
          />
          {errors.date && <span className="text-red-600 text-sm">{errors.date}</span>}

          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={() => setDate(todayStr)}
              className={`rounded-full px-6 py-2 text-lg font-semibold border-2 
                ${date === todayStr ? "bg-red-100 text-red-700 border-red-400" : "bg-gray-100 text-gray-700 border-gray-300"}`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setDate(tomorrowStr)}
              className={`rounded-full px-6 py-2 text-lg font-semibold border-2 
                ${date === tomorrowStr ? "bg-red-100 text-red-700 border-red-400" : "bg-gray-100 text-gray-700 border-gray-300"}`}
            >
              Tomorrow
            </button>
          </div>
        </div>
        {/* Search Button */}
        <button
          type="submit"
          className="w-full max-w-72 mt-10 flex items-center justify-center gap-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 text-2xl rounded-full shadow-2xl transition-all duration-200 mx-auto"
        >
          <FaCar className="text-3xl" />
          Search cab
        </button>
      </form>
    </div>
  );
}
