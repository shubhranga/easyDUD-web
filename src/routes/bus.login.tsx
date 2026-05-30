import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Bus } from "lucide-react";

export const Route = createFileRoute("/bus/login")({
  head: () => ({ meta: [{ title: "Login — BusGo" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/bus/account" }); });
  }, [navigate]);

  const submit = async () => {
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/bus", data: { name } },
      });
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Account created! Check your inbox to verify.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success("Welcome back!");
      navigate({ to: "/bus/account" });
    }
    setLoading(false);
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/bus/account" });
    if (res.error) toast.error("Google sign-in failed");
  };

  return (
    <BusGoLayout>
      <div className="mx-auto max-w-md px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-[#D84040] text-white flex items-center justify-center mb-2"><Bus className="h-6 w-6" /></div>
            <h1 className="text-2xl font-black text-gray-900">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
            <p className="text-sm text-gray-500">{mode === "login" ? "Log in to manage your bookings" : "Sign up to book in seconds"}</p>
          </div>

          <button onClick={google} className="w-full h-11 rounded-lg border border-gray-200 hover:bg-gray-50 inline-flex items-center justify-center gap-2 text-sm font-semibold mb-3">
            <GoogleIcon /> Continue with Google
          </button>
          <div className="text-xs text-gray-400 text-center my-3">— or —</div>

          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full h-11 rounded-lg border border-gray-200 px-3 mb-2 text-sm" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full h-11 rounded-lg border border-gray-200 px-3 mb-2 text-sm" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full h-11 rounded-lg border border-gray-200 px-3 mb-3 text-sm" />
          <button onClick={submit} disabled={loading || !email || !password}
            className="w-full h-11 rounded-lg bg-[#D84040] hover:bg-[#B83333] text-white font-bold disabled:bg-gray-300">
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            {mode === "login" ? "New to BusGo?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-[#D84040] font-bold">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4"><Link to="/bus">← Back to BusGo home</Link></p>
      </div>
    </BusGoLayout>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
  );
}
