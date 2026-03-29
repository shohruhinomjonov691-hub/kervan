import dotenv from "dotenv"; // External package
dotenv.config(); // dotenv - maqsadli object,

import mongoose from "mongoose"; // External package
import app from "./app"; //

// TCP(Transmission Control Protocol) vs HTTP(HyperText Transfer Protocol)
// TCP — bir marta ulanadi, keyin ishlayveradi
// HTTP — har requestda alohida so‘rov
mongoose // Object , Call qismi,
  // 1 - Databasedi ishga tushirib olamiz chunki
  // Oshxona misolida birinchi omborhona(sklad) bilan bo'g'lash kerak
  .connect(process.env.MONGO_URL as string, {}) // Async method then va catch (qisqa vaqt talab qiladi)
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003; //
    app.listen(PORT, function () {
      console.info(`The server is running successfully on port: ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("ERROR on connection MongoDB", err));
