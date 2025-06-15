import ErrorPage from "~/components/error-page";

export function meta() {
  return [{ title: "404 - Page Not Found" }];
}

export default function NotFound() {
  return (
    <ErrorPage
      title="404 - Page Not Found"
      message="The page you are looking for does not exist."
    />
  );
}
