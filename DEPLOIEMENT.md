# Déploiement du site (GitHub Pages ou Vercel)

## Point important : vous avez 2 parties

| Partie | Techno | Qui peut l’héberger ? |
|--------|--------|------------------------|
| **Front (site)** | React (fichiers statiques après `npm run build`) | **GitHub Pages** ou **Vercel** |
| **Back (API)** | ASP.NET Core (serveur .NET) | **Ni GitHub Pages ni Vercel** → il faut un hébergeur qui exécute .NET (Railway, Fly.io, Azure, VPS, etc.) |

**GitHub Pages** et **Vercel** servent uniquement des **fichiers statiques** (ou du serverless type Node). Ils ne font pas tourner votre API .NET. Donc :

- **Front** → GitHub Pages **ou** Vercel
- **API** → à héberger à part (voir plus bas)

---

## Option A : Front sur GitHub Pages

Vous avez déjà `gh-pages` et le script `deploy` dans `package.json`.

### 1. Où sera l’API ?

L’API doit être hébergée **ailleurs** (Railway, Fly.io, etc.). Vous obtiendrez une URL du type `https://votre-api.railway.app` ou `https://votre-api.fly.dev`.

### 2. Build du front avec l’URL de l’API

Le front appelle l’API via `REACT_APP_API_URL`. Au **build**, cette variable est figée dans le JavaScript.

- **En local** (pour tester le build) :
  ```bash
  REACT_APP_API_URL=https://votre-api.railway.app yarn build
  ```
- **Sur GitHub** : il faut que le build soit fait avec la bonne valeur. Deux possibilités :
  - **Build en local** : lancer la commande ci-dessus, puis `yarn deploy` (ça pousse le dossier `build` sur la branche `gh-pages`).
  - **Build sur GitHub (Actions)** : créer un workflow qui fait le build avec `REACT_APP_API_URL` en variable d’environnement (secret du repo), puis déploie sur GitHub Pages.

### 3. Déployer le front sur GitHub Pages

- Si vous déployez **à la racine** du site (ex. `votreuser.github.io`) : `"homepage": "."` dans `package.json` est bon.
- Si vous déployez **dans un sous-dossier** (ex. `votreuser.github.io/astro-perso`) : mettre `"homepage": "https://votreuser.github.io/astro-perso"` dans `package.json`, puis `yarn build` et `yarn deploy`.

Après un `yarn deploy`, le site est servi depuis la branche `gh-pages` (à activer dans Settings → Pages du repo).

### 4. Côté API

- CORS : dans `Program.cs`, ajouter l’origine GitHub Pages, ex. `https://votreuser.github.io`.
- Héberger l’API sur Railway / Fly.io / etc. (voir “Où héberger l’API” plus bas).

---

## Option B : Front sur Vercel

### 1. Connexion du repo

