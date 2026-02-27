import { z } from 'zod'

export const registerSchema = z.object({
    userName: z.string().min(1, "لطفا نام کاربری را وارد نمایید"),
    phoneNumber: z.string().min(1, "لطفا شماره موبایل خود را وارد کنید"),
    password: z.string().min(1, "لطفا رمز عبور را وارد کنید"),
})
