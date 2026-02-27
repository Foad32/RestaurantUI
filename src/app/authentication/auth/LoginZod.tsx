import { z } from 'zod'

export const loginSchema = z.object({
    phoneOrEmail: z.string().min(1, "لطفا شماره موبایل یا ایمیل خود را وارد کنید"),
    password: z.string().min(1, "لطفا رمز عبور را وارد کنید"),
})
