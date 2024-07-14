import { useEffect, useState } from "react";
import { QueryResponse } from "../types/queryResponse";
import { SuccessToast } from "./toasts/SuccessToast";
import { ErrorToast } from "./toasts/ErrorToast";
import { ErrorModal } from "./modals/errorModal";

export const ResponseToast = (props: {
  response: QueryResponse | null;
  clearResponse: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUserError, setIsUserError] = useState(false);
  useEffect(() => {
    if (props.response) {
      setIsOpen(true);
      setIsError(!props.response.success);
      setIsUserError(props.response.isUserError);
    } else {
      setIsOpen(false);
    }
  }, [props.response]);

  return isError ? (
    isUserError ? (
      <ErrorToast
        open={isOpen}
        message={props?.response?.error ?? null}
        onClose={() => {
          props.clearResponse();
          setIsOpen(false);
        }}
      />
    ) : (
      <ErrorModal
        message={props?.response?.error ?? "Server Error"}
        open={isOpen}
        handleModalClose={() => setIsOpen(false)}
        handleContentClose={props.clearResponse}
      />
    )
  ) : (
    <SuccessToast
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
        props.clearResponse();
      }}
    />
  );
};
