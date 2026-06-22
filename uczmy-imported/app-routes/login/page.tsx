"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to automatically detect and apply the system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res && res.error) {
        setError("Niepoprawny adres e-mail lub hasło.");
      } else {
        router.replace("dashboard");
      }
    } catch (error) {
      console.log(error);
      setError("Wystąpił nieoczekiwany błąd.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Zaloguj się
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Witamy z powrotem na uczmy.pl!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Adres email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ty@przyklad.com"
              disabled={isLoading}
              className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 disabled:bg-gray-50 dark:disabled:bg-slate-700/50"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Hasło
              </label>
              <Link href="/reset-password"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors duration-150"
              >
                Nie pamiętasz hasła?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 disabled:bg-gray-50 dark:disabled:bg-slate-700/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Ta strona jest chroniona przez reCAPTCHA.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-sm font-semibold text-white bg-gray-800 dark:bg-blue-600 rounded-lg hover:bg-gray-900 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 dark:focus:ring-blue-500 transition-colors duration-150 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Zaloguj się'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Nie masz jeszcze konta?{" "}
          <Link href="/registration" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline transition-colors duration-150">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </main>
  );
}