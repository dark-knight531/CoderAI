import dotenv from "dotenv";
import connectDB from "./config/db.js"; 
import { app } from "./src/app.js"; 


dotenv.config({
    path: './.env'
});


connectDB()
    .then(() => {
        
        app.on("error", (error) => {
            console.error("🔥 Express encountered a critical error: ", error);
            throw error;
        });

        const PORT = process.env.PORT || 8000;
        
        app.listen(PORT, () => {
            console.log(`  Server is running successfully at port: ${PORT}`);
            console.log(` AI Code Reviewer Backend is ready to accept requests!`);
        });
    })
    .catch((err) => {
        console.error(" MongoDB connection failed. Server boot aborted.", err);
        process.exit(1); 
    });