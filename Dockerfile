# Utiliser une image Node.js officielle comme image de base
FROM node:18-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le répertoire de travail
COPY package.json yarn.lock ./

# Installer les dépendances de l'application
# RUN npm install -g yarn
RUN yarn install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construire l'application pour la production
RUN yarn build

# Utiliser une image Nginx officielle pour servir le contenu
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port sur lequel l'application sera disponible
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
