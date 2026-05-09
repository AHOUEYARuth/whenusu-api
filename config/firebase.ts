import admin from "firebase-admin";
import app from "@adonisjs/core/services/app";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(app.configPath("firebase/service-account.json"), "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;