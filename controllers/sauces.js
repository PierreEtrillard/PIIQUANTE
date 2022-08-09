const Sauce = require("../models/sauces");
const fs = require("fs");
/* --- ASTUCE!: les middlewears suivant utilisent des spread (fr:décomposition) : '...'
cette synthaxe permet d'appeler tous les itérables de tableau ou d'objets (toutes les 
clés de chaque sauces requétées dans notre cas). Pour plus d'expliquations, voir :
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax#exemple_interactif
--- */

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.createSauce = (req, res, next) => {
  //la requète est convertis en form/data(String) par mutler il faut donc la parser
  const sauceObject = JSON.parse(req.body.sauce);
  //Suppression de l'userId reçu du client par sécurité
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    //Récupération de l'userId dans le jeton d'authorization (req.auth)
    userId: req.auth.userId,
    //Construction de l'URL pour stocker l'image dans le dossier pointé par le middlewear multer-conf.js
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Recette ajoutée !" }))
    .catch((error) => res.status(400).json({ message: error }));
};

exports.ModifySauce = (req, res, next) => {
  //Test si la requète contient un fichier (= stringifié par multer), parser et traiter celle-ci à la maniére du middlewear précédent (createSauce).
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      } //Sinon récupération du corps de la requète
    : { ...req.body };

  delete sauceObject._userId; //sécurité ! (cf middlewear précédent (createSauce))
  //Ciblage de la sauce à modifier avec l'id présent dans l'url
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        //si tentative de modification de la sauce d'un autre user:
        res.satus(401).json({ message: "Non-autorisé !" });
      } else {
        //Sinon :updateOne({objet à cibler dans la BDD}, {nouvelle version, correspondante à l'id déclaré ds le 1er paramètre})
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce mise à jour !" }))
          .catch((error) => res.satus(401).json({ error }));
      }
    })
    .catch((error) => {
      res.satus(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  //Ciblage de la sauce à modifier avec l'id présent dans l'url.
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    //Test si la requète ne provient pas du propriétaire de la sauce.
    if (sauce.userId != req.auth.userId) {
      res.status(401).json({ message: "Non-autorisé !" });
    } //Si la requète provient bien du propriétaire: récupération du nom du fichier,
    else {
      const filename = sauce.imageUrl.split("/images/")[1];
      //supression du fichier image,
      fs.unlink(
        `images/${filename}`,
        //puis suppression définitive de l'objet/sauce dans la BDD.
        () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée" });
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
        }
      );
    }
  });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const likersId = sauce.usersLiked;
      const disLikersId = sauce.usersDisliked;
      const userAppreciation = req.body.like;
      switch (userAppreciation) {
        case 1:
          likersId.push(`${req.body.userId}`);

          console.log("liked"+likersId);
          break;
        case -1:
          disLikersId.push(req.body.userId);
          console.log("dislike");
          break;
        case 0:
          console.log("plus qu'a effacer les id ");
          // LikersId.delete(req.body.userId)
          // dislikersId.delete(req.body.userId)
          break;
      }
      res.status(200).json({ message: "appréciation enregistrée" });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
