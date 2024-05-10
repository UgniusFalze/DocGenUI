import { getApiUrl } from "./envProvider";

export const apiUrl = getApiUrl();
export const invoicesUrl = apiUrl + "/Invoice";
export const clientsUrl = apiUrl+"/Client";
export const userUrl = apiUrl + "/User";