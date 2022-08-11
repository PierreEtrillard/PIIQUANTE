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
    //ajout des propriétés likes/dislikes réglées à 0
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Recette ajoutée !" }))
    .catch((error) => res.status(400).json({ message: error }));
};

exports.modifySauce = (req, res, next) => {
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
  Sauce.findById(req.params.id)
    .then((sauce) => {
      let likersIds = sauce.usersLiked;
      let dislikersIds = sauce.usersDisliked;
      function appreciationsEraser(appreciation) {
        appreciation = appreciation.filter(
          (idList) => idList !== req.body.userId
        );
      }
      likersIds = likersIds.filter(
        (idList) => idList !== req.body.userId
      );
      dislikersIds = dislikersIds.filter(
        (idList) => idList !== req.body.userId
      );
    

      console.log("dislikersId avant switch : " + dislikersIds.length);
      console.log("likersId avant switch : " + likersIds.length);
      switch (req.body.like) {
        case 1:
          likersIds.push(req.body.userId);
          sauce.likes = likersIds.length;
          break;
        case -1:
          dislikersIds.push(req.body.userId);
          sauce.dislikes = dislikersIds.length;
          break;
        case 0:
          sauce.dislikes = dislikersIds.length;
          sauce.likes = likersIds.length;
          break;
      }
      console.log("dislikersId après switch : " + dislikersIds.length);
      console.log("likersId après switch : " + likersIds.length);
      sauce
        .save()
        .then(res.status(200).json({ message: "appréciation enregistrée" }));
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
