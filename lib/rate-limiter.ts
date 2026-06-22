// PROPOZYCJA: Nowy plik @/lib/rate-limiter.ts

import { RateLimiterMemory } from 'rate-limiter-flexible';

// Ogranicz do 10 nieudanych prób logowania z jednego adresu IP na godzinę.
export const rateLimiter = new RateLimiterMemory({
    points: 10, // Liczba prób
    duration: 60 * 60, // na 1 godzinę (w sekundach)
});