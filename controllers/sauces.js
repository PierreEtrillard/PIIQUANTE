const Sauce = require("../models/sauces");
const fs = require("fs");
/* --- ASTUCE!: les middlewears suivant utilisent des spread operator(fr:décomposition) : '...'
cette synthaxe permet d'appeler tous les itérables de tableau ou d'objets (toutes les 
clés de chaque sauces requétées dans notre cas). Pour plus d'expliquations, voir :
https://www.devenir-webmaster.com/V2/TUTO/CHAPITRE/JAVASCRIPT/56-destructuring-spread-operator/
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
      sauce.dislikes = sauce.usersDisliked.length;
      sauce.likes = sauce.usersLiked.length;
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

exports.modifySauce = async (req, res, next) => {
  const sauceTargeted = await Sauce.findById(req.params.id);
  let sauceUpdate = {};//Contiendra le corp de requète
  //Test si la requète contient un fichier form/data (= stringifié par multer):
  if (req.file) {
    //supression de l'ancienne image.
    let oldPic = sauceTargeted.imageUrl.split("/images/")[1];
    fs.unlinkSync(`images/${oldPic}`);
    //Parser la requète et mise à jour de l'URL de la nouvelle image
    sauceUpdate = { ...JSON.parse(req.body.sauce) };
    sauceUpdate.imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  } else {
    if (sauceTargeted.userId != req.auth.userId) {
      //si tentative de modification de la sauce d'un autre user:
      res.satus(403).json({ message: "Non-autorisé !" });
    } else {
      sauceUpdate = { ...req.body };
    }
  }
  delete sauceUpdate.userId; //Ne pas faire confiance à l'userId de la requète !
  //Sauvegarde de la mise à jour dans la base de données:
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceUpdate, _id: req.params.id } //réécrire l'_id présent dans l'url pour le cas ou un autre _id serait inséré dans le body..
  )
    .then(res.status(200).json({ message: "Sauce mise à jour !" }))
    .catch((error) => res.satus(400).json({ error }));
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
      // Suppression de l'userId si déja présent dans les tableaux: usersLiked et usersDisliked
      let likersIds = sauce.usersLiked.filter(
        (idList) => idList !== req.auth.userId
      );
      let dislikersIds = sauce.usersDisliked.filter(
        (idList) => idList !== req.auth.userId
      );

      switch (req.body.like) {
        case 1: // l'utilissateur like la sauce
          likersIds.push(req.auth.userId);
          break;
        case -1: // l'utilissateur dislike la sauce
          dislikersIds.push(req.auth.userId);
          break;
      }
      sauce.usersLiked = likersIds;
      sauce.usersDisliked = dislikersIds;
      sauce.save().then(() => {
        res.status(200).json({ message: "appréciation enregistrée" });
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
