import { Card, CardContent, Typography } from "@mui/material";

export const InvoiceCard = (props: {
  cardTitle: string;
  mainData: string|undefined;
  subTitle: string|undefined;
}) => {
  return (
    <Card variant="outlined" sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.cardTitle}
        </Typography>
        <Typography variant="h4" component="div">
          {props.mainData}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.subTitle}
        </Typography>
      </CardContent>
    </Card>
  );
};
