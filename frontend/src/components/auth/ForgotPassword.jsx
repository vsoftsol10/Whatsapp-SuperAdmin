import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        response.data.message ||
          "If the email exists, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process password reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-5">

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your registered email address and we'll send you a password reset link.
        </p>

        {message && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>

      </div>

    </div>
  );
}