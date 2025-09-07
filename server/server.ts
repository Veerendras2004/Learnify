import { app } from "./app";
require("dotenv").config();
import connectDB from "./utils/db"; // ✅ correct path

// Connect to MongoDB
connectDB();

// Start server
app.listen(process.env.PORT, () => {
  console.log(`✅ Server is connected with port ${process.env.PORT}`);
});
