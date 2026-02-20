import React from 'react';
import { Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation'

import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { schema } from "./RegisterZod"

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

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    const router: AppRouterInstance = useRouter();

    const registerUser = (formData: FormData) => {
        // Website for form
        // https://nextjs.org/docs/app/guides/forms

        const rawFormData: IFormData = {
            userName: formData.get("userName")?.toString() || '',
            phoneNumber: formData.get("phoneNumber")?.toString() || '',
            password: formData.get("password")?.toString() || ''
        }

        // console.log("schemaschemaschemaschema", schema.safeParse);

        const validatedFields = schema.safeParse({
            userName: rawFormData.userName,
            phoneNumber: rawFormData.phoneNumber,
            password: rawFormData.password
        })

        // Not completed
        if (!validatedFields.success) {
            console.error("errorerrorerror", validatedFields.error.flatten().fieldErrors.password); // Handle error
            return;
        }

        console.log("rawFormDatarawFormData", rawFormData);

        // router.push("/authentication/login");
    }

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <form action={registerUser}>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='userName' mb="5px">نام کاربری</Typography>
                    <CustomTextField id="userName" variant="outlined" name="userName" fullWidth />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='phoneNumber' mb="5px" mt="25px">شماره موبایل</Typography>
                    <CustomTextField id="phoneNumber" variant="outlined" fullWidth name="phoneNumber" />

                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" mt="25px">رمز ورود</Typography>
                    <CustomTextField id="password" variant="outlined" fullWidth name="password" />
                </Stack>
                <Button color="primary" variant="contained" size="large" fullWidth type='submit'
                // onClick={RegisterRequest}
                // component={Link} href="/authentication/login"
                >
                    Sign Up
                </Button>
            </form>
            {subtitle}
        </>
    )
};

export default AuthRegister;
