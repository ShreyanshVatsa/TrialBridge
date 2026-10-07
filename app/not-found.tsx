"use client";

import { useMessages } from "@/components/i18n";
import { ErrorView } from "@/components/site/error-view";

export default function NotFound() {
  const m = useMessages();
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16">
      <ErrorView title={m.errors.notFoundTitle} body={m.errors.notFoundBody} />
    </main>
  );
}
