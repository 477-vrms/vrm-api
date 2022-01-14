# Api Gateway for VRMS Project

This programs currently runs on Google Cloud!

### Prerequisite
1. Google Cloud Service Account. In addition, the Google Calendar API enabled for Project.
2. Firebase Admin Account attached to Google Cloud (Firebase is the Database of Choice)

### Running the Program
Setting the environment variables
```text
GOOGLE_APPLICATION_CREDENTIALS=[LOCATION OF GOOGLE KEY FILE]
ENV=[Environment Name]
```

Local Development
```bash
$ npm install
$ npm run dev
```

Production
```bash
$ npm install
$ npm run build
$ npm run start
```
