import { Alert, IconButton, Snackbar } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

export const SuccessToast = (props: { open: boolean, onClose: () => void }) => {
    return (
        <Snackbar open={props.open} autoHideDuration={2000} onClose={props.onClose}>
            <Alert
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Succesfully saved!
                <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={props.onClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Alert>

        </Snackbar>
    )
}