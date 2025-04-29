import { TextField, MenuItem } from "@mui/material";
import { useField } from "formik";

interface FormikSelectProps {
  name: string;
  label: string;
  options: { label: string; value: string | number }[];
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  name,
  label,
  options,
}) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      select
      {...field}
      label={label}
      fullWidth
      error={isError}
      helperText={isError ? meta.error : ""}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
