import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { migrateLocalStorageToSupabase } from '@/lib/migration/migrate-to-supabase';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function MigrateData() {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleMigration = async () => {
    try {
      setMigrationStatus('migrating');
      
      const result = await migrateLocalStorageToSupabase();
      
      if (result.success) {
        setMigrationStatus('success');
        setMessage(result.message);
      } else {
        setMigrationStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      setMigrationStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h3 className="text-lg font-medium">Migrate Local Data to Cloud</h3>
        <p className="text-sm text-muted-foreground">
          Transfer your locally stored habits to your Supabase account for access across devices.
        </p>
      </div>
      
      {migrationStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      {migrationStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleMigration} 
        disabled={migrationStatus === 'migrating'}
        className="w-full"
      >
        {migrationStatus === 'migrating' ? 'Migrating...' : 'Migrate Data to Cloud'}
      </Button>
      
      {migrationStatus === 'success' && (
        <p className="text-xs text-muted-foreground text-center">
          Your data has been successfully migrated. You can now access your habits from any device.
        </p>
      )}
    </div>
  );
} 