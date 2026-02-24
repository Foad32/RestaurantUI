import React, { useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation'

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { schema } from "./RegisterZod"
import { useRegisterMutation } from '@/services/authAPI';

interface registerType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
}

interface IFormData {
    userName: string,
    phoneNumber: string,
    password: string
}

type ZodValidationError = {
    userName?: string[];
    phoneNumber?: string[];
    password?: string[];
};


const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    const [registerErrorItem, setRegisterErrorItem] = useState<ZodValidationError | null>(null);
    const [RegisterUser, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();
    const router: AppRouterInstance = useRouter();


    const registerUserAction = async (formData: FormData) => {
        // Website for form
        // https://nextjs.org/docs/app/guides/forms

        const rawFormData: IFormData = {
            userName: formData.get("userName")?.toString() || '',
            phoneNumber: formData.get("phoneNumber")?.toString() || '',
            password: formData.get("password")?.toString() || ''
        }

        const validatedFields = schema.safeParse({
            userName: rawFormData.userName,
            phoneNumber: rawFormData.phoneNumber,
            password: rawFormData.password
        })

        // After displaying some fields are empty, the fields that have data remove them
        if (!validatedFields.success) {
            const flattenValidation = validatedFields.error.flatten().fieldErrors;
            setRegisterErrorItem(flattenValidation)
            return;
        }

        await RegisterUser(rawFormData);

        if (registerError) {
            // Needs an error alert
            return;
        }

        router.push("/authentication/login");
    }

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <form action={registerUserAction}>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='userName' mb="5px">نام کاربری</Typography>
                    <TextField id="userName" variant="outlined" name="userName" fullWidth
                        error={!!registerErrorItem?.userName}
                        helperText={registerErrorItem?.userName} />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='phoneNumber' mb="5px" mt="25px">شماره موبایل</Typography>
                    <TextField id="phoneNumber" variant="outlined" fullWidth name="phoneNumber"
                        error={!!registerErrorItem?.phoneNumber}
                        helperText={registerErrorItem?.phoneNumber}
                    />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">رمز ورود</Typography>
                    <TextField id="password" variant="outlined" fullWidth name="password"
                        error={!!registerErrorItem?.password}
                        helperText={registerErrorItem?.password} />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth type='submit' disabled={isRegisterLoading}
                >
                    ثبت نام
                </Button>
            </form>
            {subtitle}
        </>
    )
};

export default AuthRegister;
