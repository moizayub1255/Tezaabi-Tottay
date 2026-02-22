import mongoose from "mongoose";

const contentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  accessLevel: {
    type: String,
    enum: ["movie", "tv_show", "premium"],
    required: true,
  },
  // Add other fields as needed (e.g., image, releaseDate, etc.)
});

const Content = mongoose.model("Content", contentSchema);
export default Content;
