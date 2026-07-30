import { TrendingUp, Mail, FileText, Shield, ScrollText, RotateCcw, Linkedin, Twitter, Facebook, Users } from "lucide-react";
import { Link } from "react-router-dom";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-card border-t border-border">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col py-6">
                <div className="flex justify-between items-center py-3">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <div className=" text-center md:text-left">
                            <a href="#" className="flex items-center gap-3">
                                <img src={logoLight} alt="TurboTrade" className="h-12 md:h-14 w-auto dark:hidden object-contain" />
                                <img src={logoDark} alt="TurboTrade" className="h-12 md:h-14 w-auto hidden dark:block object-contain" />
                            </a>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto md:mx-0">
                                Precision-engineered algo execution for systematic traders.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                            {/* Social Icons */}
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://in.linkedin.com/company/tradeonai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                                <a
                                    href="https://x.com/TradeOnAi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a
                                    href="mailto:inquiry@turbotrade.ai"
                                    className="p-2 rounded-lg bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-label="Facebook"
                                >
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>


                    {/* Links Grid */}
                    <div className="flex flex-col gap-2">
                        <Link
                            to="/broker-partner-program"
                            className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1 font-medium text-goldenrod"
                        >
                            <Users className="h-4 w-4 text-goldenrod group-hover:text-accent transition-colors" />
                            <span>Partner Program</span>
                        </Link>
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
                            to="/accessibility-statement"
                            className="group flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-all duration-200 hover:translate-x-1"
                        >
                            <Shield className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            <span>Accessibility Statement</span>
                        </Link>
                    </div>

                </div>
                <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-0">
                    <p className="text-xs text-muted-foreground">
                        © 2024 TurboTrade.ai — Algorithmic trading involves risk. Past performance does not guarantee future results.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;