import axios from "axios";
import { Invoice } from "../types/invoice";
import { apiUrl } from "./apiUrl";

export const HandleDownload = async (invoiceId: number, jwt: string) => {
  const url = apiUrl;
  await axios
    .get(url + "/PdfDocument/downloadFile", {
      params: {
        invoiceId: invoiceId,
      },
      headers: {
        Authorization: "Bearer " + jwt,
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );
      let filename = "document.pdf";
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
};
