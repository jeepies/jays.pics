import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { authenticator } from "~/services/auth/authenticator.server";
import { commitSession, getSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.authenticate("form", request);

  if (!user.fieldErrors) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userID", user.id);
    return redirect("/dashboard/index", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return user;
}

export default function Component() {
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
