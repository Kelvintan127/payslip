import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('run cmd + click http://localhost:' + PORT + '/');
    console.log('Press Ctrl+C to quit.');
});