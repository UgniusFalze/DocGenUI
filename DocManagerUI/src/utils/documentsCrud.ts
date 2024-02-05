import axios from "axios";
import { Invoice } from "../types/invoice";

export const HandleDownload = async (invoice: Invoice) => {
  const url = "https://localhost:7256";
  await axios
    .post(url + "/api/PdfDocument/downloadFile", invoice, {
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
