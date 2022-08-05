const Sauce = require("../models/sauces");

exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({ ...req.body });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Recette ajoutée !" }))
    .catch((error) => res.status(400).json({ message: error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
})
};

exports.getSauce = (req, res, next) => {
  Sauce.findOne().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
})
};

exports.ModifySauce = (req, res, next) => {
  Sauce.findOne().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
})
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
})
};
exports.likeSauce = (req, res, next) => {
  Sauce.findOne().then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
})
};
