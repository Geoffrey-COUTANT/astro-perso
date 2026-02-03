# Configuration de l'accès admin

Tout se configure **uniquement** dans `appsettings.json` (section `Admin`). Aucun autre fichier à modifier pour le login, le mot de passe ou le token.

---

## Première fois : initialiser login, mot de passe et token

1. **Ouvrir** le fichier `Api/appsettings.json` (ou le créer à partir de `Api/appsettings.Example.json`).

2. **Remplir** la section `Admin` avec vos propres valeurs :
   - **Login** : l’identifiant que vous voulez utiliser pour vous connecter (ex. `"admin"` ou votre prénom).
   - **Password** : le mot de passe que vous choisissez (long, avec lettres et chiffres).
   - **ApiKey** : une chaîne secrète quelconque (ex. `"MaCleSecrete2024"` ou une longue phrase). C’est cette valeur qui sert de « token » après connexion ; vous l’inventez, vous ne la récupérez nulle part.

3. **Exemple** dans `appsettings.json` :
   ```json
   "Admin": {
     "Login": "admin",
     "Password": "MonMotDePasse123!",
     "ApiKey": "UneChaineSecreteLonguePourLesAppelsAPI"
   }
   ```

4. **Sauvegarder** le fichier, puis **redémarrer l’API** (`cd Api` puis `dotnet run`).

5. **Tester** : aller sur le site sur **/admin/connect**, saisir le **Login** et le **Password** que vous venez de mettre. Si c’est bon, vous êtes redirigé vers **/admin**. Le « token » est alors automatiquement utilisé par le navigateur (vous n’avez rien à copier).

**Important** : ne commitez pas `appsettings.json` si vous y mettez de vrais mots de passe. Utilisez **User Secrets** en dev (voir plus bas) ou un fichier non versionné en production.

---

## Les 3 champs à renseigner

| Champ      | Rôle |
|-----------|------|
| **Login** | Identifiant de connexion (vous le choisissez, ex. `"admin"`). |
| **Password** | Mot de passe (vous le choisissez). |
| **ApiKey** | Chaîne secrète quelconque (ex. `"MaCleSecrete2024"`). Ce n'est pas un token à "trouver" : vous inventez cette valeur. |

## Comment ça marche

1. Vous mettez **Login**, **Password** et **ApiKey** dans `appsettings.json`.
2. Vous allez sur **/admin/connect** et vous entrez le **Login** et le **Password**.
3. Si c'est bon, l'API renvoie l'**ApiKey** au navigateur comme "token". Le navigateur la garde en session.
4. Vous restez connecté à **/admin** tant que vous ne vous déconnectez pas.

## Exemple dans `appsettings.json`

```json
"Admin": {
  "Login": "admin",
  "Password": "VotreMotDePasseSecret",
  "ApiKey": "UneChaineSecreteLonguePourLesAppelsAPI"
}
```

**ApiKey** ne doit pas rester vide, sinon la connexion échouera après le contrôle du mot de passe.

---

## Option : User Secrets (sans mettre les vrais mots de passe dans appsettings.json)

Pour ne pas écrire les secrets dans un fichier versionné :

1. Dans un terminal, à la racine du projet :  
   `cd Api`

2. Initialiser les User Secrets (une seule fois) :  
   `dotnet user-secrets init`

3. Enregistrer les valeurs :  
   ```bash
   dotnet user-secrets set "Admin:Login" "VotreIdentifiant"
   dotnet user-secrets set "Admin:Password" "VotreMotDePasse"
   dotnet user-secrets set "Admin:ApiKey" "VotreCleSecreteLongue"
   ```

4. Dans `appsettings.json`, vous pouvez laisser la section `Admin` vide ou avec des placeholders ; les User Secrets remplaceront ces valeurs au lancement de l’API.
