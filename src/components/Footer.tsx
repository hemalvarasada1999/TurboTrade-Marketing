import { Separator } from "@/components/ui/separator";
import { TrendingUp, Mail, FileText, Shield, ScrollText, RotateCcw, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-card border-t border-border">
            <div className="container flex justify-between items-center py-10">
                {/* Brand Section */}
                <div className="flex flex-col gap-4">
                    <div className=" text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <TrendingUp className="h-6 w-6 text-accent" />
                            <div className="text-xl font-bold transition-opacity duration-300 data-[state=collapsed]:opacity-0 data-[state=collapsed]:w-0 overflow-hidden whitespace-nowrap">
                                <span className="text-accent-foreground">Turbo</span>
                                <span className="text-accent">Trade</span>
                                <span className="text-foreground">.ai</span>
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0">
                            Empowering your financial future with intelligent algorithmic trading solutions.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            © {currentYear} 
                            <div className="text-sm font-medium transition-opacity duration-300 data-[state=collapsed]:opacity-0 data-[state=collapsed]:w-0 overflow-hidden whitespace-nowrap">
                                <span className="text-accent-foreground">Turbo</span>
                                <span className="text-accent">Trade</span>
                                <span className="text-foreground">.ai .</span>
                            </div>
                            All rights reserved.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>


                {/* Links Grid */}
                <div className="flex flex-col gap-2">
                    <Link
                        to="/contact"
                        className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                        <Mail className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>Contact</span>
                    </Link>
                    <Link
                        to="/disclaimer"
                        className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                        <FileText className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>Disclaimer</span>
                    </Link>
                    <Link
                        to="/privacy"
                        className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                        <Shield className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>Privacy Policy</span>
                    </Link>
                    <Link
                        to="/terms"
                        className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                        <ScrollText className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>Terms & Conditions</span>
                    </Link>
                    <Link
                        to="/refund-policy"
                        className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                    >
                        <RotateCcw className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <span>Refund Policy</span>
                    </Link>
                </div>

            </div>
        </footer>
    );
};

export default Footer;