import { Metadata } from "next";
import { ThemeSelector } from "../../components/theme-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "../../components/site-header";
import { MigrateData } from '@/components/migrate-data';
import { useAuth } from '@/lib/contexts/AuthContext';

export const metadata: Metadata = {
  title: "Settings | HabitStacker",
  description: "Manage your HabitStacker application settings.",
};

export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <>
      <SiteHeader />
      <div className="container py-10">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how HabitStacker looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Select the theme for the application.
                </p>
                <ThemeSelector />
              </div>
            </CardContent>
          </Card>
          
          {user && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Data Management</h2>
              <MigrateData />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

