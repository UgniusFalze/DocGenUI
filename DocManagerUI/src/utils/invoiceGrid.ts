import axios from "axios";
import { InvoiceGridRow } from "../types/invoiceGridRow";
import { apiUrl } from "./apiUrl";

export const GetGrid = async (jwt: string):Promise<Array<InvoiceGridRow>> =>{
    const url = apiUrl + "/api/Invoice";
    return await axios.get<Array<InvoiceGridRow>>(url, {
        headers:{
            Authorization: "Bearer " + jwt
        }
    }).then((result) => {
        return result.data;
    }).catch((error) => Promise.reject(error));
}