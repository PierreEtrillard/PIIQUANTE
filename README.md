DÉPENDANCES REQUISES :
npm install (--save) :
                express
                mongoose (connection à )
                mongoose-unique-validator (plugin vérifiant l'unicitée d'un utilisateur pour la route POST .../signup)
                bcrypt (hashage password)
                jsonwebtoken (créateur de jetons d'identification)

VERBS:        URI:                 BODY:                            RESPONSES:
POST       auth/signup     {email:string, password}             {message:string}
POST       auth/login      {email:string, password}             {userId:string, token:string}
GET        sauces/                   -                          [toutes les sauces]
GET        sauces/{id}               -                          sauce
POST       sauces/         {sauce:string, image:file}           {message:string}Verb
PUT        sauces/{id}     JSON{sauce:string, image:file}       {message:string}
                                   
DELETE     sauces/{id}               -                          {message:string}
POST       sauces/         {userId:string, like:number}         {message:string}