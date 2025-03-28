const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const jobCircularSchema = new mongoose.Schema({
  title: String,
  postDate: Date,
  deadline: Date,
  location: [String],
  formURL: String,
  excelURL: String,
  status: String,
  availability: Boolean,
});

const JobCircular = mongoose.model("jobcircular", jobCircularSchema);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.post("/postjob", async (req, res) => {
  const { title, location, deadline, form, excel } = req.body;
  try {
    const job = new JobCircular({
      title,
      postDate: new Date(),
      deadline,
      location,
      formURL: form,
      excelURL: excel,
      status: "Pending",
      availability: true,
    });
    await job.save();
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
    });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to post job",
      error: error.message,
    });
  }
});
// get only available job
app.get("/getavailablejobs", async (req, res) => {
  try {
    const jobs = await JobCircular.find({ availability: true });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error getting available jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get available jobs",
      error: error.message,
    });
  }
});
// update availability of job

app.put("/updateavailability", async (req, res) => {
  const { id, availability } = req.body;
  try {
    await JobCircular.findByIdAndUpdate(id, { availability });
    res.status(200).json({
      success: true,
      message: "Job availability updated successfully",
    });
  } catch (error) {
    console.error("Error updating job availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job availability",
      error: error.message,
    });
  }
});
// update job details
app.put("/updatejob", async (req, res) => {
  const { id, title, deadline, location, status, form, excel } = req.body;
  console.log(req.body);
  try {
    await JobCircular.findByIdAndUpdate(id, {
      title,
      location,
      applicationDeadline: deadline,
      formURL: form,
      excelURL: excel,
      status,
    });
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
});
// delete job
app.delete("/deletejob", async (req, res) => {
  const { _id } = req.body;
  try {
    await JobCircular.findByIdAndDelete(_id);
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
});
// get all jobs
app.get("/getjobs", async (req, res) => {
  try {
    const jobs = await JobCircular.find();
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get jobs",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
