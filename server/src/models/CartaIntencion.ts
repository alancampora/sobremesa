import mongoose, { Schema, Document } from "mongoose";
import { ICartaIntencion } from "@common/CartaIntencion";

const CartaIntencionSchema: Schema = new Schema(
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
    text: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

export const CartaIntencion = mongoose.model<ICartaIntencion & Document>(
  "CartaIntencion",
  CartaIntencionSchema,
  "cartas_intencion", // Nombre explícito de la colección
);
