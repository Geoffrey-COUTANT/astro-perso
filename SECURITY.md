# Sécurité du site et de l’API

Ce document décrit les mesures de sécurité en place et les bonnes pratiques pour éviter les fuites de données, le vol de mots de passe et les attaques.

---

## 1. Ce qui est déjà en place

### API (backend)

- **Authentification admin** : les routes admin (galerie, réunions, liens, contact) exigent l’en-tête `X-Admin-Key` (token obtenu après connexion sur `/admin/connect`). Sans token valide → 401.
- **Connexion** : login + mot de passe vérifiés côté API. Le mot de passe n’est jamais envoyé au front après la connexion ; seul un token (ApiKey) est renvoyé et stocké en session.
- **Rate limiting sur le login** : maximum 5 tentatives par IP sur 15 minutes. Au-delà → 429 « Trop de tentatives ».
- **En-têtes de sécurité** :
  - `X-Content-Type-Options: nosniff` (réduit les risques XSS / MIME sniffing)
  - `X-Frame-Options: DENY` (limite le clickjacking)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-XSS-Protection: 1; mode=block`
- **CORS** : l’API n’accepte que les requêtes depuis les origines configurées (ex. `http://localhost:3000`). En production, limiter aux domaines réels du site.
- **HTTPS en production** : la redirection HTTPS est activée quand l’app n’est pas en mode Development.
- **Données sensibles** : les mots de passe et l’ApiKey ne sont lus que côté serveur (fichier de config ou variables d’environnement). Ils ne sont jamais exposés dans le front.

### Frontend

- **Token en session** : le token admin est stocké en `sessionStorage` (perdu à la fermeture de l’onglet). Il n’est pas dans le code source ni dans un fichier `.env` versionné.
- **Page admin protégée** : accès à `/admin` uniquement si un token est présent. Sinon → 404 (pas de redirection qui révèle l’URL de connexion).
- **Connexion sur une URL dédiée** : `/admin/connect` pour le formulaire de login.

### Fichiers et dépôt Git

- **`.gitignore`** :
  - `.env` (évite de committer les variables d’environnement du front)
  - `Api/uploads` (fichiers uploadés et données JSON)
  - `Api/appsettings.Production.json` et `Api/appsettings.Secrets.json` (fichiers de secrets)
- **Modèle de config** : `Api/appsettings.Example.json` montre la structure sans vraies valeurs. À copier en `appsettings.json` et à remplir localement, sans committer de vrais mots de passe.

---

## 2. Bonnes pratiques à suivre

### Ne jamais committer de secrets

- **Ne pas mettre** de vrais login, mot de passe ou ApiKey dans `appsettings.json` si ce fichier est versionné. Utiliser soit :
  - **User Secrets** (dev) :  
    `dotnet user-secrets set "Admin:Password" "VotreMotDePasse"`  
    (et idem pour `Admin:Login`, `Admin:ApiKey`)
  - soit un fichier **non versionné** : `appsettings.Production.json` ou `appsettings.Secrets.json` (déjà dans `.gitignore`).
- Côté front : ne jamais mettre de clé API secrète dans `.env` versionné. Le `.env` est ignoré par Git.

### En production

1. **HTTPS uniquement** : héberger le site et l’API en HTTPS (certificat SSL).
2. **CORS** : dans `Program.cs`, remplacer les origines par les vrais domaines (ex. `https://votresite.fr`).
3. **Secrets** : configurer Login, Password et ApiKey via les variables d’environnement du serveur (ou un coffre de secrets), pas dans un fichier committé.
4. **Mots de passe** : utiliser un mot de passe fort (long, mélange de caractères). L’ApiKey doit être une longue chaîne aléatoire.
5. **Sauvegardes** : sauvegarder régulièrement le dossier `Api/uploads` (galerie, réunions, liens, contact) sur un support sécurisé.

### En cas de fuite ou de doute

- Changer immédiatement le mot de passe et l’ApiKey dans la config (ou User Secrets / variables d’environnement).
- Redémarrer l’API après modification.
- Se déconnecter de l’admin (fermer l’onglet ou cliquer sur Déconnexion) puis se reconnecter avec le nouveau mot de passe.

---

## 3. Limites et évolutions possibles

- **Token en sessionStorage** : en cas de XSS (script malveillant injecté dans la page), le token pourrait être lu. Pour renforcer : sécuriser les entrées utilisateur, envisager des cookies httpOnly pour le token en cas de refonte.
- **Mot de passe en clair dans la config** : aujourd’hui le mot de passe est comparé tel quel. Pour aller plus loin : stocker un hash (ex. bcrypt) et vérifier le hash à la connexion.
- **Rate limiting** : actuellement uniquement sur le login. On peut ajouter une limite globale par IP si besoin.

En suivant ces règles et en ne committant jamais de secrets, vous limitez fortement les risques de fuite de données et de vol de mots de passe.

---

## 4. Côté infra : ce qui peut poser problème en déploiement

### À prévoir avant de mettre en production

| Point | Risque si ignoré | À faire |
|-------|-------------------|--------|
| **CORS** | Le front (ex. `https://votresite.fr`) ne pourra pas appeler l’API, requêtes bloquées par le navigateur. | Dans `Api/Program.cs`, ajouter l’URL réelle du site dans `WithOrigins` (ex. `"https://votresite.fr"`). Garder localhost en dev. |
| **URL de l’API** | Le front continue d’appeler `http://localhost:5050`. | Au build du front, définir `REACT_APP_API_URL=https://api.votresite.fr` (ou l’URL réelle de l’API). |
| **HTTPS** | Connexions en clair, mots de passe et token exposés. | Héberger le site et l’API en HTTPS (certificat SSL). L’API active déjà la redirection HTTPS hors mode Development. |
| **Secrets en prod** | Mots de passe et ApiKey dans un fichier versionné ou sur un serveur non sécurisé. | Configurer Login, Password et ApiKey via les **variables d’environnement** du serveur (ou coffre de secrets), pas dans `appsettings.json` committé. |
| **Dossier `uploads`** | Sur certains hébergeurs, le disque est **éphémère** : redémarrage ou nouvelle instance = **perte des images et des JSON** (galerie, réunions, liens, contact). | Vérifier que le répertoire où l’API écrit (ex. `uploads`) est **persistant** (volume monté, disque durable). Sinon, prévoir un stockage externe (blob, S3, etc.) ou un hébergement avec disque persistant. |
| **Sauvegardes** | Pas de backup = perte définitive en cas de panne ou erreur. | Sauvegarder régulièrement le dossier `Api/uploads` (et la config / BDD si vous en ajoutez une plus tard). |

### Hébergement typique

- **Front React** : build (`npm run build`) puis hébergement des fichiers statiques (Netlify, Vercel, OVH, etc.).
- **API .NET** : un serveur qui exécute l’API (VPS, Azure App Service, OVH, etc.), avec HTTPS et CORS configurés, et un disque persistant pour `uploads` si l’hébergeur le permet.

### En résumé

Oui, côté infra ça **peut** poser problème si vous ne faites pas :

1. **CORS** = origines autorisées avec l’URL réelle du site.
2. **REACT_APP_API_URL** = URL réelle de l’API au build du front.
3. **HTTPS** pour le site et l’API.
4. **Secrets** via variables d’environnement (ou coffre), pas en clair dans un fichier committé.
5. **Persistance du dossier `uploads`** (ou autre stockage) pour ne pas perdre les images et données.

Avec ces points vérifiés, l’infra est cohérente et évite les principaux soucis en production.