- Allez sur [vercel.com](https://vercel.com), connectez-vous avec GitHub.
- “Add New Project” → importez le repo du site.
- Framework : **Create React App** (détecté automatiquement).
- Build : `yarn build` (ou `npm run build`).
- Output directory : `build`.

### 2. Variable d’environnement pour l’API

- Dans le projet Vercel : **Settings → Environment Variables**.
- Ajoutez : **Name** `REACT_APP_API_URL`, **Value** `https://votre-api.railway.app` (ou l’URL réelle de votre API).
- Redéployez pour que le build prenne la variable en compte.

### 3. Déploiements

Chaque push sur la branche principale peut déclencher un déploiement automatique. Les préviews (branches, PR) ont leur propre URL.

### 4. Côté API

- CORS : dans `Program.cs`, ajouter l’origine Vercel, ex. `https://votre-projet.vercel.app` (et l’URL de preview si besoin).
- Héberger l’API ailleurs (voir ci-dessous).

---

## GitHub Pages vs Vercel (pour le front)

| Critère | GitHub Pages | Vercel |
|--------|---------------|--------|
| **Gratuit** | Oui | Oui (tier gratuit) |
| **Build** | À faire en local ou avec une GitHub Action | Automatique à chaque push |
| **Variables d’env** | À gérer en local ou dans l’Action (secrets) | Dans l’interface (Settings → Env) |
| **Préviews (branches)** | Possible avec une Action | Automatique (une URL par déploiement) |
| **Simplicité** | Plus manuel (build + deploy ou Action) | Très simple (connect repo + env) |

**Recommandation** : **Vercel** pour le front si vous voulez le moins de config (build auto + env dans l’interface). **GitHub Pages** si vous voulez tout rester “dans GitHub” et accepter de configurer un build (local ou Action) avec `REACT_APP_API_URL`.

---

## Héberger l'API sur Railway (étape par étape)

Railway permet de déployer votre API .NET depuis GitHub. Voici les étapes.

### 1. Créer un projet Railway

- Allez sur [railway.app](https://railway.app) et connectez-vous (avec GitHub).
- Cliquez sur **"New Project"**.
- Choisissez **"Deploy from GitHub repo"** et sélectionnez le dépôt de votre site (celui qui contient le dossier `Api`).

### 2. Configurer le service pour pointer vers le dossier Api

Railway va détecter un projet à la racine. Il faut lui indiquer que le code à builder est dans **Api** :

- Dans le projet Railway, ouvrez le **service** (la carte de votre déploiement).
- Allez dans **Settings** (ou **Variables** selon l'interface).
- Cherchez **"Root Directory"** ou **"Source"** / **"Build"**.
- Définissez le **Root Directory** sur : **`Api`** (ou `./Api` selon ce que Railway propose).

Si Railway ne propose pas de Root Directory dans l'interface, vous pouvez ajouter un fichier **`railway.json`** ou **`nixpacks.toml`** à la racine du repo pour indiquer le sous-dossier. Sinon, créez un **Dockerfile** dans `Api/` (voir point 7).

### 3. Variables d'environnement

Dans le même service, onglet **Variables** :

| Variable | Exemple | Description |
|----------|---------|-------------|
| `Admin__Login` | `admin` | Identifiant de connexion admin |
| `Admin__Password` | `votre-mot-de-passe-secret` | Mot de passe admin |
| `Admin__ApiKey` | `une-longue-cle-secrete` | Clé utilisée comme token après login |

En .NET, les deux-points dans `Admin:Login` deviennent **deux underscores** en variable d'environnement : `Admin__Login`.

Le **port** est en général fourni automatiquement par Railway via la variable **`PORT`** ; votre `Program.cs` l'utilise déjà.

### 4. CORS : autoriser votre front

Votre front sera sur une URL du type `https://votreuser.github.io` ou `https://votre-projet.vercel.app`. Il faut autoriser cette origine dans l'API.

Dans **`Api/Program.cs`**, dans le bloc `AddCors`, ajoutez l'URL de votre front dans `WithOrigins` :

```csharp
policy.WithOrigins(
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://votreuser.github.io",           // GitHub Pages
        "https://votre-projet.vercel.app"        // Vercel
    )
```

Remplacez par vos vraies URLs (sans slash final). Puis commitez et poussez ; Railway redéploiera.

### 5. Obtenir l'URL de l'API

- Dans Railway, onglet **Settings** du service, section **Networking** ou **Domains**.
- Généralement Railway vous donne une URL du type : `https://votre-api-production-xxxx.up.railway.app`.
- **Utilisez cette URL** comme `REACT_APP_API_URL` pour le build du front (voir Option A ou B plus haut).

### 6. Données et dossier `uploads`

- Sur Railway, le système de fichiers est **éphémère** : à chaque redéploiement, le contenu du dossier `uploads` (images de la galerie, etc.) peut être perdu.
- Pour une persistance réelle, il faudrait utiliser un **volume** Railway (si disponible sur votre offre) ou un stockage externe (S3, Azure Blob, etc.). Pour un petit site, vous pouvez accepter de repartir de zéro après un redéploiement ou tester les volumes Railway.

### 7. Si Railway ne détecte pas le projet .NET (option Dockerfile)

Si après avoir mis le Root Directory à `Api` ça ne build pas, créez **`Api/Dockerfile`** :

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore && dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT}
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]
```

Puis dans Railway, configurez le **Root Directory** sur `Api` et choisissez **Dockerfile** comme méthode de build si proposé.

---

## Où héberger l'API (.NET) ?

GitHub Pages et Vercel **ne peuvent pas** faire tourner l'API. Il faut un hébergeur qui exécute .NET :

| Service | Idée | Coût typique |
|--------|------|----------------------|
| **Railway** | Déploiement depuis GitHub (dossier `Api`), variables d'env. | Offre gratuite limitée, puis payant |
| **Fly.io** | Déploiement via CLI, conteneur. | Petit quota gratuit, puis payant |
| **Azure App Service** | Très adapté à .NET. | Payant (souvent peu cher pour un petit site) |
| **OVH / autre VPS** | Vous installez .NET et exécutez l’API vous-même. | Abonnement VPS |

Pour un petit site type club, **Railway** ou **Fly.io** sont souvent les plus simples pour commencer (connexion GitHub, env pour `Admin:Login`, `Admin:Password`, `Admin:ApiKey`).

Sur ces hébergeurs, il faut :
- Déployer le **dossier `Api`** (projet .NET).
- Définir les variables d’environnement (Admin:Login, Admin:Password, Admin:ApiKey, etc.).
- Vérifier que le **dossier `uploads`** est persistant (selon l’offre) ou prévoir un volume/storage.

---

## Récap

1. **Front** : soit **GitHub Pages** (build avec `REACT_APP_API_URL` puis `yarn deploy` ou une Action), soit **Vercel** (connect repo + `REACT_APP_API_URL` dans les env) → **Vercel est souvent plus simple.**
2. **API** : à héberger **obligatoirement ailleurs** (Railway, Fly.io, Azure, VPS).
3. **Config** : CORS sur l’API = URL réelle du front (GitHub Pages ou Vercel). Front = `REACT_APP_API_URL` = URL réelle de l’API.

Si vous me dites si vous partez sur GitHub Pages ou Vercel pour le front, je peux détailler les étapes exactes (y compris un exemple de GitHub Action pour Pages ou la config Vercel).
