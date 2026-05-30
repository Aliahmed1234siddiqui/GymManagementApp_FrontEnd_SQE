import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/common/UI";
import { PageLoader } from "./components/common/UI";
import "./index.css";
import "./components/common/styles.css";

import LoginPage from "./pages/other/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import MembersPage from "./pages/admin/MembersPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import PlansPage from "./pages/admin/PlansPage";
import ReportsPage from "./pages/admin/ReportsPage";
import MemberDashboard from "./pages/member/MemberDashboard";
import MyCardPage from "./pages/member/MyCardPage";
import {
  MemberPaymentsPage,
  NotificationsPage,
} from "./pages/member/MemberOtherPages";
import SettingsPage from "./pages/member/SettingsPage";
import TermsPage from "./pages/other/term-and-condition";
import PrivacyPage from "./pages/other/pravicy";
import ProfilePage from "./pages/admin/ProfilePage";

function RequireAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/member" replace />;
  return children;
}

function RequireMember({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/member"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPage />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/members"
              element={
                <RequireAdmin>
                  <MembersPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <RequireAdmin>
                  <PaymentsPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <RequireAdmin>
                  <PlansPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <RequireAdmin>
                  <ReportsPage />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <RequireAdmin>
                  <ProfilePage />
                </RequireAdmin>
              }
            />
            {/* Member routes */}
            <Route
              path="/member"
              element={
                <RequireMember>
                  <MemberDashboard />
                </RequireMember>
              }
            />
            <Route
              path="/member/card"
              element={
                <RequireMember>
                  <MyCardPage />
                </RequireMember>
              }
            />
            <Route
              path="/member/payments"
              element={
                <RequireMember>
                  <MemberPaymentsPage />
                </RequireMember>
              }
            />
            <Route
              path="/member/notifications"
              element={
                <RequireMember>
                  <NotificationsPage />
                </RequireMember>
              }
            />
            <Route
              path="/member/settings"
              element={
                <RequireMember>
                  <SettingsPage />
                </RequireMember>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
