const Footer = () => {
    return (
        <footer className="bg-primary/5 border-t border-border py-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <a
                        href="/contact"
                        className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Contact us
                    </a>
                    <a
                        href="/disclaimer"
                        className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Disclaimer
                    </a>
                    <a
                        href="/privacy"
                        className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Privacy
                    </a>
                    <a
                        href="/terms"
                        className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Terms & Conditions
                    </a>
                    <a
                        href="/refund-policy"
                        className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                        Cancellation & Refund Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;