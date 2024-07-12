import { useEffect, useState } from "react";
import { QueryResponse } from "../types/queryResponse";
import { SuccessToast } from "./toasts/SuccessToast";
import { ErrorToast } from "./toasts/ErrorToast";

export const ResponseToast = (props: { response: QueryResponse | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (props.response) {
      setIsOpen(true);
      setIsError(!props.response.success);
    } else {
      setIsOpen(false);
    }
  }, [props.response]);

  return isError ? (
    <ErrorToast
      open={isOpen}
      message={props?.response?.error ?? null}
      onClose={() => setIsOpen(false)}
    />
  ) : (
    <SuccessToast open={isOpen} onClose={() => setIsOpen(false)} />
  );
};
