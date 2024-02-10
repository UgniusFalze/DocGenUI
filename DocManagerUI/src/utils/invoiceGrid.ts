import axios from "axios";
import { apiUrl } from "./apiUrl";
import { InvoiceGridRow } from "../types/invoice";

export const GetGrid = async (jwt: string):Promise<Array<InvoiceGridRow>> =>{
    const url = apiUrl + "/Invoice";
    return await axios.get<Array<InvoiceGridRow>>(url, {
        headers:{
            Authorization: "Bearer " + jwt
        }
    }).then((result) => {
        return result.data;
    }).catch((error) => Promise.reject(error));
}