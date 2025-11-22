import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "@common/User";

const UserSchema: Schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed password (optional for Google auth)
  name: { type: String, required: true },
  context: { type: String, required: true }, // carrera/facultad/ciudad/ocupación
  bio: { type: String, required: false },
  photo: { type: String, required: false }, // URL
  googleId: { type: String }, // Used for Google authentication
});

export const User = mongoose.model<IUser & Document>("User", UserSchema);
