import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,255,0.1),transparent_50%)] animate-pulse"></div>
      <div className="text-center space-y-6 relative z-10">
        <h1 className="text-9xl font-display neon-text-magenta">404</h1>
        <h2 className="text-3xl font-display text-foreground">PAGE NOT FOUND</h2>
        <p className="text-muted-foreground font-mono max-w-md mx-4">
          &gt; ERROR: The requested resource does not exist in this dimension.
        </p>
        <Link to="/">
          <Button className="font-mono">
            &gt;&gt; RETURN TO BASE
          </Button>
        </Link>
      </div>
    </div>
  );
}
