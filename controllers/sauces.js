const Sauce = require("../models/sauces");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({ ...sauceObject,
  userId: req.auth.userId,
imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`});
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Recette ajoutée !" }))
    .catch((error) => res.status(400).json({ message: error }));
};
// exports.likeSauce = (req, res, next) => {
//   const likeThis = Sauce.updateOne({ _id: req.params.id }, { req.body, _id: req.params._id })
//     .then(() => {++likeThis.likes}
//       res.status(200).json("Sauce likée");
//     })
//     .catch((error) => {
//       res.status(400).json({
//         error: error,
//       });
//     });
// };

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
  Sauce.findOne({ _id: req.params.id})
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.ModifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params._id })
    .then(() => {
      res.status(200).json("Modification enregistrée");
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id})
    .then(() => {
      res.status(200).json("Sauce supprimée");
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.updateOne({_id: req.params.id})
    .then((sauce) => {
      res.status(200).json(sauce);
      console.log(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
