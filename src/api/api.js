import axios from "axios";

const api = axios.create({
  baseURL: "https://texter-glh1.onrender.com/api", // adjust if needed
  headers: {
    "Content-Type": "application/json",
  },
});     
            
export default api;   
         

   

      