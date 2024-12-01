import { ActionFunctionArgs } from "@remix-run/node"
import { authenticator } from "~/services/auth/authenticator.server"

export async function action({ request }: ActionFunctionArgs) {
    return await authenticator.authenticate("form", request)
}

export default function Login() {
    return <></>
}