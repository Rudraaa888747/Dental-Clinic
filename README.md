# Azure Smiles Dental Clinic

Everything is now consolidated into one app folder: [app](/D:/newwww/Clinic/app)

Inside `app` you now have:

- React frontend files
- Express backend files
- shared runtime setup for one integrated app

## Root keys file

Use the root [.env](/D:/newwww/Clinic/.env) file and paste your real values there.

Required keys:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional:

- `PORT`

## Commands

```bash
npm install
npm run dev
npm run build
npm start
```

## Notes

- `npm run dev` starts both frontend and backend.
- `npm run build` builds the frontend into `app/dist`.
- `npm start` runs the Express server and serves both the API and the built frontend.
- If MongoDB is unavailable, the app still works in demo fallback mode for public browsing, appointments, inquiries, and admin editing.
