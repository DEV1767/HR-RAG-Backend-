import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        employeeIds: [
            {
                type: String,
                trim: true,
            },
        ],
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            select:false
        }
    },
    {
        timestamps: true,
    }
);

const Company = mongoose.model("Company", companySchema);

export default Company;

#added