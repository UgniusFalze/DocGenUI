import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ClientSelect } from "../types/client";
import { apiUrl, invoicesUrl } from "./apiUrl";
import axios from "axios";
import { InvoiceForm } from "../types/invoice";
import dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc"

const getClients = async (jwt: string):Promise<Array<ClientSelect>> =>{
    const url = apiUrl + "/Client";
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data:InvoiceForm) => {
            dayjs.extend(utc);
            return axios.post(invoicesUrl, {...data,
            invoiceDate: data.dateOfCreation.utc().format()} , {
                headers:{
                    Authorization: "Bearer " + jwt
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["invoicesGrid"]})
            queryClient.invalidateQueries({queryKey:['latestSeriesNumber']});
        }
    })
}

export const getSeriesNumber = (jwt:string) => {
    const url = invoicesUrl + "/last";
    return useQuery({
        queryKey: ["latestSeriesNumber"],
        queryFn: () => {
            return axios.get<number>(url, {
                headers: {
                    Authorization: "Bearer " + jwt
                }
            }).then((result) => {
                return result.data;
            }).catch((error) => Promise.reject(error))
        }
    })
}