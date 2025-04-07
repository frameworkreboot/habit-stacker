"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export function SignupTest() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTestSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Log the redirect URL for debugging
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Using redirect URL:', redirectUrl);

      // Test signup with email redirect
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'test123456', // For testing purposes
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      // Create a profile record if user was created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      console.log('Signup response:', data);
      setSuccessMessage(`Signup attempt successful. Check console for full response.
        User: ${data.user?.id}
        Email confirmation: ${data.user?.confirmation_sent_at}
      `);

    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmailSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Get auth settings (requires admin key, should only be used in development)
      const { data, error } = await supabase.auth.admin.listUsers();
      
      console.log('Auth settings:', data);
      setSuccessMessage('Auth settings retrieved. Check console for details.');

    } catch (err) {
      console.error('Error checking auth settings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred checking auth settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEmailSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Only for development - get email settings status
      // Note: This will only work if you have the proper admin privileges
      const { data, error } = await supabase.from('_config').select('*').eq('name', 'email_settings').single();
      
      if (error) throw error;
      
      console.log('Email settings:', data);
      setSuccessMessage('Email settings retrieved. Check console for details.');

    } catch (err) {
      console.error('Error checking email settings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred checking email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPasswordReset = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setSuccessMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h2 className="text-lg font-bold">Auth Test Panel</h2>
      
      <div className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Test email"
          className="w-full p-2 border rounded"
        />
        
        <div className="space-x-2">
          <Button 
            onClick={handleTestSignup}
            disabled={loading || !email}
          >
            {loading ? 'Testing...' : 'Test Signup'}
          </Button>
          
          <Button 
            onClick={handleTestEmailSettings}
            disabled={loading}
            variant="outline"
          >
            Check Auth Settings
          </Button>
          
          <Button 
            onClick={handleCheckEmailSettings}
            disabled={loading}
            variant="outline"
          >
            Check Email Settings
          </Button>
          
          <Button 
            onClick={handleTestPasswordReset}
            disabled={loading || !email}
            variant="outline"
          >
            Test Password Reset
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="text-green-500 text-sm whitespace-pre-line">
          {successMessage}
        </div>
      )}
    </div>
  );
} 