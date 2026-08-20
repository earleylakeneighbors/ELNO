import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Organization details and social links. Leave social URLs blank until you have real
          accounts.
        </p>
      </header>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
