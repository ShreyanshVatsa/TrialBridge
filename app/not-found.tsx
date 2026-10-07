import { ErrorView } from "@/components/site/error-view";
import { en } from "@/components/i18n/en";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16">
      <ErrorView title={en.errors.notFoundTitle} body={en.errors.notFoundBody} />
    </main>
  );
}
