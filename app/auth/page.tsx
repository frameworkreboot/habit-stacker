import { AuthForm } from '@/components/auth/auth-form';
import { SignupTest } from '@/components/auth/SignupTest';

export default function AuthPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Auth Testing</h1>
      <SignupTest />
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome to HabitStacker
        </h1>
        <AuthForm />
      </div>
    </div>
  );
} 