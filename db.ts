import sqlite3 from "sqlite3";
sqlite3.verbose();

export const db = new sqlite3.Database("database.sqlite", (err) => {
  if (err) {
    console.error(" Erreur de connexion :", err.message);
  } else {
    console.log(" Connecté à SQLite !");
  }
});
