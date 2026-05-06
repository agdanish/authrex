/**
 * /login — email + password sign-in. Includes a "Use demo credentials" button
 * that pre-fills + submits with the seeded admin account, so judges can demo
 * without typing.
 */
import { Activity, Loader2, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthContext";

const DEMO_ACCOUNTS = [
  { email: "admin@aerofyta.health",        password: "authrex2026", role: "Admin", desc: "full access" },
  { email: "reviewer@aerofyta.health",     password: "authrex2026", role: "Reviewer", desc: "REFER queue" },
  { email: "coordinator@aerofyta.health",  password: "authrex2026", role: "Coordinator", desc: "create cases" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [email, setEmail] = useState("admin@aerofyta.health");
  const [password, setPassword] = useState("authrex2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent | null, opts?: { email: string; password: string }) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(opts?.email ?? email, opts?.password ?? password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function loginAs(account: { email: string; password: string }) {
    setEmail(account.email);
    setPassword(account.password);
    await handleSubmit(null, account);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-brand text-ink-invert flex items-center justify-center shadow-md">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-semibold text-xl text-ink-primary">Authrex</div>
            <div className="text-[11px] text-ink-muted font-mono">
              Prior Authorisation Copilot
            </div>
          </div>
        </Link>

        <div className="bg-surface-raised border border-surface-border rounded-2xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-ink-primary mb-1">
            Sign in to your workspace
          </h1>
          <p className="text-sm text-ink-muted mb-5">
            Enter your credentials, or use a demo account below.
          </p>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-bg text-sm text-ink-primary placeholder:text-ink-faint focus:border-accent-brand focus:outline-none"
                placeholder="you@org.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-ink-muted block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2 rounded-lg border border-surface-border bg-surface-bg text-sm text-ink-primary placeholder:text-ink-faint focus:border-accent-brand focus:outline-none"
                placeholder="********"
              />
            </div>

            {error && (
              <div className="text-xs text-accent-red bg-accent-red/10 border border-accent-red/30 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-brand text-ink-invert text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <LogIn size={14} />}
              Sign in
            </button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest text-ink-faint">
            <span className="flex-1 h-px bg-surface-border" />
            Demo accounts
            <span className="flex-1 h-px bg-surface-border" />
          </div>

          <div className="space-y-1.5">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => loginAs(a)}
                disabled={loading}
                className="w-full text-left px-3 py-2 rounded-lg border border-surface-border bg-surface-bg hover:bg-surface-raised-hi hover:border-accent-brand/40 transition-all flex items-center justify-between gap-3 disabled:opacity-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono text-ink-primary truncate">
                    {a.email}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                    {a.role} · {a.desc}
                  </div>
                </div>
                <Sparkles size={12} className="text-accent-brand shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border text-center text-xs text-ink-muted">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent-brand hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] font-mono text-ink-faint leading-relaxed">
          7-agent LangGraph DAG · AWS Bedrock · MCP-compatible
          <br />
          CMS-0057-F § IV.B (7-day SLA) · § IV.A (PA API · Jan 2027) · 89 FR 8758
        </div>
      </div>
    </div>
  );
}
