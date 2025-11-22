import mongoose, { Schema, Document } from "mongoose";
import { IParticipacion } from "@common/Participacion";

const ParticipacionSchema: Schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    sobremesa_id: {
      type: Schema.Types.ObjectId,
      ref: "Sobremesa",
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["convocante", "participant"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

export const Participacion = mongoose.model<IParticipacion & Document>(
  "Participacion",
  ParticipacionSchema,
  "participaciones", // Nombre explícito de la colección
);
