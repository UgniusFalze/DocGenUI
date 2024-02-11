import { Control, Controller, useFieldArray } from "react-hook-form";
import { InvoiceForm } from "../../../../types/invoice";
import { useState } from "react";
import {
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

export const InvoiceItemInput = (props: {
  control: Control<InvoiceForm, any, InvoiceForm>;
}) => {
  const [numberOfItems, setNumberOfItems] = useState(1);

  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: "items",
  });

  const onAdd = () => {
    append({
      name: "",
      unitOfMeasurement: "vnt",
      units: 0,
      priceOfUnit: 0,
    });
  };

  const onRemove = () => {
    remove(fields.length - 1);
  }

  return (
    <Stack
      sx={{ width: "100%" }}
      direction="column"
      spacing={2}
    >
      {fields.map((item, index) => (
        <Stack key={item.id} spacing={2} direction="column" sx={{border:1, borderRadius:1, p:2}}>
          <Controller
            render={({ field }) => (
              <FormControl>
                <TextField
                  {...field}
                  label="Product's or service's name"
                  variant="outlined"
                  fullWidth
                />
              </FormControl>
            )}
            name={`items.${index}.name` as const}
            control={props.control}
          />
          <Stack direction="row" spacing={2}>
            <Controller
              render={({ field }) => (
                <FormControl>
                  <TextField
                    {...field}
                    label="Measured in"
                    variant="outlined"
                  />
                </FormControl>
              )}
              name={`items.${index}.unitOfMeasurement` as const}
              control={props.control}
            />
            <Controller
              render={({ field }) => (
                <FormControl>
                  <TextField {...field} label="Quantity" variant="outlined" />
                </FormControl>
              )}
              name={`items.${index}.units` as const}
              control={props.control}
            />
            <Controller
              render={({ field }) => (
                <FormControl>
                  <TextField {...field} label="Price" variant="outlined" />
                </FormControl>
              )}
              name={`items.${index}.priceOfUnit` as const}
              control={props.control}
            />
          </Stack>
        </Stack>
      ))}
      <Stack sx={{ width: "100%", justifyContent:fields.length > 1 ? "space-between":"flex-end" }} direction="row">
        {fields.length > 1 ? <IconButton onClick={onRemove}><RemoveCircle/></IconButton> : null}
        <IconButton sx={{ width: "min-content" }} onClick={onAdd}>
          <AddCircle />
        </IconButton>
      </Stack>
    </Stack>
  );
};
