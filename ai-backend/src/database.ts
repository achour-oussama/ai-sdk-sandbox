import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { databasePath } from "./config.js";

if (databasePath !== ":memory:") {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

export const db = new Database(databasePath);
db.pragma("foreign_keys = ON");

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS client (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS facture (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    numero TEXT NOT NULL,
    montant REAL NOT NULL,
    date_facture TEXT NOT NULL,
    statut TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES client(id)
  );
`);

// Ajouter des données fictives au premier démarrage
db.transaction(() => {
  const count = db.prepare("SELECT COUNT(*) AS total FROM client").get() as {
    total: number;
  };
  if (count.total !== 0) return;

  const insertClient = db.prepare("INSERT INTO client (nom) VALUES (?)");
  const jeanId = insertClient.run("Jean Dupont").lastInsertRowid;
  const marcId = insertClient.run("Marc Martin").lastInsertRowid;
  const insertFacture = db.prepare(`
    INSERT INTO facture (client_id, numero, montant, date_facture, statut)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertFacture.run(jeanId, "FAC-001", 120, "2026-10-05", "Payée");
  insertFacture.run(jeanId, "FAC-002", 230, "2026-11-12", "En attente");
  insertFacture.run(marcId, "FAC-003", 95, "2026-11-15", "Payée");
})();
