import express from "express";
import { Request, Response } from "express";
import { Sobremesa } from "../models/Sobremesa";
import { Participacion } from "../models/Participacion";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get all proposed sobremesas (public cartelera)
router.get("/cartelera", async (req: Request, res: Response) => {
  try {
    const sobremesas = await Sobremesa.find({ status: "proposed" })
      .populate("convocante_id", "name context photo")
      .sort({ created_at: -1 }); // Most recent first

    res.json(sobremesas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sobremesas", error: error.message });
  }
});

// Get single sobremesa by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const sobremesa = await Sobremesa.findById(req.params.id).populate(
      "convocante_id",
      "name context photo bio"
    );

    if (!sobremesa) {
      return res.status(404).json({ message: "Sobremesa not found" });
    }

    res.json(sobremesa);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sobremesa", error: error.message });
  }
});

// Create new sobremesa (requires auth)
router.post("/", authenticateToken, async (req: any, res: Response) => {
  const { title, description, date_time, max_participants } = req.body;
  const convocante_id = req.user.id;

  if (!title || !description || !date_time || !max_participants) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newSobremesa = new Sobremesa({
      title,
      description,
      date_time,
      max_participants,
      convocante_id,
      status: "proposed",
    });

    await newSobremesa.save();

    // Create participacion record for convocante
    const participacion = new Participacion({
      sobremesa_id: newSobremesa._id,
      user_id: convocante_id,
      role: "convocante",
    });

    await participacion.save();

    res.status(201).json(newSobremesa);
  } catch (error) {
    res.status(500).json({ message: "Error creating sobremesa", error: error.message });
  }
});

// Get my sobremesas (as convocante or participant)
router.get("/mis-sobremesas/all", authenticateToken, async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const participaciones = await Participacion.find({ user_id: userId })
      .populate({
        path: "sobremesa_id",
        populate: {
          path: "convocante_id",
          select: "name context photo",
        },
      })
      .sort({ created_at: -1 });

    const sobremesas = participaciones.map((p) => ({
      ...p.sobremesa_id.toObject(),
      my_role: p.role,
    }));

    res.json(sobremesas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your sobremesas", error: error.message });
  }
});

// Update sobremesa status (convocante only)
router.patch("/:id/status", authenticateToken, async (req: any, res: Response) => {
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const sobremesa = await Sobremesa.findById(req.params.id);

    if (!sobremesa) {
      return res.status(404).json({ message: "Sobremesa not found" });
    }

    // Check if user is the convocante
    if (sobremesa.convocante_id.toString() !== userId) {
      return res.status(403).json({ message: "Only convocante can update status" });
    }

    sobremesa.status = status;
    await sobremesa.save();

    res.json(sobremesa);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});

// Update meeting link (convocante only)
router.patch("/:id/meeting-link", authenticateToken, async (req: any, res: Response) => {
  const { meeting_link } = req.body;
  const userId = req.user.id;

  try {
    const sobremesa = await Sobremesa.findById(req.params.id);

    if (!sobremesa) {
      return res.status(404).json({ message: "Sobremesa not found" });
    }

    // Check if user is the convocante
    if (sobremesa.convocante_id.toString() !== userId) {
      return res.status(403).json({ message: "Only convocante can update meeting link" });
    }

    sobremesa.meeting_link = meeting_link;
    await sobremesa.save();

    res.json(sobremesa);
  } catch (error) {
    res.status(500).json({ message: "Error updating meeting link", error: error.message });
  }
});

export default router;
