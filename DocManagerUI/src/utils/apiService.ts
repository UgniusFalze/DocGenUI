import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ClientForm,  ClientGridRow,  ClientSelect } from "../types/client";
import { apiUrl, clientsUrl, invoicesUrl, userUrl } from "./apiUrl";
import axios from "axios";
import { Invoice, InvoiceForm } from "../types/invoice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { UserForm } from "../types/user";

const getClients = async (jwt: string): Promise<Array<ClientSelect>> => {
  const url = apiUrl + "/Client/select";
  return await axios
    .get<Array<ClientSelect>>(url, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((error) => Promise.reject(error));
};

const getClient = async (jwt:string, id: number) : Promise<ClientForm> => {
  const url = apiUrl + "/Client/" + id;
  return await axios
  .get<ClientForm>(url, {
    headers: {
      Authorization: "Bearer " + jwt,
    },
  })
  .then((result) => {
    return {
      ...result.data,
      vatCode: result.data.vatCode ?? ""
    }
  })
  .catch((error) => Promise.reject(error));
}

export const useGetGridClients = (jwt:string|undefined) => {
  return useQuery({
    queryKey:["gridClientQuery"],
    queryFn : () => {
      return axios.get<Array<ClientGridRow>>(clientsUrl, {
        headers:{
          Authorization: "Bearer " + jwt
        }
      }).then((result) => {
        return result.data;
      }).catch((error) => Promise.reject(error));
    }
  })
}

export const useClients = (jwt: string | undefined) => {
  return useQuery({
    queryKey: ["clientQuery"],
    queryFn: () => {
      if (jwt === undefined) {
        return [];
      } else {
        return getClients(jwt);
      }
    },
  });
};

export const useClient = (jwt:string|undefined, id: number) => {
  return useQuery({
    queryKey: ["clientView", id],
    queryFn: () => {
      if (jwt === undefined) {
        return undefined;
      } else {
        return getClient(jwt, id);
      }
    },
  });
}

export const useAddClient = (jwt: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientForm) => {
      return axios.post(clientsUrl, data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientQuery"] });
    },
    onError:(error) =>{
      console.error(error);
    }
  });
};

export const useEditClient = (jwt: string, id:number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data:ClientForm) => {
      return axios.put(clientsUrl + "/" + id, data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientQuery"] });
    },
    onError:(error) =>{
      console.error(error);
    }
  })
}

export const useAddPost = (jwt: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvoiceForm) => {
      dayjs.extend(utc);
      return axios.post(
        invoicesUrl,
        { ...data, invoiceDate: data.dateOfCreation.utc().format() },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoicesGrid"] });
      queryClient.invalidateQueries({ queryKey: ["latestSeriesNumber"] });
    },
    onError: (error) =>{
      console.error(error);
    }
  });
};

export const useGetSeriesNumber = (jwt: string) => {
  const url = invoicesUrl + "/last";
  return useQuery({
    queryKey: ["latestSeriesNumber"],
    queryFn: () => {
      return axios
        .get<number>(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => Promise.reject(error));
    },
  });
};

export const validUser = (jwt: string|undefined) => {
  const url = userUrl + "/valid";

  return axios
    .get<boolean>(url, {
      headers: {
        Authorization: "Bearer " + jwt,
      },
    })
    .then((result) => {
      return result.data;
    })
    .catch((error) => Promise.reject(error));
};

export const useAddUser = (jwt:string|undefined) => {
  return useMutation({
    mutationFn: (data: UserForm) => {
      return axios.post(
        userUrl,
        data,
        {
          headers:{
            Authorization: "Bearer " + jwt
          }
        }
      )
    },
  })
}

export const useGetInvoice = (jwt:string| undefined, invoiceId:string|undefined) => {
  const url = invoicesUrl + "/" + invoiceId;
  return useQuery({
    queryKey: ["invoice", invoiceId, jwt],
    queryFn: () => {
      return axios
        .get<Invoice>(url, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((result) => {
          const invoiceItems = result.data.products.map((product, index) => {
            return {
              ...product,
              invoiceItemId:index + 1
            }
          })
          return {
            ...result.data,
            products: invoiceItems
          };
        })
        .catch((error) => Promise.reject(error));
    },
  });
}