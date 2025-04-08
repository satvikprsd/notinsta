import DataURIParser from "datauri/parser.js";
import path from "path";

const parser = new DataURIParser();
const getDataUri = (file) =>{
    const ext = path.extname(file.originalname).toString().toLowerCase();
    return parser.format(ext, file.buffer).content;
}

export default getDataUri;