import {
  ActionFunctionArgs,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {}

export default function Upload() {
  return (
    <h1>shit</h1>
  )
}
