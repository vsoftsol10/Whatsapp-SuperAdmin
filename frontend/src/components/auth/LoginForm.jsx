

// import { useState } from "react";
// import { Eye, EyeOff, ArrowLeft } from "lucide-react";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";
// import PageLoader from "../common/PageLoader";

// export default function LoginForm() {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginLoading, setLoginLoading] = useState(false);

//   // Forgot password
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);

//   // =========================
//   // LOGIN
//   // =========================

//  const handleLogin = async (e) => {
//   e.preventDefault();

//   if (loginLoading) return;

//   try {
//     setLoginLoading(true);

//     const payload = {
//       email: identifier.trim().toLowerCase(),
//       password,
//     };

//     console.log("Sending login request:", payload);

//     const res = await api.post("/auth/login", payload);

//     console.log("Login response:", res.data);

//     const data = res.data.data;

//     localStorage.setItem("token", data.token);
//     localStorage.setItem("role", data.role);

//     if (data.role === "SUPER_ADMIN") {
//       localStorage.setItem(
//         "user",
//         JSON.stringify(data.admin)
//       );

//       navigate("/dashboard");
//     }

//     if (data.role === "EMPLOYEE") {
//       localStorage.setItem(
//         "user",
//         JSON.stringify(data.employee)
//       );

//       navigate("/employee/dashboard");
//     }

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     console.error("Backend response:", err.response?.data);

//     alert(
//       err.response?.data?.message ||
//       "Unable to login"
//     );
//   } finally {
//     setLoginLoading(false);
//   }
// };

