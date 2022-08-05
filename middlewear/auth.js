const tokenManager = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//split extrait le token après le premiére espace (juste aprés le mot 'Bearer')
    const decodedToken = tokenManager.verify(token, "RANDOM_TOKEN_SECRET");//"RANDOM_TOKEN_SECRET" à remplacer par unef chaine aléatoire plus longue en phase de production
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
