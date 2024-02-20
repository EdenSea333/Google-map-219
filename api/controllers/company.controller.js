import Company from "../models/company.model.js";
import randomcolor from 'randomcolor';
import File from "../models/file.model.js"
import xlsx from 'xlsx';

export const readCompanyList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit; 
    
        const totalCompanies = await Company.countDocuments({}); 
    
        const totalPages = Math.ceil(totalCompanies / limit); 
        const companies = await Company.find({}).skip(skip).limit(limit); 
    
        res.status(200).json({ companies, page, totalPages }); 
      } catch (error) {
        next(error);
      }
}
function generateDistinctColors(totalColors) {
    const colors = [];
    const interval = Math.floor(0xffffff/totalColors);
  
    for (let i = 1; i < totalColors; i++) {
        const color = "#" + (interval * i).toString(16).padStart(6, "0");
        colors.push(color);
      }
    return colors;
  }


export const addCompany = async (req, res, next) => {
    try {
        const colors = generateDistinctColors(108);
        await File.findByIdAndUpdate(req.params.id, {
            $set:{
                status: "Added",
            }
        }, {new:true})
        const file = await File.findOne({_id:req.params.id});
        if(!file) {
            return res.status(404).send('File not found');
        }
        const workbook =xlsx.readFile(`./uploads/${file.filename}`);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const companies = [];
        let hubBorderColor = "";
        let hub = [];
        let j = 0;
        for (let i =1; i< excelData.length; i++) {
            const row = excelData[i];
            if(row[0]){
                hub = [];
                const color = colors[j];
                const borderColor=randomcolor();
                hubBorderColor = randomcolor();
                const newCompany = new Company({
                    company: row[0],
                    companyname: row[1],
                    title: row[2],
                    email: row[3],
                    employeecount: row[4],
                    website: row[5],
                    colocation: row[6],
                    address: row[7],
                    color: color,
                    bordercolor: hubBorderColor,
                    hubbordercolor: borderColor,
                    status: "Added",
                    hub: "yes",
                });
                hub.push(newCompany);
                j++;
                companies.push(newCompany);
            } else{
                const newCompany = new Company({
                    company: hub[0].company,
                    companyname: hub[0].companyname,
                    title: hub[0].title,
                    email: hub[0].email,
                    employeecount: hub[0].employeecount,
                    colocation: row[6],
                    address: row[7],
                    website: hub[0].website,
                    color: hub[0].color,
                    bordercolor: hubBorderColor,
                    status: "Added",
                });
                companies.push(newCompany);
            }
        }
        
        await Promise.all(companies.map((company) => company.save()));
    } catch (error) {
        next(error);
    }
    
}