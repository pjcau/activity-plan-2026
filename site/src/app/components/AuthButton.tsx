"use client";

import { useAuth } from "@/lib/AuthContext";

export default function AuthButton() {
  const { user, loading, supabase } = useAuth();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="h-8 w-20 bg-emerald-600 rounded animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-emerald-100 hidden sm:inline">
          {user.user_metadata?.full_name || user.email}
        </span>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="px-3 py-1.5 text-sm bg-white text-emerald-700 hover:bg-emerald-50 rounded-md font-medium transition-colors"
    >
      Login con Google
    </button>
  );
}
