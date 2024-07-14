import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ClientForm, ClientGridRow, ClientSelect } from "../types/client";
import { apiUrl, clientsUrl, invoicesUrl, userUrl } from "./apiUrl";
import axios, { AxiosError } from "axios";
import { Invoice, InvoiceForm, InvoiceGrid } from "../types/invoice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { UserForm, UserProfile } from "../types/user";
import { InvoicePostItem } from "../types/invoiceItem";
import { GridQueryOptions } from "../types/gridQueryOptions";

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

const getClient = async (jwt: string, id: number): Promise<ClientForm> => {
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
        vatCode: result.data.vatCode ?? "",
      };
    })
    .catch((error) => Promise.reject(error));
};

export const useGetGridClients = (
  jwt: string | undefined,
  queryOptions: GridQueryOptions,
) => {
  let params = {};
  if (queryOptions.paging) {
    params = {
      ...params,
      page: queryOptions.paging.page,
    };
  }

  if (queryOptions.searching?.quickFilterValues) {
    params = {
      ...params,
      search: queryOptions.searching.quickFilterValues?.join(" "),
    };
  }
  return useQuery({
    queryKey: ["gridClientQuery", params],
    queryFn: () => {
      return axios
        .get<Array<ClientGridRow>>(clientsUrl, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
          params: params,
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => Promise.reject(error));
    },
    placeholderData: keepPreviousData,
  });
};

export const useCountGridClients = (jwt: string | undefined) => {
  return useQuery({
    queryKey: ["clientGridCount"],
    queryFn: () => {
      return axios
        .get<number>(clientsUrl + "/count", {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => Promise.reject(error));
    },
    placeholderData: keepPreviousData,
  });
};

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

export const useClient = (jwt: string | undefined, id: number) => {
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
};

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
    onError: (error: AxiosError) => {
      Promise.reject(error.response?.data);
    },
  });
};

export const useEditClient = (jwt: string, id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientForm) => {
      return axios.put(clientsUrl + "/" + id, data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientQuery"] });
    },
  });
};

export const useDeleteClient = (jwt: string, id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return axios.delete(clientsUrl + "/" + id, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientQuery"] });
    },
    onError: (error: AxiosError) => {
      Promise.reject(error.response?.data);
    },
  });
};

export const useDeleteInvoice = (jwt: string, id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return axios.delete(invoicesUrl + "/" + id, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoicesGrid"] });
    },
  });
};

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
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoicesGrid"] });
      queryClient.invalidateQueries({ queryKey: ["latestSeriesNumber"] });
    },
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

export const validUser = (jwt: string | undefined) => {
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

export const useAddUser = (jwt: string | undefined) => {
  return useMutation({
    mutationFn: (data: UserForm) => {
      return axios.post(userUrl, data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
  });
};

export const useGetInvoice = (
  jwt: string | undefined,
  invoiceId: string | undefined,
) => {
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
              realId: product.invoiceItemId,
              invoiceItemId: index + 1,
            };
          });
          return {
            ...result.data,
            products: invoiceItems,
          };
        })
        .catch((error) => Promise.reject(error));
    },
  });
};

export const useUserProfile = (jwt: string | undefined) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => {
      return axios
        .get<UserProfile>(userUrl, {
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

export const useEditUser = (jwt: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserForm) => {
      return axios.put(userUrl, data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};

export const useAddInvoiceItem = (
  jwt: string | undefined,
  invoiceId: number | null | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InvoicePostItem) => {
      return axios.post(invoicesUrl + "/" + invoiceId + "/addItem", data, {
        headers: {
          Authorization: "Bearer " + jwt,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId, jwt] });
    },
  });
};

export const useSetInvoicePayed = (
  jwt: string | undefined,
  invoiceId: number | null | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: boolean) => {
      return axios.post(
        invoicesUrl + "/" + invoiceId + "/setPayed",
        { isPayed: data },
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId, jwt] });
    },
  });
};

export const useDeleteInvoiceItem = (
  jwt: string | undefined,
  invoiceId: number | null | undefined,
  invoiceItemId: number | null | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      return axios.delete(
        invoicesUrl + "/" + invoiceId + "/deleteItem/" + invoiceItemId,
        {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId, jwt] });
    },
  });
};

export const useGetInvoicesGrid = (jwt: string | undefined, page: number) => {
  return useQuery({
    queryKey: ["invoicesGrid", page],
    queryFn: () => {
      return axios
        .get<InvoiceGrid>(invoicesUrl, {
          headers: {
            Authorization: "Bearer " + jwt,
          },
          params: {
            page: page,
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => Promise.reject(error));
    },
    placeholderData: keepPreviousData,
  });
};

export const useCountGridInvoices = (jwt: string | undefined) => {
  return useQuery({
    queryKey: ["invoicesGridCount"],
    queryFn: () => {
      return axios
        .get<number>(invoicesUrl + "/count", {
          headers: {
            Authorization: "Bearer " + jwt,
          },
        })
        .then((result) => {
          return result.data;
        })
        .catch((error) => Promise.reject(error));
    },
    placeholderData: keepPreviousData,
  });
};
