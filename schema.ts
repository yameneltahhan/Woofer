import sqlite3 from "sqlite3";
sqlite3.verbose();

const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error(" Erreur de connexion :", err.message);
  } else {
    console.log(" Connecté à SQLite !");
  }
});

db.serialize(() => {
  // Table Woofer
  db.run(`
    CREATE TABLE IF NOT EXISTS Woofer (
      ID_Woofer INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Woofer TEXT,
      Prenom_Woofer TEXT,
      Date_Debut_Sejour TEXT,
      Date_Fin_Sejour TEXT
    )
  `);

  // Table Client
  db.run(`
    CREATE TABLE IF NOT EXISTS Client (
      ID_Client INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Client TEXT,
      Prenom_Client TEXT
    )
  `);

  // Table Produit
  db.run(`
    CREATE TABLE IF NOT EXISTS Produit (
      ID_Produit INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Produit TEXT UNIQUE,
      Stock_Dispo INTEGER,
      Seuil_Stock INTEGER,
      Alerte_Stock INTEGER,
      Prix_Unitaire REAL
  )
  `);

  // Table Vente
  db.run(`
    CREATE TABLE IF NOT EXISTS Vente (
      ID_Vente INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Produit TEXT,
      Quantite_Achat INTEGER,
      Montant_Total REAL,
      Date_Vente TEXT,
      ID_Woofer INTEGER,
      FOREIGN KEY(Nom_Produit) REFERENCES Produit(Nom_Produit),
      FOREIGN KEY(ID_Woofer) REFERENCES Woofer(ID_Woofer)
    )
  `);

  // Table Élevage
  db.run(`
    CREATE TABLE IF NOT EXISTS Elevage (
      ID_Animal INTEGER PRIMARY KEY AUTOINCREMENT,
      Espece_Animal TEXT,
      Categorie_Animal TEXT,
      Date_Arrivee TEXT
    )
  `);

  // Table Production
  db.run(`
    CREATE TABLE IF NOT EXISTS Production (
      ID_Production INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Produit INTEGER,
      ID_Animal INTEGER,
      Type_Produit TEXT,
      Quantite INTEGER,
      Date_Production TEXT,
      FOREIGN KEY(ID_Produit) REFERENCES Produit(ID_Produit),
      FOREIGN KEY(ID_Animal) REFERENCES Elevage(ID_Animal)
    )
  `);

  // Table Alimentation
  db.run(`
    CREATE TABLE IF NOT EXISTS Alimentation (
      ID_Aliment INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Aliment TEXT,
      Quantite_Dispo INTEGER,
      Quantite_Mensuelle INTEGER,
      Alerte_Stock INTEGER
    )
  `);

  // Table Atelier
  db.run(`
  CREATE TABLE IF NOT EXISTS Atelier (
  ID_Atelier INTEGER PRIMARY KEY AUTOINCREMENT,
  Nom_Atelier TEXT,
  Date_Atelier TEXT,
  Heure_Atelier TEXT,
  Categorie_Produit TEXT,
  ID_Woofer INTEGER,
  Capacite_Max INTEGER,
  Nom_Responsable TEXT,
  FOREIGN KEY(ID_Woofer) REFERENCES Woofer(ID_Woofer)
);
  `);

  // Table Inscription
  db.run(`
    CREATE TABLE IF NOT EXISTS Inscription (
      ID_Inscription INTEGER PRIMARY KEY AUTOINCREMENT,
      ID_Atelier INTEGER,
      ID_Woofer INTEGER,
      Date_Inscription TEXT,
      FOREIGN KEY(ID_Atelier) REFERENCES Atelier(ID_Atelier),
      FOREIGN KEY(ID_Woofer) REFERENCES Woofer(ID_Woofer)
    )
  `);

  // Table Responsable
  db.run(`
    CREATE TABLE IF NOT EXISTS Responsable (
      ID_Responsable INTEGER PRIMARY KEY AUTOINCREMENT,
      Date_Affectation TEXT,
      Type_Resp TEXT
    )
  `);

  // Table Travailleur
  db.run(`
    CREATE TABLE IF NOT EXISTS Travailleur (
      ID_Travailleur INTEGER PRIMARY KEY AUTOINCREMENT,
      Taches_Assignees TEXT
    )
  `);
  //responsable
  db.run(`
    CREATE TABLE IF NOT EXISTS Responsable (
      ID_Responsable INTEGER PRIMARY KEY AUTOINCREMENT,
      Nom_Responsable TEXT,
      Date_Affectation TEXT,
      Type_Resp TEXT
    )
  `);
  

  console.log(" Tables créées avec succès !");
});

export default db;
