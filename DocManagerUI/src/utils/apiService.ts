import { useMutation, useQuery } from "@tanstack/react-query"
import { ClientSelect } from "../types/client";
import { apiUrl } from "./apiUrl";
import axios from "axios";
import { InvoiceForm } from "../types/invoice";
import dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc"

const getClients = async (jwt: string):Promise<Array<ClientSelect>> =>{
    const url = apiUrl + "/api/Client";
    return await axios.get<Array<ClientSelect>>(url, {
        headers:{
            Authorization: "Bearer " + jwt
        }
    }).then((result) => {
        return result.data;
    }).catch((error) => Promise.reject(error));
}

export const useClients = (jwt:string|undefined) => {
    return useQuery({
        queryKey: ["clientQuery"],
        queryFn: () => {
            if(jwt === undefined){
                return [];
            }else{
                return getClients(jwt);
            }
        }
    })
}

export const addPost = (jwt: string) => {
    const url = apiUrl + "/api/Invoice";
    return useMutation({
        mutationFn: (data:InvoiceForm) => {
            dayjs.extend(utc);
            return axios.post(url, {...data,
            invoiceDate: data.dateOfCreation.utc().format()} , {
                headers:{
                    Authorization: "Bearer " + jwt
                }
            })
        }
    })
}