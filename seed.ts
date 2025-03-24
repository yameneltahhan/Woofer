import { db } from './db';

db.serialize(() => {
  //  Produits
  db.run(`
        INSERT OR IGNORE INTO Produit (Nom_Produit, Stock_Dispo, Seuil_Stock, Alerte_Stock, Prix_Unitaire)
        VALUES 
          ('Fromage', 100, 10, 0, 5.00),
          ('Oeufs', 200, 20, 0, 0.50),
          ('Lait', 150, 30, 0, 1.20),
          ('Tomates', 180, 25, 0, 2.00)
      `);

  //  Élevage
  db.run(`
    INSERT OR IGNORE INTO Elevage (Espece_Animal, Categorie_Animal, Date_Arrivee)
    VALUES 
      ('Poule', 'Pondeuse', '2024-01-15'),
      ('Chèvre', 'Laitière', '2024-02-01'),
      ('Poule', 'Reproducteur', '2024-03-01')
  `);

  //  Woofer de test
  db.run(`
    INSERT OR IGNORE INTO Woofer (Nom_Woofer, Prenom_Woofer, Date_Debut_Sejour, Date_Fin_Sejour)
    VALUES 
      ('Dupont', 'Alice', '2025-03-01', '2025-04-01'),
      ('Martin', 'Lucas', '2025-03-15', '2025-04-15')
  `);

  //  Alimentation
  db.run(`
    INSERT OR IGNORE INTO Alimentation (Nom_Aliment, Quantite_Dispo, Quantite_Mensuelle, Alerte_Stock)
    VALUES 
      ('Maïs', 200, 100, 0),
      ('Blé', 150, 80, 0),
      ('Foin', 300, 150, 0)
  `);

  db.run(
        `INSERT INTO Atelier (Nom_Atelier, Categorie_Produit, ID_Woofer, Nom_Responsable, Date_Atelier, Heure_Atelier, Capacite_Max)
         VALUES (?, ?, ?, ?, date('now'), time('now'), 10)`,
       
  );

  //  Vente d’exemple (si produit & woofer existent déjà)
  db.run(`
    INSERT OR IGNORE INTO Vente (Nom_Produit, Quantite_Achat, Montant_Total, Date_Vente, ID_Woofer)
    VALUES 
      ('Fromage', 2, 12.50, '2025-03-23', 1)
  `);
  

  console.log(' Données de base insérées avec succès !');
});
