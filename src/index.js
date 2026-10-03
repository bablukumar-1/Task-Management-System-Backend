import app from "./app.js";
import dotenv from "dotenv";
import connectDb from "./db/index.js";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;

connectDb()
  .then(()=>{
     app.listen(PORT,()=>{
        console.log(`Server is running on port http://localhos:${PORT}`)
     })
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exit(1);
  });

