import { User } from "@prisma/client";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { authenticator } from "~/services/auth/authenticator.server";
import { getSession, commitSession } from "~/services/session.server";
import ErrorType from "~/types/ErrorType";

export async function action({ request }: ActionFunctionArgs) {
  const user: User | ErrorType = await authenticator.authenticate(
    "form",
    request,
  );

  if (user && (user as User).id) {
    const data = user as User;
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userID", data.id);
    return redirect("/dashboard/index", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return user as ErrorType;
}

export default function Register() {
    const actionData = useActionData<typeof action>();
  
    return (
      <Form className='space-y-4' method='post'>
        <Input className='hidden' value='login' name='type' readOnly />
        <label htmlFor='username'>Username</label>
        <Input
          id='username'
          name='username'
          type='text'
          placeholder='Username'
          required
        />
        {actionData?.fieldErrors.username}
        <label htmlFor='password'>Password</label>
        <Input
          id='password'
          name='password'
          type='password'
          placeholder='*******'
          required
        />
        {actionData?.fieldErrors.password}
        <button className='w-full' type='submit'>
          Log in
        </button>
      </Form>
    );
  }
  