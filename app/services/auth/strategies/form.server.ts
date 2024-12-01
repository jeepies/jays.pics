import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { prisma } from "../../prisma.server";
import { getClientIPAddress } from "remix-utils/get-client-ip-address";
import ErrorType from "~/types/ErrorType";

const loginSchema = z.object({
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
const registerSchema = loginSchema.extend({
    referralCode: z
        .string({ required_error: "Referral Code is required" })
        .uuid("Must be a valid referral code"),
})

const formStrategy = new FormStrategy(async ({ form, request }) => {
    const type = form.get("type");
    const payload = Object.fromEntries(form);
    delete payload.type;

    const inputValidationFailure = (result: z.SafeParseReturnType<{
        username: string;
        password: string;
        referralCode: string;
    }, {
        username: string;
        password: string;
        referralCode: string;
    }>) => {
        const error = result.error!.flatten();
        return {
            payload,
            formErrors: error.formErrors,
            fieldErrors: error.fieldErrors,
        }
    }
    const errors: ErrorType = {
        payload: {},
        formErrors: [],
        fieldErrors: {
            username: undefined,
            password: undefined,
            referralCode: undefined
        }
    }

    if (type === "register") {
        const result = registerSchema.safeParse(payload);
        if (!result.success) return inputValidationFailure(result);

        const { username, password, referralCode } = result.data

        const usersWithUsername = await prisma.user.count({ where: { username: username } });
        if (usersWithUsername !== 0) {
            errors.fieldErrors.username = ["This username already exists"]
            return errors;
        }

        const usersWithReferralCode = await prisma.referralProfile.findFirst({
            include: {
                user: true
            },
            where: {
                referral_code: referralCode
            }
        })
        if(!usersWithReferralCode) {
            errors.fieldErrors.referralCode = ["This referral code does not exist"]
            return errors
        }

        // TODO: Add method to limit referrals

        const lastLoginIP = process.env.NODE_ENV === "development" ? "127.0.0.1" : getClientIPAddress(request) ?? "";
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                last_login_ip: lastLoginIP,
                referral_profile: {
                    create: {}
                }
            }
        })
        return newUser
    }
})

export default formStrategy;