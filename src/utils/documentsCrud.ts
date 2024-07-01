import axios from "axios";
import { apiUrl } from "./apiUrl";

export const HandleDownload = async (invoiceId: number, jwt: string) => {
  await createFileObjectUrl(invoiceId, jwt).then((url) => {
    const filename = "document.pdf";
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });
};

export const createFileObjectUrl = async (invoiceId: number|string|undefined, jwt: string) => {
  return await DownloadFile(invoiceId, jwt).then((data) => {
    const url = window.URL.createObjectURL(
      new Blob([data], {
        type: "application/pdf",
      })
    );
    return url;
  });
}

const DownloadFile = async (invoiceId: number|string|undefined, jwt: string|undefined) => {
  return axios
    .get(apiUrl + "/PdfDocument/downloadFile", {
      params: {
        invoiceId: invoiceId,
      },
      headers: {
        Authorization: "Bearer " + jwt,
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};
