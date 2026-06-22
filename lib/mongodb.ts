// lib/mongodb.ts

import mongoose from "mongoose";

/**
 * Globalny obiekt w Node.js jest używany do utrzymania zbuforowanego (cached)
 * połączenia podczas "hot reloads" w trybie deweloperskim Next.js.
 * Zapobiega to wielokrotnemu tworzeniu nowych połączeń przy każdej zmianie kodu.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// Zmieniamy nazwę eksportu na zgodną z Twoim poprzednim kodem
export const connectMongoDB = async () => {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error(
      "MONGODB_URI is not configured. EduRecovery UA MVP runs without a database; configure this only when enabling imported Uczmy.pl backend routes."
    );
  }

  // 2. Jeśli połączenie jest już aktywne w cache'u, użyj go ponownie.
  if (cached.conn) {
    // console.log("MongoDB: Używanie zbuforowanego połączenia.");
    return cached.conn;
  }

  // 3. Jeśli połączenie nie jest aktywne, ale proces łączenia już trwa (promise istnieje), poczekaj na niego.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Dobre dla środowisk serverless
    };

    console.log("MongoDB: Tworzenie nowego połączenia...");
    cached.promise = mongoose.connect(mongodbUri, opts).then((mongoose) => {
      console.log("MongoDB: Połączono pomyślnie.");
      return mongoose;
    });
  }

  // 4. Oczekiwanie na zakończenie procesu łączenia i obsługa błędów.
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Jeśli się nie udało, pozwól na ponowną próbę przy następnym wywołaniu
    console.error("MongoDB: Błąd połączenia:", e);
    throw e;
  }

  return cached.conn;
}

// Opcjonalnie, możesz wyeksportować funkcję również jako default, jeśli gdzieś jej tak używasz.
export default connectMongoDB;
