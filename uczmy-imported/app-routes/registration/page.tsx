"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileTypeSelector from "@/components/auth/ProfileTypeSelector";
import RegistrationForm from "@/components/auth/RegistrationForm";

export default function RegisterPage() {
    const router = useRouter();

    // Efekt do automatycznego wykrywania i stosowania motywu systemowego
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

    // --- STEP 1: Add state for the activation key ---
    const [profileType, setProfileType] = useState<number | null>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [activationKey, setActivationKey] = useState(""); // New state for the key
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- STEP 2: Update the signup handler ---
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setError(null);

        // --- All validation remains here, with the new key validation added ---
        if (profileType === null) {
            setError("Błąd: typ profilu nie został wybrany.");
            return;
        }
        // Add the new validation check
        if (!activationKey) {
            setError("Klucz aktywacyjny jest wymagany.");
            return;
        }
        if (!fullName || !email || !password || !confirmPassword) {
            setError("Wszystkie pola są wymagane.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne.");
            return;
        }
        if (!agreedToTerms) {
            setError("Musisz zaakceptować regulamin i politykę prywatności.");
            return;
        }
        if (password.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków.");
            return;
        }

        setIsLoading(true);
        try {
            // The /api/userExists check is now removed as it's handled by /api/register
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Update the body to include all necessary fields
                body: JSON.stringify({
                    name: fullName,
                    email,
                    password,
                    profileType,
                    activationKey // Send the key to the API
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
                router.push("/login");
            } else {
                // Display the specific error message from the backend
                setError(data.message || "Wystąpił błąd podczas rejestracji.");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            setError("Wystąpił błąd sieci lub serwera. Spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
            <div className={`w-full bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl transition-all duration-300 ${profileType === null ? 'max-w-5xl' : 'max-w-md'}`}>
                {profileType === null ? (
                    <ProfileTypeSelector onSelectProfileType={setProfileType} />
                ) : (
                    // --- STEP 3: Pass the new props to the RegistrationForm ---
                    <RegistrationForm
                        onSubmit={handleEmailSignUp}
                        onBack={() => setProfileType(null)}
                        fullName={fullName} setFullName={setFullName}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                        activationKey={activationKey} setActivationKey={setActivationKey} // Pass new props
                        agreedToTerms={agreedToTerms} setAgreedToTerms={setAgreedToTerms}
                        isLoading={isLoading}
                        error={error}
                    />
                )}
            </div>
        </main>
    );
}