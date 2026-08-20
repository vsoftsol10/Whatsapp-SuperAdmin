// import { useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setMessage("");
//     setError("");

//     if (!newPassword || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     if (!token) {
//       setError("Invalid password reset link");
//       return;
//     }

//     try {
//       setLoading(true);

//       const response = await axios.post(
//         "http://localhost:5001/api/auth/reset-password",
//         {
//           token,
//           newPassword,
//           confirmPassword,
//         }
//       );

//       setMessage(
//         response.data.message || "Password reset successfully"
//       );

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Unable to reset password"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

//         <h2 className="text-2xl font-bold text-gray-900 text-center">
//           Reset Password
//         </h2>

//         <p className="text-gray-500 text-sm text-center mt-2">
//           Enter your new password below.
//         </p>

//         {error && (
//           <div className="mt-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="mt-4 p-3 rounded-md bg-green-50 text-green-600 text-sm">
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="mt-6 space-y-4">

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>

//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Enter new password"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>

//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) =>
//                 setConfirmPassword(e.target.value)
//               }
//               placeholder="Confirm new password"
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!token) {
      setError("Invalid password reset link");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5001/api/auth/reset-password",
        {
          token,
          newPassword,
          confirmPassword,
        }
      );

      setMessage(
        response.data.message || "Password reset successfully"
      );

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Reset Password
        </h2>

        <p className="text-gray-500 text-sm text-center mt-2">
          Enter your new password below.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-md bg-green-50 text-green-600 text-sm">
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* NEW PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <div className="relative">

              <input
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword(!showNewPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showNewPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-11 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

          </div>

          {/* RESET BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>
  );
}