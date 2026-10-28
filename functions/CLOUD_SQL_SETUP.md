# Cloud SQL setup

The backend now uses PostgreSQL as the source of truth for users, communities, memberships, invites, channels, and papers. Firebase Authentication remains the identity provider; callable functions use the Firebase ID token to authorize PostgreSQL operations.

## 1. Create the database

In the Cloud SQL instance, create a database named `campus_channels` and a dedicated user. Do not use the instance root user from the application.

Set the connection values in an uncommitted `functions/.env` file:

```env
PGHOST=YOUR_CLOUD_SQL_PUBLIC_IP
PGPORT=5432
PGUSER=campus_channels_app
PGPASSWORD=YOUR_DATABASE_PASSWORD
PGDATABASE=campus_channels
PGSSL=true
```

`DATABASE_URL` can be used instead of the `PG*` variables. Never commit `functions/.env`.

## 2. Apply the schema

From the repository root:

```powershell
npm run migrate --prefix functions
```

The migration applies `functions/sql/001_initial_schema.sql` and is safe to run again because it uses `IF NOT EXISTS`.

## 3. Allow the deployed functions to connect

For a public-IP connection, add the deployed Cloud Functions egress IP range to the Cloud SQL authorized networks and require SSL. For production, prefer a private IP/VPC connector or the Cloud SQL Auth Proxy/Connector rather than opening PostgreSQL broadly.

Deploy after the database is reachable:

```powershell
firebase deploy --only functions
```

The application still needs Firebase Authentication enabled for Email/Password and Google. Cloud SQL stores application data; Firebase Authentication stores credentials and issues the ID tokens used by the backend.
