import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export const GridModal = (props: {
  isModalOpen: boolean;
  handleModalClose: () => void;
  handleContentClose: () => void;
  title: string | JSX.Element;
  modalContent: JSX.Element | null;
}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      onClose={props.handleModalClose}
      open={props.isModalOpen}
      TransitionProps={{
        onExited: () => props.handleContentClose()
      }}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        {props.modalContent}
      </DialogContent>
    </Dialog>
  );
};
