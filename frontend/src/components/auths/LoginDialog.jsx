import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog'
import { Button } from '@/components/UI/button'
import { Input } from '@/components/UI/input'
import { Label } from '@/components/UI/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, AlertTriangle } from 'lucide-react'
import { getApiBase } from '@/lib/api'

const LoginDialog = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      if (error.requiresVerification) {
        setUnverifiedEmail(error.email || email)
        setShowVerificationPrompt(true)
        toast({
          title: 'Email Verification Required',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login Error',
          description: error.message,
          variant: 'destructive',
        })
      }
    } else {
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      })
      setEmail('')
      setPassword('')
      setShowVerificationPrompt(false)
      onClose()
    }

    setLoading(false)
  }

  const handleResendVerification = async () => {
    setResendLoading(true)

    try {
      const response = await fetch(`${getApiBase()}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: unverifiedEmail }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for verification instructions.',
          variant: 'default',
        })
      } else {
        toast({
          title: 'Resend Failed',
          description: result.message || 'Failed to resend verification email',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Resend error:', error)
      toast({
        title: 'Error',
        description: 'Failed to resend verification email. Please try again.',
        variant: 'destructive',
      })
    }

    setResendLoading(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setShowVerificationPrompt(false)
    setUnverifiedEmail('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>
            Sign in to your account to access exclusive features
          </DialogDescription>
        </DialogHeader>
        
        {showVerificationPrompt && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">Email Verification Required</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Your email address <strong>{unverifiedEmail}</strong> needs to be verified before you can log in.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="mt-2"
                >
                  {resendLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Mail className="mr-2 h-3 w-3" />
                  Resend Verification Email
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={() => {
                resetForm()
                onSwitchToSignup()
              }}
              className="text-primary hover:underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog   // 👈 IMPORTANT
