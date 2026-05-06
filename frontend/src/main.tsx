import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import Agents from "./routes/Agents";
import App from "./App";
import BulkImport from "./routes/BulkImport";
import CaseDetail from "./routes/CaseDetail";
import Cases from "./routes/Cases";
import Cohorts from "./routes/Cohorts";
import Compare from "./routes/Compare";
import Compliance from "./routes/Compliance";
import Dashboard from "./routes/Dashboard";
import Eval from "./routes/Eval";
import Login from "./routes/Login";
import Policies from "./routes/Policies";
import PolicyDiff from "./routes/PolicyDiff";
import Architecture from "./routes/Architecture";
import Industrialize from "./routes/Industrialize";
import Reviewer from "./routes/Reviewer";
import ROI from "./routes/ROI";
import Settings from "./routes/Settings";
import Signup from "./routes/Signup";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth pages */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected app shell */}
          <Route
            element={
              <RequireAuth>
                <App />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:caseId" element={<CaseDetail />} />
            <Route path="/cases/:caseId/compare" element={<Compare />} />
            <Route path="/cases/bulk-import" element={<BulkImport />} />

            <Route path="/policies" element={<Policies />} />
            <Route path="/policies/:policyId/diff" element={<PolicyDiff />} />
            <Route path="/agents" element={<Agents />} />

            <Route path="/cohorts" element={<Cohorts />} />
            <Route
              path="/reviewer"
              element={
                <RequireAuth roles={["reviewer", "admin"]}>
                  <Reviewer />
                </RequireAuth>
              }
            />
            <Route path="/compliance"     element={<Compliance />} />
            <Route path="/roi"            element={<ROI />} />
            <Route path="/industrialize"  element={<Industrialize />} />
            <Route path="/architecture"   element={<Architecture />} />
            <Route path="/eval"           element={<Eval />} />
            <Route
              path="/settings"
              element={
                <RequireAuth roles={["admin"]}>
                  <Settings />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
