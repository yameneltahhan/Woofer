import { Hono } from 'hono';
import { db } from '../db';

export const wooferRoute = new Hono();

wooferRoute.get('/woofers', (c) => {
  return new Promise((resolve) => {
    db.all("SELECT * FROM Woofer", (err, rows) => {
      if (err) resolve(c.json({ error: "Erreur récupération" }, 500));
      else resolve(c.json(rows));
    });
  });
});

wooferRoute.post('/woofers', async (c) => {
  const { Nom_Woofer, Prenom_Woofer, Date_Debut_Sejour, Date_Fin_Sejour } = await c.req.json();
  return new Promise((resolve) => {
    db.run(
      `INSERT INTO Woofer (Nom_Woofer, Prenom_Woofer, Date_Debut_Sejour, Date_Fin_Sejour)
       VALUES (?, ?, ?, ?)`,
      [Nom_Woofer, Prenom_Woofer, Date_Debut_Sejour, Date_Fin_Sejour],
      function (err) {
        if (err) resolve(c.json({ error: "Erreur ajout" }, 500));
        else resolve(c.json({ message: " Woofer ajouté", id: this.lastID }));
      }
    );
  });
});

wooferRoute.delete('/woofers/:id', (c) => {
  const id = c.req.param('id');
  return new Promise((resolve) => {
    db.run("DELETE FROM Woofer WHERE ID_Woofer = ?", [id], function (err) {
      if (err) resolve(c.json({ error: "Erreur suppression" }, 500));
      else resolve(c.json({ message: "🗑️ Woofer supprimé", changes: this.changes }));
    });
  });
});