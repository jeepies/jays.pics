import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { prisma } from "../../prisma.server";
import { getClientIPAddress } from "remix-utils/get-client-ip-address";

const schema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .regex(/^[a-z0-9_]+$/gim, "Invalid username")
        .min(3, { message: "Must be 3 or more characters" })
        .max(20, { message: "Must be 20 or less characters" }),
    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Must be 8 or more characters" })
        .max(256, { message: "Must be 256 or less characters" })
        .regex(
            /([!?&-_]+)/g,
            "Insecure password - Please add one (or more) of (!, ?, &, - or _)"
        )
        .regex(
            /([0-9]+)/g,
            "Insecure password - Please add one (or more) digit (0-9)"
        ),
})

const formStrategy = new FormStrategy(async ({ form, request }) => {
    const payload = Object.fromEntries(form);
    const result = schema.safeParse(payload);

    if (!result.success) {
        const error = result.error.flatten();
        return {
            payload,
            formErrors: error.formErrors,
            fieldErrors: error.fieldErrors,
        }
    }

    const ipAddress = getClientIPAddress(request) ?? "";
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const user = prisma.user.upsert({
        where: {
            username: result.data.username,
            password: hashedPassword
        },
        create: {
            username: result.data.username,
            password: hashedPassword,
            last_login_ip: ipAddress
        },
        update: {
            last_login_ip: ipAddress,
        }
    })

    return user;
})

export default formStrategy;