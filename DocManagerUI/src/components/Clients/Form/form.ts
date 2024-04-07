import { ClientForm } from "../../../types/client"

export const getDefaultClientForm = () : ClientForm => {
    return {
          buyerName: "",
          buyerAddress: "",
          buyerCode: 0,
          vatCode:""
    };
}