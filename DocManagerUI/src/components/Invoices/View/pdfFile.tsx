export const PdfFile = (props: { data: string }) => {
  return (
    <iframe
      src={props.data}
      width="100%"
      height="100%"
      loading="lazy"
      title="PDF-file"
    ></iframe>
  );
};
