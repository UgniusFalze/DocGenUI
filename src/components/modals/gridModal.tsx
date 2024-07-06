import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

export const GridModal = (props: {
  isModalOpen: boolean;
  handleModalClose: () => void;
  handleContentClose: () => void;
  title: string | JSX.Element;
  modalContent: JSX.Element | null;
}) => {

  const handleCloseEvent = (event: object, reason: "backdropClick" | "escapeKeyDown") => {
    if(reason === "escapeKeyDown"){
      props.handleModalClose();
    }
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      onClose={handleCloseEvent}
      open={props.isModalOpen}
      TransitionProps={{
        onExited: () => props.handleContentClose()
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <IconButton
          aria-label="close"
          onClick={props.handleModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <GridCloseIcon />
        </IconButton>
      <DialogContent dividers>
        {props.modalContent}
      </DialogContent>
    </Dialog>
  );
};
``