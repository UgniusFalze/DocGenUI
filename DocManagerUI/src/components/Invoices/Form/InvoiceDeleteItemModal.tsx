import { useAuth } from "react-oidc-context";
import { useDeleteInvoiceItem } from "../../../utils/apiService";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";

export const InvoiceItemDeleteModal = (props:{invoiceId:number, invoiceItemId: number, handleModalClose: () => void, updateInvoice : (success: boolean) => void}) => {
    const auth = useAuth();

    const deleteMutation = useDeleteInvoiceItem(auth.user!.access_token, props.invoiceId, props.invoiceItemId);

    const deleteClient = () => {
        deleteMutation.mutate();
    }

    useEffect(() => {
        if (deleteMutation.isSuccess) {
          props.updateInvoice(true);
          props.handleModalClose();
        }
      }, [deleteMutation.isSuccess]);

    return(
        <Grid container gap={"1rem"}>
            <Grid container flexDirection={'column'} gap={"0.5rem"} width={"100%"} item>
                <Typography textAlign={"center"} color="text.secondary">
                    Are you sure you want to delete selected invoice item?
                </Typography>
            </Grid>
            <Grid container justifyContent={"space-evenly"} item>
                <Button variant="outlined" onClick={() => props.handleModalClose()}>No, Cancel</Button>
                <Button variant="contained" color="error" onClick={deleteClient}>Yes, I'm sure</Button>
            </Grid>
        </Grid>
    )

}