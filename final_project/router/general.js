const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js"); // Import correct
const { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

public_users.use(express.json());

// Enregistrement d'un nouvel utilisateur
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Nom d'utilisateur et mot de passe requis" });
  }
  if (users[username]) {
    return res.status(400).json({ message: "Utilisateur déjà enregistré" });
  }
  users[username] = { password };
  return res
    .status(201)
    .json({ message: "Utilisateur enregistré avec succès !" });
});

// Obtenir la liste des livres disponibles avec async/await
public_users.get("/", async (req, res) => {
  try {
    // Simuler une requête pour obtenir les livres
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books); // Résoudre avec la liste des livres
      }, 1000); // Simuler un délai de 1 seconde
    });
    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération des livres." });
  }
});

// Obtenir un livre par son ISBN avec async/await
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;

    // Simuler une requête pour obtenir les détails du livre
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]); // Résoudre avec les détails du livre
        } else {
          reject("Livre non trouvé");
        }
      }, 1000); // Simuler un délai de 1 seconde
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Obtenir un livre par son auteur avec async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
    }
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres par auteur." });
  }
});

// Obtenir un livre par son titre avec async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (booksByTitle.length === 0) {
      return res.status(404).json({ message: "Aucun livre trouvé avec ce titre" });
    }
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des livres par titre." });
  }
});

// Obtenir les avis d'un livre
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    return res.status(200).json(book.reviews || {});
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des avis du livre." });
  }
});

module.exports.general = public_users;