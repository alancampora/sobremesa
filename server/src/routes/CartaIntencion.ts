import express from "express";
import { Request, Response } from "express";
import { CartaIntencion } from "../models/CartaIntencion";
import { Sobremesa } from "../models/Sobremesa";
import { Participacion } from "../models/Participacion";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Submit carta de intención (requires auth)
router.post("/", authenticateToken, async (req: any, res: Response): Promise<void> => {
  const { sobremesa_id, text } = req.body;
  const user_id = req.user.id;

  if (!sobremesa_id || !text) {
    res.status(400).json({ message: "Sobremesa ID and text are required" });
    return;
  }

  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 50 || wordCount > 500) {
    res.status(400).json({ message: "Text should be between 50 and 500 words" });
    return;
  }

  try {
    const sobremesa = await Sobremesa.findById(sobremesa_id);
    if (!sobremesa) {
      res.status(404).json({ message: "Sobremesa not found" });
      return;
    }

    if (sobremesa.status !== "proposed") {
      res.status(400).json({ message: "Cannot apply to this sobremesa anymore" });
      return;
    }

    if (sobremesa.convocante_id.toString() === user_id) {
      res.status(400).json({ message: "Convocante cannot submit a carta" });
      return;
    }

    const existingCarta = await CartaIntencion.findOne({ sobremesa_id, user_id });
    if (existingCarta) {
      res.status(400).json({ message: "You already submitted a carta for this sobremesa" });
      return;
    }

    const newCarta = new CartaIntencion({
      sobremesa_id,
      user_id,
      text,
      status: "pending",
    });

    await newCarta.save();

    res.status(201).json(newCarta);
  } catch (error: any) {
    res.status(500).json({ message: "Error submitting carta", error: error.message });
  }
});

// Get all cartas for a sobremesa (convocante only)
router.get("/sobremesa/:sobremesa_id", authenticateToken, async (req: any, res: Response): Promise<void> => {
  const sobremesa_id = req.params.sobremesa_id;
  const user_id = req.user.id;

  try {
    const sobremesa = await Sobremesa.findById(sobremesa_id);
    if (!sobremesa) {
      res.status(404).json({ message: "Sobremesa not found" });
      return;
    }

    if (sobremesa.convocante_id.toString() !== user_id) {
      res.status(403).json({ message: "Only convocante can view cartas" });
      return;
    }

    const cartas = await CartaIntencion.find({ sobremesa_id }).populate(
      "user_id",
      "name context bio photo"
    );

    res.json(cartas);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching cartas", error: error.message });
  }
});

// Accept/reject carta (convocante only)
router.patch("/:id/status", authenticateToken, async (req: any, res: Response): Promise<void> => {
  const { status } = req.body;
  const user_id = req.user.id;

  if (!["accepted", "rejected"].includes(status)) {
    res.status(400).json({ message: "Invalid status" });
    return;
  }

  try {
    const carta = await CartaIntencion.findById(req.params.id);
    if (!carta) {
      res.status(404).json({ message: "Carta not found" });
      return;
    }

    const sobremesa = await Sobremesa.findById(carta.sobremesa_id);
    if (!sobremesa) {
      res.status(404).json({ message: "Sobremesa not found" });
      return;
    }

    if (sobremesa.convocante_id.toString() !== user_id) {
      res.status(403).json({ message: "Only convocante can accept/reject cartas" });
      return;
    }

    carta.status = status;
    await carta.save();

    if (status === "accepted") {
      const participacion = new Participacion({
        sobremesa_id: carta.sobremesa_id,
        user_id: carta.user_id,
        role: "participant",
      });
      await participacion.save();
    }

    res.json(carta);
  } catch (error: any) {
    res.status(500).json({ message: "Error updating carta status", error: error.message });
  }
});

// Check if current user has submitted a carta for a sobremesa
router.get("/check/:sobremesa_id", authenticateToken, async (req: any, res: Response): Promise<void> => {
  const sobremesa_id = req.params.sobremesa_id;
  const user_id = req.user.id;

  try {
    const carta = await CartaIntencion.findOne({ sobremesa_id, user_id });
    res.json({ has_carta: !!carta, carta: carta || null });
  } catch (error: any) {
    res.status(500).json({ message: "Error checking carta", error: error.message });
  }
});

export default router;
