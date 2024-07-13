import { GridModal } from "./gridModal";

export const ErrorModal = (props: {
  message: string;
  open: boolean;
  handleModalClose: () => void;
  handleContentClose: () => void;
}) => {
  return (
    <GridModal
      isModalOpen={props.open}
      handleModalClose={props.handleModalClose}
      handleContentClose={props.handleContentClose}
      title={"Error Occured!"}
      modalContent={<div>{props.message}</div>}
    />
  );
};
