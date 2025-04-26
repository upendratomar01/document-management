"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Card } from "@/components/Card";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../services/authApi";
import { SigninCreds, SignupCreds } from "../types";

// Styled container for the page layout
const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc(100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

type AuthPageProps = {
  isLogin?: boolean;
};

export default function AuthPage({ isLogin }: AuthPageProps) {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    severity: "error" | "success";
    message: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  // Validation schema using Yup
  const authValidationSchema = Yup.object({
    name: !isLogin
      ? Yup.string().required("Name is required.")
      : Yup.string().notRequired(),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Email is required."),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long.")
      .required("Password is required."),
  });

  const handleLogin = async (data: SigninCreds) => {
    const res = await loginUser(data);
    if (res?.ok) {
      formik.resetForm();
      router.push(ROUTES.HOME);
    }
    if (res?.error) {
      setAlert({
        severity: "error",
        message: res.error,
      });
    }
  };

  const handleRegister = async (data: SignupCreds) => {
    const res = await registerUser(data);
    if (res?.error) {
      setAlert({
        severity: "error",
        message: res.error,
      });
    }
    if (res?.ok) {
      setAlert({
        severity: "success",
        message: "Signup successful! Please login.",
      });
      formik.resetForm();
    }
  };

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      allowExtraEmails: false,
    },

    validationSchema: authValidationSchema,
    onSubmit: async (values) => {
      setAlert(null);
      const submissionData = {
        email: values.email,
        password: values.password,
        name: values.name,
        allowExtraEmails: values.allowExtraEmails,
      };
      try {
        setLoading(true);
        if (isLogin) {
          handleLogin(submissionData as SigninCreds);
        } else {
          handleRegister(submissionData as SignupCreds);
        }
      } catch (err) {
        console.log("Login error", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {isLogin ? "Sign in" : "Sign up"}
        </Typography>
        {alert && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Box
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {!isLogin && (
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </FormControl>
          )}
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="******"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </FormControl>
          {!isLogin && (
            <FormControlLabel
              label="I want to receive updates via email."
              control={
                <Checkbox
                  id="allowExtraEmails"
                  name="allowExtraEmails"
                  color="primary"
                  checked={formik.values.allowExtraEmails}
                  onChange={formik.handleChange}
                />
              }
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLogin ? "Sign in" : "Sign up"}
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Link to switch between login and signup */}
          <Typography sx={{ textAlign: "center" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? ROUTES.SIGNUP : ROUTES.SIGNIN}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </Typography>
        </Box>
      </Card>
    </SignUpContainer>
  );
}
