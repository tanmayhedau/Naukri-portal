const express = require("express");
const { default: mongoose } = require("mongoose");
const route = require("./routes/routes");
const mutler = require("multer");
const app = express();

app.use(express.json());
app.use(mutler().any());
mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://tannmayhedau619:Tanmay%40619@cluster0.fw1xhuw.mongodb.net/job-board",
    { useNewUrlParser: true }
  )
  .then(() => console.log("mongodb is connected"))
  .catch((error) => console.log(error));

app.use("/", route);
app.listen(3000, () => console.log("express app is running on 3000"));
