import mongoose, { Schema, Document } from "mongoose";
import { ISobremesa } from "@common/Sobremesa";

const SobremesaSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date_time: { type: Date, required: true },
    max_participants: { type: Number, required: true },
    convocante_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["proposed", "confirmed", "completed", "cancelled"],
      default: "proposed",
    },
    meeting_link: { type: String, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Sobremesa = mongoose.model<ISobremesa & Document>(
  "Sobremesa",
  SobremesaSchema,
  "sobremesas", // Nombre explícito de la colección
);
