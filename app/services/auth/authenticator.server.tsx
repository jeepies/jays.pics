import { Authenticator } from "remix-auth";
import { User } from "@prisma/client";
import formStrategy from "./strategies/form.server";
import ErrorType from "~/types/ErrorType";

export let authenticator = new Authenticator<User | ErrorType>();

authenticator.use(formStrategy);
