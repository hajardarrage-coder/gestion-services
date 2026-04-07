# gestion-services
application web de gestion des services des statistiques

## Nouveaux services

- `secure-api/` : microservice Node/Express pour l'envoi d'emails (Gmail SMTP) et la réinitialisation de mot de passe par code.
  - Dupliquer `secure-api/.env.example` en `.env`, renseigner les variables Gmail + DB.
  - Lancer `npm install && npm run dev` dans `secure-api`.
