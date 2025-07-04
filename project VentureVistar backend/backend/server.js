require("dotenv").config();
const express = require("express");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require('./routes/auth');
const startupRoutes = require('./routes/startup');
const announcementRoutes = require('./routes/announcement');
const investorRoutes = require('./routes/investor');
const investorDashboardRoutes = require('./routes/investorRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const startupPublicRoutes = require('./routes/startupRoutes');
const { connectDB } = require("./config/db");
const cors = require("cors");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
});

// Register routes
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/startup', startupRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/investors', investorRoutes);  // For investor suggestions
app.use('/api/investor', investorDashboardRoutes);  // For investor dashboard
app.use('/api/connections', connectionRoutes);  // For connection requests
app.use('/api/startups', startupPublicRoutes);  // For public startup endpoints

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
