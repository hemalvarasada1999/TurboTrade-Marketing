
const NotFound = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 px-6">
      <div className="max-w-md text-center">
        {/* Illustration Placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="h-40 w-40 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-7xl font-bold text-accent">404</span>
            </div>
            <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-accent/20 animate-pulse" />
            <div className="absolute -bottom-2 -left-2 h-12 w-12 rounded-full bg-accent/20 animate-pulse delay-75" />
          </div>
        </div>

        {/* Content */}
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Oops! The page you're looking for seems to have wandered off. Don't worry, we'll help you find your way back.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            ← Back to Home
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Contact Support
          </a>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="text-border">•</span>
            <a href="/privacy" className="text-accent hover:underline">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="/terms" className="text-accent hover:underline">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
