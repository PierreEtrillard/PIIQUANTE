const bcrypt = require("bcrypt");
const User = require("../models/users");

exports.createUser = (req, res, next) => {
  console.log(req.body);
  const user = new User({ ...req.body });
  user
    .save()
    .then(() => res.status(201).json({ message: "Compte créé !" }))
    .catch((error) => res.status(400).json({ error }));
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
      bcrypt.compare(req.body.password.user.password)
        .then((valid) => {
            if (!valid) {
            return res
                .status(401)
                .json({ messsage: "mot de passe ou nom d'utilisateur incorrect" });
            }
            res.status(200).json({
            userId: user._id,
            token: "TOKEN",
            });
        })
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }));
};
