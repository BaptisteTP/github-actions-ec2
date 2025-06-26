# Étape 1 : build Next.js
FROM node:18 AS build

WORKDIR /app
COPY . .

# Désactive ESLint si besoin
ENV NEXT_DISABLE_ESLINT true

RUN npm install
RUN npm run build
RUN npm run export  # Important ! pour générer le dossier "out"

# Étape 2 : serve avec nginx
FROM nginx:alpine

COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
