"use client";

import { WifiOff } from "lucide-react";
import { useMessages } from "@/components/i18n";
import { Button } from "@/components/ui/button";

export function OfflinePage() {
  const m = useMessages();
  return (
    <main id="main" className="flex flex-1 items-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <WifiOff className="mx-auto size-10 text-primary" aria-hidden />
        <h1 className="mt-4 text-3xl font-semibold">{m.pwa.offlineTitle}</h1>
        <p className="mt-3 text-muted-foreground">{m.pwa.offlineBody}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>
          {m.common.retry}
        </Button>
      </div>
    </main>
  );
}
