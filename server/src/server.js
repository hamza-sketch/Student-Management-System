 
const express = require('express');
const  connectDB   = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const courseRoutes = require ('./routes/courseRoutes');
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const gradeRoutes = require("./routes/gradeRoutes");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher" , teacherRoutes);
app.use("/api/course" , courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api", attendanceRoutes);
app.use("/api", gradeRoutes);



// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// Start server AFTER DB connects
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}


startServer();