//   // =========================
//   // FORGOT PASSWORD
//   // =========================

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (!forgotEmail.trim()) {
//       alert("Please enter your email");
//       return;
//     }

//     try {
//       setForgotLoading(true);

//       const res = await api.post(
//         "/auth/forgot-password",
//         {
//           email: forgotEmail.trim(),
//         }
//       );

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

//   // =========================
//   // FORGOT PASSWORD SCREEN
//   // =========================

//   if (showForgotPassword) {
//     return (
//       <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md">

//         <button
//           type="button"
//           onClick={() => {
//             setShowForgotPassword(false);
//             setForgotEmail("");
//           }}
//           className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
//         >
//           <ArrowLeft size={18} />
//           Back to Login
//         </button>

//         <h1 className="text-3xl font-bold text-center">
//           Forgot Password?
//         </h1>

//         <p className="text-center text-gray-500 mt-2 mb-8">
//           Enter your email address and we will send you
//           a password reset link.
//         </p>

//         <form
//           onSubmit={handleForgotPassword}
//           className="space-y-5"
//         >

//           <div>
//             <label className="block mb-2 font-medium">
//               Email Address
//             </label>

//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={forgotEmail}
//               onChange={(e) =>
//                 setForgotEmail(e.target.value)
//               }
//               className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={forgotLoading}
//             className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {forgotLoading
//               ? "Sending..."
//               : "Send Reset Link"}
//           </button>

//         </form>

//       </div>
//     );
//   }

//   // =========================
//   // LOGIN SCREEN
//   // =========================

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

//         {/* EMAIL / USERNAME */}

//         <div>

//           <label className="block mb-2 font-medium">
//             Email / Username
//           </label>

//           <input
//             type="text"
//             placeholder="Enter email or username"
//             value={identifier}
//             onChange={(e) =>
//               setIdentifier(e.target.value)
//             }
//             className="w-full h-12 border border-gray-300 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-black"
//           />

//         </div>

//         {/* PASSWORD */}

//         <div>

//           <label className="block mb-2 font-medium">
//             Password
//           </label>

//           <div className="relative">

//             <input
//               type={
//                 showPassword
//                   ? "text"
//                   : "password"
//               }
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               className="w-full h-12 border border-gray-300 rounded-xl px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-black"
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowPassword(!showPassword)
//               }
//               className="absolute right-4 top-3 text-gray-600 hover:text-black"
//             >
//               {showPassword ? (
//                 <EyeOff size={20} />
//               ) : (
//                 <Eye size={20} />
//               )}
//             </button>

//           </div>

//         </div>

//         {/* FORGOT PASSWORD */}

//         <div className="text-right">

//           <button
//             type="button"
//             onClick={() =>
//               setShowForgotPassword(true)
//             }
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot Password?
//           </button>

//         </div>

//         {/* LOGIN BUTTON */}

//         <button
//           type="submit"
//           disabled={loginLoading}
//           className="w-full h-12 rounded-xl bg-black text-white hover:bg-yellow-400 hover:text-black transition disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           {loginLoading ? (
//             <PageLoader
//               variant="inline"
//               label="Signing in..."
//               spinnerClassName="border-white/30 border-t-white"
//               textClassName="text-white"
//             />
//           ) : "Sign In"}
//         </button>

//       </form>

//     </div>
//   );
// }


import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PageLoader from "../common/PageLoader";

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginLoading) return;

    try {
      setLoginLoading(true);

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
    } finally {
      setLoginLoading(false);
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
  // LEFT SIDE
  // =========================

  const Branding = () => (
    <div className="hidden lg:flex w-1/2 h-screen bg-[#f8faef] relative overflow-hidden">

      {/* Yellow decorative circle */}
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#ffd43b]/30" />

      {/* Green decorative circle */}
      <div className="absolute -top-32 -right-32 w-[300px] h-[300px] rounded-full bg-[#25D366]/10" />

      <div className="relative z-10 w-full h-full flex flex-col justify-between px-16 xl:px-24 py-14">

        {/* Logo */}
        <div className="flex items-center gap-3">

          {/* <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              V
            </span>
          </div> */}

          <div>
            <h2 className="text-2xl font-bold text-[#1c1c1c]">
              Vatup
              <span className="text-[#25D366]">
                CRM
              </span>
            </h2>

            {/* <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500">
              WhatsApp CRM
            </p> */}
          </div>

        </div>

        {/* Center content */}
        <div className="max-w-[540px]">

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#25D366] mb-5">
            Welcome Back
          </p>

          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-[#1c1c1c]">
            Manage your
            <br />

            <span className="text-[#25D366]">
              business better.
            </span>
          </h1>

          <div className="w-12 h-1 mt-7 rounded-full bg-[#ffd43b]" />

          <p className="mt-7 text-base xl:text-lg leading-8 text-gray-600 max-w-[460px]">
            Manage customers, conversations and
            business activities from one simple CRM
            workspace.
          </p>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 text-xs text-gray-500">

          <span className="w-2 h-2 rounded-full bg-[#25D366]" />

          Secure CRM Workspace

        </div>

      </div>
    </div>
  );

  // =========================
  // FORGOT PASSWORD
  // =========================

  if (showForgotPassword) {
    return (
      <div className="w-screen h-screen bg-white flex overflow-hidden">

        {/* LEFT */}
        <Branding />

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 h-screen flex items-center justify-center px-8 sm:px-12 lg:px-20 xl:px-28">

          <div className="w-full max-w-[500px]">

            {/* Mobile logo */}
            <div className="lg:hidden mb-12">

              <h2 className="text-2xl font-bold text-gray-900">
                Vatup
                <span className="text-[#25D366]">
                  CRM
                </span>
              </h2>

            </div>

            {/* Back */}
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotEmail("");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#25D366] transition mb-10"
            >
              <ArrowLeft size={17} />

              Back to Login
            </button>

            {/* Heading */}
            <div className="mb-9">

              <p className="text-sm font-semibold text-[#25D366] mb-3">
                Account Recovery
              </p>

              <h1 className="text-4xl xl:text-5xl font-bold text-[#1c1c1c] tracking-tight">
                Forgot Password?
              </h1>

              <p className="mt-4 text-gray-500 text-[15px] leading-6 max-w-[440px]">
                Enter your email address and we will
                send you a password reset link.
              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleForgotPassword}
              className="space-y-6"
            >

              <div>

                <label className="block mb-2 text-sm font-semibold text-gray-800">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) =>
                      setForgotEmail(e.target.value)
                    }
                    className="w-full h-13 rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10"
                  />

                </div>

              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full h-13 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20bd5b] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotLoading
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>

            </form>

          </div>

        </div>

      </div>
    );
  }

  // =========================
  // LOGIN SCREEN
  // =========================

  return (
    <div className="w-screen h-screen bg-white flex overflow-hidden">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <Branding />

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="w-full lg:w-1/2 h-screen flex items-center justify-center px-8 sm:px-12 lg:px-20 xl:px-28">

        <div className="w-full max-w-[500px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-12">

            <h2 className="text-2xl font-bold text-gray-900">
              Vatup
              <span className="text-[#25D366]">
                CRM
              </span>
            </h2>

          </div>

          {/* Heading */}
          <div className="mb-9">

            <p className="text-sm font-semibold text-[#25D366] mb-3">
              Welcome Back
            </p>

            <h1 className="text-4xl xl:text-5xl font-bold text-[#1c1c1c] tracking-tight">
              Sign in to your
              <br />

              <span className="text-[#25D366]">
                account.
              </span>
            </h1>

            <p className="mt-4 text-gray-500 text-[15px]">
              Enter your details to continue.
            </p>

          </div>

          {/* =========================
              LOGIN FORM
          ========================= */}

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* EMAIL */}
            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Email / Username
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(e.target.value)
                  }
                  className="w-full h-13 rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full h-13 rounded-lg border border-gray-300 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#25D366] transition"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end -mt-2">

              <button
                type="button"
                onClick={() =>
                  setShowForgotPassword(true)
                }
                className="text-sm font-medium text-[#c79600] hover:text-[#25D366] transition"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-13 rounded-lg bg-[#25D366] text-white font-semibold hover:bg-[#20bd5b] transition disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loginLoading ? (
                <PageLoader
                  variant="inline"
                  label="Signing in..."
                  spinnerClassName="border-white/30 border-t-white"
                  textClassName="text-white"
                />
              ) : (
                "Sign In"
              )}

            </button>

          </form>

          {/* Bottom */}
          <div className="mt-10 pt-6 border-t border-gray-100 text-center">

            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Vatup CRM
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}