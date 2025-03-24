import { Hono } from 'hono';
import { db } from '../db';

export const stockRoute = new Hono();

//  Obtenir tous les produits avec leur stock
stockRoute.get('/stock', (c) => {
  return new Promise((resolve) => {
    db.all("SELECT Nom_Produit, Stock_Dispo FROM Produit", (err, rows) => {
      if (err) resolve(c.json({ error: "Erreur récupération stock" }, 500));
      else resolve(c.json(rows));
    });
  });
});

// ➕ Ajouter du stock à un produit
stockRoute.post('/stock', async (c) => {
  const { Nom_Produit, Quantite } = await c.req.json();

  return new Promise((resolve) => {
    db.run(
      `UPDATE Produit SET Stock_Dispo = Stock_Dispo + ? WHERE Nom_Produit = ?`,
      [Quantite, Nom_Produit],
      function (err) {
        if (err) resolve(c.json({ error: "Erreur mise à jour" }, 500));
        else resolve(c.json({ message: "Stock mis à jour" }));
      }
    );
  });
});
