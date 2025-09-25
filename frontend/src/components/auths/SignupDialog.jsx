import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Label } from '@/components/UI/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiBase } from '@/lib/api';

const SignupDialog = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { signUp } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setVerificationToken('');
    setShowVerification(false);
    setSignupEmail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (password.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const { error, data } = await signUp(fullName, email, password);

    if (error) {
      toast({
        title: 'Signup Error',
        description: error.message,
        variant: 'destructive',
      });
    } else if (data?.requiresVerification) {
      setSignupEmail(email);
      setShowVerification(true);
      toast({
        title: 'Account Created!',
        description: 'Please check your email for verification instructions.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      });
      resetForm();
      onClose();
    }

    setLoading(false);
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationToken.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter the verification token',
        variant: 'destructive',
      });
      return;
    }

    setVerificationLoading(true);

    try {
      const response = await fetch(`${getApiBase()}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail,
          token: verificationToken.trim()
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Email Verified!',
          description: 'Your email has been verified. You can now log in.',
          variant: 'default',
        });
        resetForm();
        onClose();
        onSwitchToLogin();
      } else {
        toast({
          title: 'Verification Failed',
          description: result.message || 'Invalid or expired verification token',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify email. Please try again.',
        variant: 'destructive',
      });
    }

    setVerificationLoading(false);
  };

  const handleResendVerification = async () => {
    setResendLoading(true);

    try {
      const response = await fetch(`${getApiBase()}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signupEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the new verification token.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Resend Failed',
          description: result.message || 'Failed to resend verification email',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      });
    }

    setResendLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!showVerification ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Account</DialogTitle>
              <DialogDescription>
                Join us to unlock personalized travel experiences
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email (e.g., user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  ⚠️ Please use a valid email address for verification
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Verify Your Email
              </DialogTitle>
              <DialogDescription>
                We've sent a verification token to <strong>{signupEmail}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Check your email</p>
                    <p className="text-blue-700 mt-1">
                      Look for an email with your verification token. It may take a few minutes to arrive.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationToken">Verification Token</Label>
                  <Input
                    id="verificationToken"
                    type="text"
                    placeholder="Enter the verification token from your email"
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={verificationLoading}>
                  {verificationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Email
                </Button>
              </form>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full"
                >
                  {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Resend Verification Email
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVerification(false)}
                  className="w-full"
                >
                  Back to Signup
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
