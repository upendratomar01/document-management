import { TextFieldProps, TextField } from "@mui/material";
import { useField } from "formik";

type FormikTextFieldProps = TextFieldProps;

export const FormikTextField: React.FC<FormikTextFieldProps> = ({
  name,
  label,
  type = "text",
  ...props
}) => {
  const [field, meta] = useField(name);
  const isError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      {...field}
      label={label}
      type={type}
      fullWidth
      error={isError}
      helperText={isError ? meta.error : ""}
      {...props}
    />
  );
};
