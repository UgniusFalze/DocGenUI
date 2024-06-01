import { Alert, Snackbar } from "@mui/material"

export const ErrorToast = (props:{open:boolean}) => {
    return(
        <Snackbar open={props.open} autoHideDuration={5000}>
            <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Internal server error has occured!
            </Alert>
        </Snackbar>
    )
}