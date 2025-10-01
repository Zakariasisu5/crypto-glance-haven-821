import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) throw error;
        toast.success('Account created! Please check your email to verify your account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        toast.success('Signed in successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) return toast.error('Please enter your email');
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth`
      });
      if (error) throw error;
      toast.success('Password reset email sent. Check your inbox.');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/') }>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <img src="/moonfi-logo.svg" alt="moonFi" className="w-8 h-8 rounded-sm" />
            <span className="font-semibold">MoonFI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-glow p-6">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-center">
                {isSignUp ? 'Sign up to start building your credit profile' : 'Sign in to access your dashboard'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="emailHelp"
                  />
                  <p id="emailHelp" className="text-xs text-muted-foreground">We'll never share your email.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full btn-moonfi" disabled={loading}>
                  {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </span>
                {' '}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>

              {!isSignUp && (
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button variant="outline" onClick={handlePasswordReset} disabled={isResetting}>
                      {isResetting ? 'Sending...' : 'Reset'}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Forgot password? Enter your email and click Reset.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="card-glow p-6">
              <h4 className="font-semibold mb-2">Why MoonFI?</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
                <li>Build on-chain credit history</li>
                <li>Access competitive DeFi lending rates</li>
                <li>Secure, privacy-minded authentication</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
