import { Authenticator } from "remix-auth";
import { User } from "@prisma/client";
import formStrategy from "./strategies/form.server";

export let authenticator = new Authenticator<
  | User
  | {
      payload: { [k: string]: FormDataEntryValue };
      formErrors: string[];
      fieldErrors: {
        username?: string[] | undefined;
        password?: string[] | undefined;
      };
    }
>();

authenticator.use(formStrategy);
