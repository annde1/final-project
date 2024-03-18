import { readFileSync } from "fs";
import { Blob } from "buffer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Request } from "express";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "zen-fit-app.firebaseapp.com",
  projectId: "zen-fit-app",
  storageBucket: "zen-fit-app.appspot.com",
  messagingSenderId: "213953626108",
  appId: "1:213953626108:web:8349d7a7937d5086727c79",
  measurementId: "G-YTWLWEVMKV",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadToFirebase = async function (
  req: Request,
  firebaseUploadPath: string
): Promise<string> {
  if (!req.file) {
    return "";
  }

  const firebaseFilePath = `images/${firebaseUploadPath}/${req.file.filename}`;
  const storageRef = ref(storage, firebaseFilePath);
  const buffer = readFileSync(req.file.path);
  const blob = new Blob([buffer]);

  await uploadBytes(storageRef, blob, {
    contentType: req.file.mimetype,
  });

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export { uploadToFirebase };
