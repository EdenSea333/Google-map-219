import mongoose from "mongoose";

const fileShema = mongoose.Schema(
  {
    filename: {
      type: String,
      required: true
    },
    originalname: {
      type: String,
      requried: true  
    },
    content:{
        type: Buffer,
    },
    status: {
      type: String,
      default: "Unread"
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileShema);

export default File;