import React, { useEffect, useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation'

import { Stack } from '@mui/system';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { registerSchema } from "./RegisterZod"
import { useRegisterMutation } from '@/services/authAPI';
import { toast, ToastContainer } from 'react-toastify';

interface registerType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
}

interface IFormData {
    userName: string,
    phoneNumber: string,
    emailAddress?: string,
    password: string
}

type ZodValidationError = {
    userName?: string[];
    phoneNumber?: string[];
    password?: string[];
};


const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    const [registerErrorItem, setRegisterErrorItem] = useState<ZodValidationError | null>(null);
    const [RegisterUser, { isLoading: isRegisterLoading, error: registerError, isSuccess }] = useRegisterMutation();
    const router: AppRouterInstance = useRouter();

    const registerUserAction = async (rawFormData: IFormData) => {
        await RegisterUser(rawFormData);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const rawFormData: IFormData = {
            userName: formData.get("userName")?.toString() || '',
            phoneNumber: formData.get("phoneNumber")?.toString() || '',
            emailAddress: formData.get("emailAddress")?.toString() || '',
            password: formData.get("password")?.toString() || ''
        }

        const validatedFields = registerSchema.safeParse({
            userName: rawFormData.userName,
            phoneNumber: rawFormData.phoneNumber,
            emailAddress: rawFormData.emailAddress,
            password: rawFormData.password
        })

        // After displaying some fields are empty, the fields that have data remove them
        if (!validatedFields.success) {
            const flattenValidation = validatedFields.error.flatten().fieldErrors;
            setRegisterErrorItem(flattenValidation);
            return;
        }

        registerUserAction(rawFormData)
    }

    useEffect(() => {
        if (registerError) {
            toast.error("ثبت نام با مشکل مواجه شد");
        }

        if (isSuccess) {
            toast.success("ثبت نام با موفقیت انجام شد");
            router.push("/authentication/login");
        }

    }, [registerError, isSuccess]);


    return (
        <>
            <ToastContainer />

            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <form onSubmit={handleSubmit} dir='rtl'>
                <Stack mb={3} sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    <TextField
                        id="userName"
                        variant="outlined"
                        name="userName"
                        fullWidth
                        label={
                            <span style={{ display: "flex", gap: "1px" }}>
                                نام کاربری
                                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
                            </span>
                        }
                        error={!!registerErrorItem?.userName}
                        helperText={registerErrorItem?.userName}
                        disabled={isRegisterLoading}
                    />

                    <TextField
                        id="phoneNumber"
                        variant="outlined"
                        name="phoneNumber"
                        fullWidth
                        label={
                            <span style={{ display: "flex", gap: "1px" }}>
                                شماره موبایل
                                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
                            </span>
                        }
                        error={!!registerErrorItem?.phoneNumber}
                        helperText={registerErrorItem?.phoneNumber}
                        disabled={isRegisterLoading}
                    />

                    <TextField
                        id="emailAddress"
                        variant="outlined"
                        name="emailAddress"
                        fullWidth
                        label={
                            <span style={{ display: "flex", gap: "5px" }}>
                                آدرس پستی
                            </span>
                        }
                        disabled={isRegisterLoading}
                    />


                    <TextField
                        id="password"
                        variant="outlined"
                        name="password"
                        type='password'
                        fullWidth
                        label={
                            <span style={{ display: "flex", gap: "1px" }}>
                                رمز ورود
                                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
                            </span>
                        }
                        error={!!registerErrorItem?.password}
                        helperText={registerErrorItem?.password}
                        disabled={isRegisterLoading}
                    />

                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth type='submit' disabled={isRegisterLoading}
                >
                    {isRegisterLoading ? "درحال انجام عملیات" : "ثبت نام"}
                </Button>
            </form>
            {subtitle}
        </>
    )
};

export default AuthRegister;
