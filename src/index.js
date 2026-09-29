import app from "./app";
import dotenv from "dotenv";
import connectDb from "./db";

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 8000;

connectDb()
  .then(()=>{
     app.listen(PORT,()=>{
        console.log(`Server is running on port http:localhos${PORT}`)
     })
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exist(1);
  });

