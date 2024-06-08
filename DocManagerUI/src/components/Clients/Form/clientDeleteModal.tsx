import { useAuth } from "react-oidc-context";
import { useDeleteClient } from "../../../utils/apiService";
import { Alert, Button, Grid, Typography } from "@mui/material";
import { useEffect } from "react";

export const ClientDeleteModal = (props:{id:number, handleModalClose: () => void, updateClient : () => void}) => {
    const auth = useAuth();

    const deleteMutation = useDeleteClient(auth.user!.access_token, props.id);

    const deleteClient = () => {
        deleteMutation.mutate();
    }

    useEffect(() => {
        if (deleteMutation.isSuccess) {
          props.updateClient();
          props.handleModalClose();
        }
      }, [deleteMutation.isSuccess]);

    return(
        <Grid container gap={"1rem"}>
            <Grid container flexDirection={'column'} gap={"0.5rem"} width={"100%"} item>
                <Typography textAlign={"center"} color="text.secondary">
                    Are you sure you want to delete selected client?
                </Typography>
                <Alert variant="outlined" severity="warning">
                    Deleting the client will also remove any invoices associated with said client.
                </Alert>
            </Grid>
            <Grid container justifyContent={"space-evenly"} item>
                <Button variant="outlined" onClick={() => props.handleModalClose()}>No, Cancel</Button>
                <Button variant="contained" color="error" onClick={deleteClient}>Yes, I'm sure</Button>
            </Grid>
        </Grid>
    )

}