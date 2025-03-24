import { Hono } from 'hono';
import { db } from '../db';

export const ventesRoute = new Hono();

//  Toutes les ventes
ventesRoute.get('/ventes', (c) => {
  return new Promise((resolve) => {
    db.all(`
      SELECT V.ID_Vente, V.Nom_Produit, V.Quantite_Achat, V.Montant_Total, V.Date_Vente, W.Nom_Woofer
      FROM Vente V
      LEFT JOIN Woofer W ON V.ID_Woofer = W.ID_Woofer
    `, (err, rows) => {
      if (err) resolve(c.json({ error: "Erreur récupération ventes" }, 500));
      else resolve(c.json(rows));
      
    });
    
  });
});

//  Ajouter une vente (montant calculé)
ventesRoute.post('/ventes', async (c) => {
  const { Nom_Produit, Quantite_Achat, Date_Vente, ID_Woofer } = await c.req.json();

  //  Log 1 : voir les données reçues
  console.log(" Données reçues:", { Nom_Produit, Quantite_Achat, Date_Vente, ID_Woofer });

  return new Promise((resolve) => {
    db.get("SELECT Prix_Unitaire FROM Produit WHERE Nom_Produit = ?", [Nom_Produit], (err, row) => {

      //  Log 2 : voir ce que SQLite retourne
      console.log(" Résultat de la requête produit:", err, row);

      if (err || !row || (row as { Prix_Unitaire: number }).Prix_Unitaire == null) {
        resolve(c.json({ error: "Produit non trouvé ou prix manquant" }, 400));
      } else {
        const prix = (row as { Prix_Unitaire: number }).Prix_Unitaire;
        const Montant_Total = prix * Quantite_Achat;

        db.run(
          `INSERT INTO Vente (Nom_Produit, Quantite_Achat, Montant_Total, Date_Vente, ID_Woofer)
           VALUES (?, ?, ?, ?, ?)`,
          [Nom_Produit, Quantite_Achat, Montant_Total, Date_Vente, ID_Woofer],
          function (err2) {
            if (err2) {
              console.error(" Erreur ajout vente :", err2.message); //  Log 3
              resolve(c.json({ error: "Erreur ajout vente" }, 500));
            } else {
              db.run(
                `UPDATE Produit SET Stock_Dispo = Stock_Dispo - ? WHERE Nom_Produit = ?`,
                [Quantite_Achat, Nom_Produit],
                function (err3) {
                  if (err3) {
                    console.error(" Erreur mise à jour stock :", err3.message);
                  } else {
                    console.log(" Stock mis à jour !");
                  }
                }
              );
              resolve(c.json({ message: " Vente ajoutée", id: this.lastID }));
            }
          }
        );
      }
    });
  });
});


//  Supprimer une vente
ventesRoute.delete('/ventes/:id', (c) => {
  const id = c.req.param('id');
  return new Promise((resolve) => {
    db.run("DELETE FROM Vente WHERE ID_Vente = ?", [id], function (err) {
      if (err) resolve(c.json({ error: "Erreur suppression vente" }, 500));
      else resolve(c.json({ message: "🗑️ Vente supprimée" }));
    });
  });
});
