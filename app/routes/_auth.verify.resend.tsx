import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authenticator, FormError } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    await authenticator.authenticate("resend", request);
    return redirect("/verify?resent=true");
  } catch (error) {
    if (error instanceof Response) throw error;
    if (error instanceof FormError) {
      const searchParams = new URLSearchParams();
      if (error.data.fieldErrors.form) {
        searchParams.set("error", error.data.fieldErrors.form);
      }
      return redirect(`/verify?${searchParams.toString()}`);
    }
    return redirect("/verify?error=Failed to send verification email");
  }
}

export async function loader() {
  return redirect("/verify");
}
