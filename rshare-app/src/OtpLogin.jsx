import { useState, useEffect } from "react";
import { auth, provider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup } from "./firebase";

export default function OtpLogin({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [confirmation, setConfirmation] = useState(null);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
      setResendTimer(60);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  // reCAPTCHA setup
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => console.log("reCAPTCHA solved"),
        "expired-callback": () => setError("reCAPTCHA expired, try again"),
      });
    }
  };

  // Send OTP
  const sendOtp = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter exactly 10 digits for mobile number.");
      return;
    }
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    setLoading(true);
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, countryCode + phone, appVerifier);
      setConfirmation(confirmationResult);
      setOtpSent(true);
      setResendDisabled(true);
      console.log("OTP sent to " + countryCode + phone);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    setError("");
    if (!otp || otp.length < 6) {
      setError("Please enter a valid OTP.");
      return;
    }
    try {
      await confirmation.confirm(otp);
      onLogin(countryCode + " " + phone);
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    }
  };

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin(user.displayName || user.phoneNumber || user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setOtpSent(false);
    setOtp("");
    setError("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-purple-400 p-6">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-12 relative flex flex-col" style={{ animation: "fadeInScale 0.3s ease forwards" }}>
        <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&#10005;</button>
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-1">Login</h2>
        <p className="text-center font-semibold text-lg text-gray-800 mb-8">Enter your mobile number</p>

        {!otpSent ? (
          <>
            <div className="flex mb-6 gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400"
              >
                <option value="+91">+91 (IND)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
              </select>
              <input
                type="tel"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <div id="recaptcha-container"></div>

            <button
              onClick={sendOtp}
              disabled={loading || phone.length !== 10}
              className={`w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md ${loading || phone.length !== 10 ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
            >
              {loading ? "Sending..." : "Generate OTP"}
            </button>

            <div className="flex items-center text-gray-400 text-sm my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <img src="/google.jpeg" alt="Google logo" className="h-6 w-6" /> Sign in with Google
            </button>
          </>
        ) : (
          <>
            <div className="mb-6 text-center text-gray-800 text-lg">
              Enter OTP sent to <span className="font-semibold">{countryCode} {phone}</span>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-400 mb-6"
              autoFocus
            />
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <button onClick={verifyOtp} className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-md">Login</button>

            <button
              disabled={resendDisabled}
              onClick={sendOtp}
              className={`mt-6 w-full underline text-purple-600 hover:text-purple-700 ${resendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Resend OTP {resendDisabled && `(${resendTimer}s)`}
            </button>
          </>
        )}

        <style>{`
          @keyframes fadeInScale {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
