import { Hono } from 'hono';
import { db } from '../db';

export const atelierRoute = new Hono();

//  GET tous les ateliers
atelierRoute.get('/ateliers', (c) => {
  return new Promise((resolve) => {
    db.all(`
      SELECT A.ID_Atelier, A.Nom_Atelier, A.Categorie_Produit, A.Capacite_Max,
             A.Date_Atelier, A.Nom_Responsable,
             W.Nom_Woofer,
             COUNT(I.ID_Woofer) AS NbInscrits
      FROM Atelier A
      LEFT JOIN Woofer W ON A.ID_Woofer = W.ID_Woofer
      LEFT JOIN Inscription I ON A.ID_Atelier = I.ID_Atelier
      GROUP BY A.ID_Atelier
    `, (err, rows) => {
      if (err) resolve(c.json({ error: "Erreur récupération ateliers" }, 500));
      else resolve(c.json(rows));
    });
  });
});

//  POST - Créer un nouvel atelier
atelierRoute.post('/ateliers', async (c) => {
  const { Nom_Atelier, Categorie_Produit, ID_Woofer, Capacite_Max, Nom_Responsable, Date_Atelier } = await c.req.json();


  return new Promise((resolve) => {
    db.run(
      `INSERT INTO Atelier (Nom_Atelier, Categorie_Produit, ID_Woofer, Date_Atelier, Heure_Atelier, Capacite_Max, Nom_Responsable)
       VALUES (?, ?, ?, ?, time('now'), ?, ?)`,
       [Nom_Atelier, Categorie_Produit, ID_Woofer, Date_Atelier, Capacite_Max, Nom_Responsable],
      function (err) {
        if (err) resolve(c.json({ error: "Erreur ajout atelier" }, 500));
        else resolve(c.json({ message: " Atelier ajouté", id: this.lastID }));
      }
    );
  });
});

//  DELETE - Supprimer un atelier
atelierRoute.delete('/ateliers/:id', (c) => {
  const id = c.req.param('id');
  return new Promise((resolve) => {
    db.run("DELETE FROM Atelier WHERE ID_Atelier = ?", [id], function (err) {
      if (err) resolve(c.json({ error: "Erreur suppression atelier" }, 500));
      else resolve(c.json({ message: "🗑️ Atelier supprimé", changes: this.changes }));
    });
  });
});
