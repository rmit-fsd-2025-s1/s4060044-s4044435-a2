import express from 'express';
import { AppDataSource } from './data-source';
const app  = express();
const PORT = 5050;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Backend is working")
});

AppDataSource.initialize().then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Database connection failed:', error);
    });