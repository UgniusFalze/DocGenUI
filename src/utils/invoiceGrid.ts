import axios from "axios";
import { apiUrl } from "./apiUrl";
import { InvoiceGrid } from "../types/invoice";

export const GetGrid = async (jwt: string): Promise<InvoiceGrid> => {
    const url = apiUrl + "/Invoice";
    return await axios.get<InvoiceGrid>(url, {
        headers:{
            Authorization: "Bearer " + jwt
        }
    }).then((result) => {
        return result.data;
    }).catch((error) => Promise.reject(error));
}