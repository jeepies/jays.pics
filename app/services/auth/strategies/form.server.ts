import { FormStrategy } from "remix-auth-form";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { getClientIPAddress } from "remix-utils/get-client-ip-address";
import ErrorType from "~/types/ErrorType";
import { CheckUsernameTaken, GetUserByReferralCode } from "~/services/models/user.server";
import { CreateNewReferralM2M, GetReferralCountFromUserID, IsUserAtReferralLimit } from "~/services/models/referrals";
import { prisma } from "~/services/prisma.server";

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
        const { username, password, referralCode } = result.data;

        const usernameTaken = await CheckUsernameTaken(username);
        if (usernameTaken) {
            errors.fieldErrors.username = ["This username already exists"];
            return errors;
        }

        const referringUser = await GetUserByReferralCode(referralCode);
        if (!referringUser) {
            errors.fieldErrors.referralCode = ["This username already exists"];
            return errors;
        }

        const isAtReferralLimit = await IsUserAtReferralLimit(referringUser.id)
        if (isAtReferralLimit) {
            errors.fieldErrors.referralCode = ["This referral code has been used too many times"];
            return errors;
        }

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

        CreateNewReferralM2M(referringUser.id, newUser.id)

        return newUser
    }
    else {

    }
})

export default formStrategy;