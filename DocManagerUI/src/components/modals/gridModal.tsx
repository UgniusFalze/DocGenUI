import { Dialog, DialogContent, DialogTitle } from "@mui/material";

export const GridModal = (props: {
  isModalOpen: boolean;
  handleModalClose: () => void;
  title: string;
  modalContent: JSX.Element | null;
}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={props.isModalOpen}
      onClose={props.handleModalClose}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        {props.modalContent}
      </DialogContent>
    </Dialog>
  );
};
