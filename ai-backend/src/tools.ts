import { tool } from "ai";
import { z } from "zod";
import { db } from "./database.js";

export const getFacturation = tool({
  description: "Récupère les factures d'un client par son nom",

  inputSchema: z.object({
    nom: z.string().trim().min(1).describe("Nom du client recherché"),
  }),

  execute: async ({ nom }) => {
    const factures = db
      .prepare(
        `
      SELECT
        c.nom,
        f.numero,
        f.montant,
        f.date_facture,
        f.statut
      FROM facture f
      JOIN client c ON c.id = f.client_id
      WHERE c.nom LIKE ? ESCAPE '\\'
      ORDER BY f.date_facture, f.id
    `,
      )
      .all(`%${nom.trim().replace(/[\\%_]/g, "\\$&")}%`);

    return factures;
  },
});
