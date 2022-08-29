************************   PRÉPARATION DU SERVER  ************************

1) Créer un fichier .env contenant les entrées suivantes:
    mongoLogin = "<votre nom d'utilisateur MongoDb>:<votre mot de passe MongoDb>"

    //Par defaut le server tourne sur le port 3000, vous pouvez choisir un port différent en renseignant:

    PORT = *le numéro de port de votre choix* 
    (verifiez aussi que l'appli front requète vers le même port) 

    TOKEN_KEY 'chaineDeCaractèreAléatoirePourleCryptageDuJetonD'Authentification"

2) Installer les modules node suivants depuis le dossier BACK:

DÉPENDANCES REQUISES :
npm install --save dotenv express mongoose mongoose-unique-validator bcrypt jsonwebtoken multer fs

Description des modules à installer :
                dotenv (gestionnaire des variables d'environement)
                express (server node)
                mongoose (connection à MongoDb )
                mongoose-unique-validator (plugin vérifiant l'unicitée d'un utilisateur pour la route POST ../signup)
                bcrypt (hashage password)
                jsonwebtoken (créateur de jetons d'identification)
                multer (gestion des téléchargements de fichiers)
                fs (gestionaire de fichiers)

3) Pour démarrer le server saisissez :

npm run start
    ou
node server
    ou
nodemon (si installé)

************************   DÉTAILS DES ROUTES   ************************ 

VERBS:        URI:                 BODY:                            RESPONSES:
POST       auth/signup     {email:string, password}             {message:string}
POST       auth/login      {email:string, password}             {userId:string, token:string}
GET        sauces/                   -                          [toutes les sauces]
GET        sauces/{id}               -                          sauce
POST       sauces/         {sauce:string, image:file}           {message:string}Verb
PUT        sauces/{id}     JSON{sauce:string, image:file}       {message:string}
                                   
DELETE     sauces/{id}               -                          {message:string}
POST       sauces/         {userId:string, like:number}         {message:string}

