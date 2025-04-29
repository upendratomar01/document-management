import { FormikConfig, FormikHelpers } from "formik";

export interface ModalFormProps<T> {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialValues: T;
  validationSchema?: FormikConfig<T>["validationSchema"];
  onSubmit: (
    values: T,
    formikHelpers: FormikHelpers<T>,
  ) => void | Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
}
