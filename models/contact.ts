import mongoose, { Schema, models } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Imię i nazwisko są wymagane."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Adres e-mail jest wymagany."],
      trim: true,
      // Prosta walidacja formatu e-mail
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Proszę podać prawidłowy adres e-mail.'],
    },
    message: {
      type: String,
      required: [true, "Wiadomość jest wymagana."],
    },
  },
  { timestamps: true } // Automatycznie dodaje pola createdAt i updatedAt
);

// Sprawdza, czy model już istnieje, aby uniknąć błędów przy ponownym kompilowaniu w trybie deweloperskim
const ContactMessage = models.ContactMessage || mongoose.model("ContactMessage", contactSchema);

export default ContactMessage;