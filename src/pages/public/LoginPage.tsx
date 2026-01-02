import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      // Redirect based on role - get fresh auth state
      const auth = useAuth();
      if (auth.user?.role === 'ADMIN' || auth.user?.role === 'TEACHER') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled by store
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <Card className="w-full max-w-md mx-4 terminal-border relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-display neon-text-cyan text-center">
            ATK-DEF CTF
          </CardTitle>
          <CardDescription className="text-center font-mono">
            &gt; SYSTEM ACCESS TERMINAL_
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="team1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
                required
              />
            </div>
            {error && (
              <div className="p-3 rounded bg-destructive/10 border border-destructive text-destructive text-sm font-mono">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full font-mono text-lg"
              disabled={isLoading}
            >
              {isLoading ? '&gt; AUTHENTICATING...' : '&gt;&gt; AUTHENTICATE'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm font-mono">
            <span className="text-muted-foreground">Don't have access? </span>
            <a href="/signup" className="text-primary hover:underline">
              Register
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
