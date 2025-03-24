import { Hono } from 'hono';
import { db } from '../db';

export const responsableRoute = new Hono();

// 🔍 GET tous les responsables
responsableRoute.get('/responsables', (c) => {
  return new Promise((resolve) => {
    db.all("SELECT * FROM Responsable", [], (err, rows) => {
      if (err) resolve(c.json({ error: "Erreur récupération" }, 500));
      else resolve(c.json(rows));
    });
  });
});

// ➕ POST - Ajouter un responsable
responsableRoute.post('/responsables', async (c) => {
  const { Nom_Responsable, Date_Affectation, Type_Resp } = await c.req.json();
  return new Promise((resolve) => {
    db.run(
      `INSERT INTO Responsable (Nom_Responsable, Date_Affectation, Type_Resp)
       VALUES (?, ?, ?)`,
      [Nom_Responsable, Date_Affectation, Type_Resp],
      function (err) {
        if (err) resolve(c.json({ error: "Erreur ajout" }, 500));
        else resolve(c.json({ message: "Responsable ajouté", id: this.lastID }));
      }
    );
  });
});
