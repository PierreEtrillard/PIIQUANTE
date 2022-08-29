const bcrypt = require("bcrypt");
const User = require("../models/users");
const tokenManager = require("jsonwebtoken");
// récupération de la clef de création de jeton de connection dans le fichier '.env'
const dotenv = require("dotenv");
dotenv.config();
const tokenKey = process.env.TOKEN_KEY;

exports.createUser = (req, res, next) => {
  const regexValid = /^[A-Za-z0-9éïäëèà \-\.']{8,}/;
  if (regexValid.test(req.body.password)) {
    //10 passes de cryptages du mot de passe envoyé
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({ email: req.body.email, password: hash });
        user
          .save()
          .then(() => res.status(201).json({ message: "Compte créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    res
      .status(400)
      .json({
        message:
          "renseignez un mot de passe de 8 à 20 caractères et contenant minimum une majuscule, un chiffre et une minuscule",
      });
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          messsage: "mot de passe ou nom d'utilisateur incorrect" /* ! indiquer 
        l'absence de l'user dans la BDD serait une fuite de donnée*/,
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              messsage: "mot de passe ou nom d'utilisateur incorrect",
            });
          }
          res.status(200).json({
            message: "Vous êtes connectez",
            userId: user._id,
            token: tokenManager.sign({ userId: user._id }, tokenKey, {
              expiresIn: "3h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(501).json({ error }));
};
