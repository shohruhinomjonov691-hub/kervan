import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDB(session);
// sessionlarni MongoDB ichida saqlash uchun ishlatiladi.
const store = new MongoDBStore({
  // MongoDBStore sessionlardi saqlaydigan joy
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1-ENTRANCE */
const app = express(); // app - maqsadliy Object (backend server qurish)
app.use(express.static(path.join(__dirname, "public"))); // Middleware DesignPattern > publicdi ochiqladi
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
// Middleware DP > Traditional API support backendda+frontend qurilayapti (ejs)
app.use(express.json());
// Middleware DP > REST API support Backend data olayapti va frontenddan qurayapti(js)-json
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser()); // Middleware DP > Cookieni Parser qilayapti (External package)
app.use(morgan(MORGAN_FORMAT)); // Middleware DP > Logging (External package)
// Morgan ozi function lekin natijasi Object
/** 2-SESSIONS */
// AUTHENTICATION(TAMG'A) vs AUTHORIZATION(TAMG'A + HUQUQ)
app.use(
  session({
    // set di browserdan va database dan izlaydi
    // qaysi birida yoq bolsa ummumiy login first deb chiqadi
    secret: String(process.env.SESSION_SECRET), // cookie ni xafsiz qilish
    cookie: {
      maxAge: 1000 * 3600 * 3, // 3soatdan keyin cookie ochadi
    },
    store: store, // MongoDB da saqlansin
    resave: true,
    rolling: true, // har kirgandan keyin 3 soat, odatda false qoyiladi DB ga yuklama bolmasligi uchun
    saveUninitialized: true,
    // odatda false chunki faqat login qilsa session yaratiladi falseda, trueda saytga kirsa yaratiladi
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/** 3-VIEWS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); // BSSR da ejs o'rqali

/** 4-ROUTERS */
app.use("/admin", routerAdmin); // BSSR: EJS
app.use("/", router); // SPA: REACT
// Middleware Design Pattern

export default app;
/*
BACKEND da oldi berdi Json formatda boladi
JSON -(JavaScript Object Notation)
commonly between a server and web applications.

PATTERNS > ARCHITECTURE & DeSIGN  
AUTHENTICATION/AUTHORIZATION > session vs token
FRONtEND DEVELOP > BSSR(EJS) va SPA(React)

API REQUEST >
  TYPE > Traditional API(ejs) | Rest API(json) | GraphQL API
  METHOD > GET | POST 
  STRUCTURE > header | body

VALIDATIONS >
 FRONTEND | 
 BACKEND | Module ichida shartga to'g'ri kelmasa
 DATABASE | > Databasedagi talabga to'g'ri kelmasa

*/
