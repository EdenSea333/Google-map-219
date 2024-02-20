import mongoose from "mongoose";

const companyShema = mongoose.Schema(
  {
    company: {
        type: String,
    },
    companyname: {
      type: String,
    },
    title:{
      type: String
    },
    email: {
      type: String,
    },
    employeecount: {
        type: String,
    },
    website: {
        type: String,
    },
    colocation: {
        type:String,
    },
    address: {
        type: String,
    },
    status: {
      type: String,
      default: "Unadd"
    },
    color: {
        type: String,
    },
    bordercolor: {
      type: String,
    },
    hubbordercolor: {
      type: String,
    },
    hub: {
      type: String,
      default: "no",
        }
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companyShema);

export default Company;