import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL || "";
const ADMIN_TOKEN_KEY = "adminToken";

function AdminLogin() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");

    useEffect(() => {
        if (sessionStorage.getItem(ADMIN_TOKEN_KEY)) navigate("/admin", { replace: true });
    }, [navigate]);

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!login.trim() || !password) {
            setError("Veuillez remplir le login et le mot de passe.");
            return;
        }
        if (!API_BASE) {
            setError("REACT_APP_API_URL non configuré.");
            return;
        }
        setLoading(true);
        fetch(`${API_BASE}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: login.trim(), password }),
        })
            .then((r) => {
                if (r.status === 401) return r.json().then((d) => { throw new Error(d.error || "Identifiants incorrects."); });
                if (r.status === 500) return r.json().then((d) => { throw new Error(d.error || "Erreur serveur."); });
                if (!r.ok) throw new Error("Erreur de connexion.");
                return r.json();
            })
            .then((data) => {
                if (data.token) {
                    sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
                    navigate("/admin", { replace: true });
                } else {
                    throw new Error("Réponse invalide.");
                }
            })
            .catch((err) => setError(err.message || "Connexion impossible."))
            .finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center px-4 font-sans bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900">
            <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)" }} />
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Administration
                    </h1>
                    <p className="text-gray-400 mt-2">Connectez-vous pour accéder au back-office</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Login</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Votre identifiant"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mot de passe"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition font-medium"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <LogIn size={20} />
                                Se connecter
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
export { ADMIN_TOKEN_KEY };
