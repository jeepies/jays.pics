import { User } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { authenticator } from "~/services/auth/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";
import ErrorType from "~/types/ErrorType";

export async function action({ request }: ActionFunctionArgs) {
  const user: User | ErrorType = await authenticator.authenticate("form", request);

  if(user && (user as User).id) {
    const data = (user as User)
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
      <label htmlFor='username'>Username</label>
      <input
        id='username'
        name='username'
        type='text'
        placeholder=''
        required
      />
      {actionData?.fieldErrors.username}
      <label htmlFor='password'>Password</label>
      <input
        id='password'
        name='password'
        type='password'
        placeholder=''
        required
      />
      {actionData?.fieldErrors.password}
      <button className='w-full' type='submit'>
        Sign Up
      </button>
    </Form>
  );
}
