import { useAuth } from "react-oidc-context";
import { useDeleteInvoice } from "../../../utils/apiService";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";

export const InvoiceDeleteModal = (props:{id:number, handleModalClose: () => void, updateInvoices : () => void}) => {
    const auth = useAuth();

    const deleteMutation = useDeleteInvoice(auth.user!.access_token, props.id);

    const deleteClient = () => {
        deleteMutation.mutate();
    }

    useEffect(() => {
        if (deleteMutation.isSuccess) {
          props.updateInvoices();
          props.handleModalClose();
        }
      }, [deleteMutation.isSuccess]);

    return(
        <Grid container gap={"1rem"}>
            <Grid container flexDirection={'column'} gap={"0.5rem"} width={"100%"} item>
                <Typography textAlign={"center"} color="text.secondary">
                    Are you sure you want to delete selected invoice?
                </Typography>
            </Grid>
            <Grid container justifyContent={"space-evenly"} item>
                <Button variant="outlined" onClick={() => props.handleModalClose()}>No, Cancel</Button>
                <Button variant="contained" color="error" onClick={deleteClient}>Yes, I'm sure</Button>
            </Grid>
        </Grid>
    )

}