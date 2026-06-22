// scripts/generate-key.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// --- Configuration ---
// Load environment variables from .env.local at the project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// --- Database Model ---
// This schema must match the one in `@/models/activationKey.ts`
const ActivationKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800, // Expires in 7 days (TTL index)
    }
});

const ActivationKey = mongoose.models.ActivationKey || mongoose.model("ActivationKey", ActivationKeySchema);

// --- Main Script Logic ---
const generateActivationKey = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error("❌ Error: MONGODB_URI is not defined in your .env.local file.");
        process.exit(1); // Exit with an error code
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Database connected successfully.");

        // --- NEW: Generate a longer, more complex key ---
        const keyLength = 16; // Set the desired length of the key
        // Define a character set that excludes ambiguous characters (O, 0, I, 1, L)
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

        let key = '';
        const randomBytes = new Uint8Array(keyLength);
        crypto.getRandomValues(randomBytes); // Generate a buffer of random bytes

        for (let i = 0; i < keyLength; i++) {
            // Use the random byte to pick a character from the set
            key += chars.charAt(randomBytes[i] % chars.length);
        }

        // The key is now a 16-character string like 'X7R2P9D...''

        // Create and save the new key
        const newKey = new ActivationKey({ key });
        await newKey.save();

        console.log("\n=============================================");
        console.log("🔑 New Long & Complex Activation Key Generated: ");
        console.log(`\n   ${key}\n`);
        console.log("=============================================");
        console.log(`This ${keyLength}-character key has been saved and will expire in 7 days.`);

    } catch (error) {
        console.error("\n❌ An error occurred during key generation:");
        console.error(error);
    } finally {
        // Ensure the database connection is always closed
        await mongoose.disconnect();
        console.log("\nDatabase connection closed.");
    }
};

// Run the script
generateActivationKey();