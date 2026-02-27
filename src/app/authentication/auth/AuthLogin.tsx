import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  TextField,
} from "@mui/material";
import Link from "next/link";
import { loginSchema } from "./LoginZod";
import { useLoginMutation } from "@/services/authAPI";
import { toast } from "react-toastify";


interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

interface IFormData {
  phoneOrEmail: string,
  password: string
}

interface ILoginData {
  PhoneNumber?: string,
  EmailAddress?: string,
  Password: string
}


type ZodValidationError = {
  phoneOrEmail?: string[];
  password?: string[];
};

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [loginErrorField, setLoginErrorField] = useState<ZodValidationError | null>(null);
  const [LoginUser, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();

  const recognizeEmailOrPhoneNumber = async (phoneOrEmail: string): Promise<string | undefined> => {
    const arrayOfEnteredValue: string[] = phoneOrEmail.split("");

    let valueType: string | undefined = "phone";

    arrayOfEnteredValue.forEach((letter) => {
      const typeOfLetter = typeof letter;

      // Make these two conditions stop foreach
      if (typeOfLetter == "string" && phoneOrEmail.includes("@")) valueType = "email";

      if (typeOfLetter == "string" && !phoneOrEmail.includes("@")) valueType = undefined;
    })

    return valueType;
  }

  const loginUser = async (data: ILoginData): Promise<void> => {
    const response = LoginUser(data)
    console.log("tokentokentoken", (await response).data?.token);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const rawFormData: IFormData = {
      phoneOrEmail: formData.get("phoneOrEmail")?.toString() || '',
      password: formData.get("password")?.toString() || ''
    }

    const validatedFields = loginSchema.safeParse({
      phoneOrEmail: rawFormData.phoneOrEmail,
      password: rawFormData.password
    });

    if (!validatedFields.success) {
      const flattenValidation = validatedFields.error.flatten().fieldErrors;
      setLoginErrorField(flattenValidation)
      return;
    }

    const emailOrPhoneNumber: string | undefined = await recognizeEmailOrPhoneNumber(rawFormData.phoneOrEmail);

    if (emailOrPhoneNumber == undefined) {
      toast.error("شماره یا ایمیل وارد شده معتبر نیست")
      return;
    }

    const dataObj: ILoginData = {
      PhoneNumber: emailOrPhoneNumber == "phone" ? rawFormData.phoneOrEmail : undefined,
      EmailAddress: emailOrPhoneNumber == "email" ? rawFormData.phoneOrEmail : undefined,
      Password: rawFormData.password
    };

    await loginUser(dataObj);
  };

  useEffect(() => {
    if (loginError) {
      toast.error("ورود با مشکل مواجه شد")
    }
  }, [loginError])

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <form onSubmit={handleSubmit}>
          <TextField
            id="phoneOrEmail"
            variant="outlined"
            name="phoneOrEmail"
            fullWidth
            label={
              <span style={{ display: "flex", gap: "1px" }}>
                شماره موبایل یا ایمیل
                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
              </span>
            }
            error={!!loginErrorField?.phoneOrEmail}
            helperText={loginErrorField?.phoneOrEmail}
            disabled={isLoginLoading}
          />
          <TextField
            id="password"
            variant="outlined"
            name="password"
            type="password"
            fullWidth
            label={
              <span style={{ display: "flex", gap: "1px" }}>
                رمز عبور
                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
              </span>
            }
            error={!!loginErrorField?.password}
            helperText={loginErrorField?.password}
            disabled={isLoginLoading}
          />
        </form>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Remeber this Device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            رمز را فراموش کرده اید؟
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          component={Link}
          href="/"
          type="submit"
          disabled={isLoginLoading}
        >
          {isLoginLoading ? "درحال انجام عملیات" : "ورود"}
        </Button>
      </Box>
      {subtitle}
    </>
  )
};

export default AuthLogin;
