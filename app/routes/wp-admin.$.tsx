import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getSession, getUserBySession } from "~/services/session.server";
import { getClientIPAddress } from "remix-utils/get-client-ip-address";
import { prisma } from "~/services/database.server";
import { LogType } from "@prisma/client";

export async function action({ request }: ActionFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));

    const ipAddress = getClientIPAddress(request);
    let user = "not logged in"
  
    if(session.has('userID')) {
      const data = await getUserBySession(session)
      user = data!.username;
    }
  
    await prisma.log.create({
      data: {
          message: `POST wp-admin/* was requested. user was ${user}, ip was ${ipAddress ? ipAddress : "not found"}`,
          type: LogType.HONEYPOT
      }
    })
  
    return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const ipAddress = getClientIPAddress(request);
  let user = "not logged in"

  if(session.has('userID')) {
    const data = await getUserBySession(session)
    user = data!.username;
  }

  await prisma.log.create({
    data: {
        message: `GET wp-admin/* was requested. user was ${user}, ip was ${ipAddress ? ipAddress : "not found"}`,
        type: LogType.HONEYPOT
    }
  })

  return null;
}

export default function WpAdminHoneypot() {
  return <>good job man you hacked me!</>;
}
