// components/CookieConsent.tsx
"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!Cookies.get('cookie_consent')) {
        setShowConsent(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = async () => {
    setShowConsent(false);
    Cookies.set('cookie_consent', 'accepted', { expires: 365 });

    try {
      await fetch('/api/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: 'accepted' }),
      });
    } catch (error) {
      console.error('Błąd podczas ustawiania ciasteczka po stronie serwera:', error);
    }
  };

  const handleDecline = () => {
    setShowConsent(false);
    Cookies.set('cookie_consent', 'declined', { expires: 365 });
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: "100px", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100px", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-slate-900 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <div className="flex-grow">
                <h4 className="mb-1 text-lg font-bold text-slate-900">
                  Cenimy Twoją prywatność
                </h4>
                <p className="text-sm text-slate-600">
                  Używamy plików cookie, aby zapewnić najlepszą jakość korzystania z naszej witryny. Wybierając „Zgadzam się na wszystkie”, akceptujesz naszą{' '}
                  <Link href="/polityka-prywatnosci" className="font-medium text-slate-800 underline hover:text-black">
                    Politykę Prywatności
                  </Link>.
                </p>
              </div>

              <div className="flex w-full flex-row justify-end gap-3">
                <button
                  onClick={handleDecline}
                  className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-black/10"
                >
                  Odrzuć
                </button>
                <button
                  onClick={handleAccept}
                  // ZMIANA: Zastosowanie klas kolorów podanych przez Ciebie z subtelnym tłem
                  className="rounded-lg bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-500/20 dark:text-blue-500"
                >
                  Zgadzam się na wszystkie
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;