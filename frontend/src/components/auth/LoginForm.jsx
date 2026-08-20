// import { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function LoginForm() {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         password
//       };

//       if (identifier.includes("@")) {
//         payload.email = identifier;
//       } else {
//         payload.username = identifier;
//       }

//       const res = await api.post("/auth/login", payload);

//       const data = res.data.data;

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("role", data.role);

//       if (data.role === "SUPER_ADMIN") {
//         localStorage.setItem("user", JSON.stringify(data.admin));
//         navigate("/dashboard");
//       }

//       if (data.role === "EMPLOYEE") {
//         localStorage.setItem(
//           "user",
//           JSON.stringify(data.employee)
//         );
//         navigate("/employee/dashboard");
//       }

//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       alert("Invalid Username/Email or Password");
//     }
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (!forgotEmail.trim()) {
//       alert("Please enter your email");
//       return;
//     }

//     try {
//       setForgotLoading(true);

//       const res = await api.post("/auth/forgot-password", {
//         email: forgotEmail,
//       });

//       alert(
//         res.data.message ||
//         "If the email exists, a password reset link has been sent."
//       );

//       setForgotEmail("");
//       setShowForgotPassword(false);

//     } catch (err) {
//       console.error(
//         err.response?.data || err.message
//       );

//       alert(
//         err.response?.data?.message ||
//         "Unable to send password reset email"
//       );

//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">

//       <h1 className="text-3xl font-bold text-center">
//         CRM Login
//       </h1>

//       <p className="text-center text-gray-500 mt-2 mb-8">
//         Login as Super Admin or Employee
//       </p>

//       <form
//         onSubmit={handleLogin}
//         className="space-y-5"
//       >

//         <div>

//           <label className="block mb-2 font-medium">
//             Email / Username
//           </label>

//           <input
//             type="text"
//             placeholder="Enter email or username"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//             className="w-full h-12 border rounded-xl px-4"
//           />

//         </div>

//         <div>

//           <label className="block mb-2 font-medium">
//             Password
//           </label>

//           <div className="relative">

//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full h-12 border rounded-xl px-4 pr-12"
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-4 top-3"
//             >
//               {showPassword
//                 ? <EyeOff size={20} />
//                 : <Eye size={20} />
//               }
//             </button>

//           </div>

//         </div>

//         <button
//           type="submit"
//           className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition"
//         >
//           Sign In
//         </button>

//         <div className="text-center">
//           <button
//             type="button"
//             onClick={() => navigate("/forgot-password")}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot Password?
//           </button>
//         </div>

//       </form>

//     </div>
//   );
// }

import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      email: identifier.trim().toLowerCase(),
      password,
    };

    console.log("Sending login request:", payload);

    const res = await api.post("/auth/login", payload);

    console.log("Login response:", res.data);

    const data = res.data.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "SUPER_ADMIN") {
      localStorage.setItem(
        "user",
        JSON.stringify(data.admin)
      );

      navigate("/dashboard");
    }

    if (data.role === "EMPLOYEE") {
      localStorage.setItem(
        "user",
        JSON.stringify(data.employee)
      );

      navigate("/employee/dashboard");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    console.error("Backend response:", err.response?.data);

    alert(
      err.response?.data?.message ||
      "Unable to login"
    );
  }
};

  // =========================
  // FORGOT PASSWORD
  // =========================

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setForgotLoading(true);

      const res = await api.post(
        "/auth/forgot-password",
        {
          email: forgotEmail.trim(),
        }
      );

      alert(
        res.data.message ||
        "If the email exists, a password reset link has been sent."
      );

      setForgotEmail("");
      setShowForgotPassword(false);

    } catch (err) {
      console.error(
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
        "Unable to send password reset email"
      );

    } finally {
      setForgotLoading(false);
    }
  };

  // =========================
  // FORGOT PASSWORD SCREEN
  // =========================

  if (showForgotPassword) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">

        <button
          type="button"
          onClick={() => {
            setShowForgotPassword(false);
            setForgotEmail("");
          }}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>

        <h1 className="text-3xl font-bold text-center">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Enter your email address and we will send you
          a password reset link.
        </p>

        <form
          onSubmit={handleForgotPassword}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) =>
                setForgotEmail(e.target.value)
              }
              className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotLoading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

        </form>

      </div>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">

      <h1 className="text-3xl font-bold text-center">
        CRM Login
      </h1>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Login as Super Admin or Employee
      </p>

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* EMAIL / USERNAME */}

        <div>

          <label className="block mb-2 font-medium">
            Email / Username
          </label>

          <input
            type="text"
            placeholder="Enter email or username"
            value={identifier}
            onChange={(e) =>
              setIdentifier(e.target.value)
            }
            className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

        </div>

        {/* PASSWORD */}

        <div>

          <label className="block mb-2 font-medium">
            Password
          </label>

          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-3 text-gray-600 hover:text-black"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* FORGOT PASSWORD */}

        <div className="text-right">

          <button
            type="button"
            onClick={() =>
              setShowForgotPassword(true)
            }
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* LOGIN BUTTON */}

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition"
        >
          Sign In
        </button>

      </form>

    </div>
  );
}