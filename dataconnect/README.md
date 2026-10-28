# Firebase SQL Connect

This directory targets the Firebase SQL Connect service shown in the Firebase
console:

- Service: `chatup-23449-service`
- Location: `us-east4`
- Cloud SQL instance: `chatup-23449-instance`

The schema and connector operations are intentionally checked in so the
Firebase CLI or SQL Connect VS Code extension can validate and generate the
typed JavaScript SDK into `src/dataconnect-generated`.

The schema follows the model currently shown in the Firebase console. SQL
Connect supplies implicit IDs for these tables. Firebase Authentication users
are linked to application records through their email address because this
schema does not contain a Firebase Auth UID field.

Do not commit generated credentials or database passwords. After installing
and authenticating the Firebase CLI, validate and deploy with the SQL Connect
commands provided by the CLI for this project. The existing Cloud Functions
still use the direct PostgreSQL pool until the generated connector SDK has
been produced and the operations have been verified against the provisioned
database schema.
