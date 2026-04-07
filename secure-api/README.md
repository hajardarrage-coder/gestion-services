# Secure API (Node/Express)

Microservice for real email delivery (Gmail SMTP) and password reset codes.

## Quick start

```bash
cd secure-api
cp .env.example .env
# Fill Gmail app password + recipients + DB access
npm install
npm run dev   # or npm start
```

The service listens on `PORT` (default 4000).

## Env reference

- `SMTP_USER` / `SMTP_PASS`: Gmail address + app password.
- `PRESIDENT_EMAIL`, `SERVICE_EMAIL`: fixed recipients allowed by `/send-email`.
- `DB_*`: Same MySQL database used by the Laravel app (`users`, `password_reset_otps` tables).
- `RESET_CODE_TTL_MINUTES`: validity of reset code (default 10).
- `ALLOWED_ORIGINS`: comma separated list of front-end URLs.

## Routes

- `POST /send-email` → `{ recipient: "president"|"service", subject, body, attachments? }`
- `POST /reset-password-request` → `{ email }`
- `POST /reset-password` → `{ email, code, password }`
