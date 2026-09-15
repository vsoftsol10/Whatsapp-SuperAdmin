

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import TestimonialsPage from "./pages/Testimonials";
// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import CompaniesPage from "./pages/CompaniesPage";
// import SubscriptionsPage from "./pages/SubscriptionsPage";
// import SubscriptionPlansPage from "./pages/SubscriptionPlansPage";
// import EmployeesPage from "./pages/EmployeesPage";
// import SupportTicketsPage from "./pages/SupportTicketsPage";
// import ProfilePage from "./pages/ProfilePage";
// import AdminLayout from "./components/layout/AdminLayout";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import PaymentsPage from "./pages/PaymentsPage";
// import UpgradeRequests from "./pages/UpgradeRequests";
// import ResetPassword from "./components/auth/ResetPassword";
// import AuditLogsPage from "./pages/AuditLogsPage";

// export default function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* Login */}
//         <Route
//           path="/"
//           element={<LoginPage />}
//         />

//         {/* Password Reset */}
//         <Route
//           path="/reset-password"
//           element={<ResetPassword />}
//         />

//         {/* Admin Layout */}
//         <Route element={<AdminLayout />}>

//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <DashboardPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/companies"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <CompaniesPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/subscriptions"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <SubscriptionsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/subscription-plans"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <SubscriptionPlansPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/testimonials"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <TestimonialsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/payments"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <PaymentsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/employees"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN"]}
//               >
//                 <EmployeesPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/tickets"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <SupportTicketsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/upgrade-requests"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
//               >
//                 <UpgradeRequests />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/audit-logs"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["SUPER_ADMIN"]}
//               >
//                 <AuditLogsPage />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/profile" element={<ProfilePage />} />

//         </Route>

//         {/* Default Route */}
//         <Route
//           path="*"
//           element={<Navigate to="/dashboard" replace />}
//         />

//       </Routes>

//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TestimonialsPage from "./pages/Testimonials";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CompaniesPage from "./pages/CompaniesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import SubscriptionPlansPage from "./pages/SubscriptionPlansPage";
import EmployeesPage from "./pages/EmployeesPage";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import ProfilePage from "./pages/ProfilePage";
import PaymentsPage from "./pages/PaymentsPage";
import UpgradeRequests from "./pages/UpgradeRequests";
import ResetPassword from "./components/auth/ResetPassword";
import AuditLogsPage from "./pages/AuditLogsPage";
import BackupsPage from "./pages/Backups";

import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            LOGIN
        ========================================== */}

        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* ==========================================
            PASSWORD RESET
        ========================================== */}

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* ==========================================
            ADMIN LAYOUT
        ========================================== */}

        <Route element={<AdminLayout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Companies */}
          <Route
            path="/companies"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <CompaniesPage />
              </ProtectedRoute>
            }
          />

          {/* Subscriptions */}
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <SubscriptionsPage />
              </ProtectedRoute>
            }
          />

          {/* Subscription Plans */}
          <Route
            path="/subscription-plans"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <SubscriptionPlansPage />
              </ProtectedRoute>
            }
          />

          {/* Testimonials */}
          <Route
            path="/testimonials"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <TestimonialsPage />
              </ProtectedRoute>
            }
          />

          {/* Payments */}
          <Route
            path="/payments"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <PaymentsPage />
              </ProtectedRoute>
            }
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN"]}
              >
                <EmployeesPage />
              </ProtectedRoute>
            }
          />

          {/* Support Tickets */}
          <Route
            path="/tickets"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <SupportTicketsPage />
              </ProtectedRoute>
            }
          />

          {/* Upgrade Requests */}
          <Route
            path="/upgrade-requests"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN", "EMPLOYEE"]}
              >
                <UpgradeRequests />
              </ProtectedRoute>
            }
          />

          {/* Audit Logs */}
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN"]}
              >
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />

          {/* Backups */}
          <Route
            path="/backups"
            element={
              <ProtectedRoute
                allowedRoles={["SUPER_ADMIN"]}
              >
                <BackupsPage />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<ProfilePage />}
          />

        </Route>

        {/* ==========================================
            DEFAULT ROUTE
        ========================================== */}

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}