import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
    return (
        <div className="light-page min-h-screen bg-gradient-to-br from-background via-muted to-background relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.12),transparent_50%),radial-gradient(circle_at_80%_80%,hsl(var(--accent)/0.08),transparent_50%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-50 shadow-lg transition-all">
                    <div className="container mx-auto px-4 py-5">
                        <Link to="/" className="group inline-flex items-center gap-2 text-foreground hover:text-accent transition-all duration-300">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-semibold">Back to Home</span>
                        </Link>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 border-b border-border/30 relative">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent animate-scale-in">
                                Privacy Policy
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center text-muted-foreground text-sm">
                                <p className="flex items-center gap-2 justify-center">
                                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                                    <strong className="text-foreground">Effective Date:</strong> 1st December, 2025
                                </p>
                                <span className="hidden sm:inline text-accent">•</span>
                                <p className="flex items-center gap-2 justify-center">
                                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                                    <strong className="text-foreground">Last Updated:</strong> 1st December, 2025
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Introduction */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    1. Introduction
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Welcome to TurboTrade, an algorithmic trading and investment management platform operated by{" "}
                                        <strong className="text-foreground font-semibold">EquityPulse Tech Private Limited</strong> ("Company," "we," "our," or "us").
                                    </p>
                                    <p>
                                        Your privacy is important to us. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you access or use our website, mobile application, APIs, and related services (collectively, the "Services").
                                    </p>
                                    <p>
                                        This Policy is governed by the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, along with applicable SEBI regulations.
                                    </p>
                                    <p>
                                        By using our Services, you consent to the practices described in this Policy.
                                    </p>
                                </div>
                            </Card>

                            {/* Company Details */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    2. Company Details
                                </h2>
                                <div className="prose max-w-none space-y-2 text-muted-foreground leading-relaxed">
                                    <p><strong className="text-foreground font-semibold">EquityPulse Tech Private Limited</strong></p>
                                    <p>RK Complex, Electronic City Phase-1, Bangalore, Karnataka 560100, India.</p>
                                    <p>Email: <a href="mailto:info@turbotrade.ai" className="text-accent hover:underline font-medium transition-colors">info@turbotrade.ai</a></p>
                                </div>
                            </Card>

                            {/* Definitions */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    3. Definitions
                                </h2>
                                <div className="prose max-w-none space-y-3 text-muted-foreground leading-relaxed">
                                    <p><strong className="text-foreground font-semibold">Account:</strong> A user-specific account created to access the Services.</p>
                                    <p><strong className="text-foreground font-semibold">Application:</strong> The TurboTrade platform (web and mobile) operated by the Company.</p>
                                    <p><strong className="text-foreground font-semibold">Cookies:</strong> Small text files placed on your device to improve your browsing experience.</p>
                                    <p><strong className="text-foreground font-semibold">Device:</strong> Any internet-enabled device such as a mobile phone, tablet, or computer.</p>
                                    <p><strong className="text-foreground font-semibold">Personal Data:</strong> Any data about an individual who is identifiable by or in relation to such data.</p>
                                    <p><strong className="text-foreground font-semibold">Processing:</strong> Any operation performed on Personal Data, including collection, storage, use, sharing, or deletion.</p>
                                    <p><strong className="text-foreground font-semibold">Service Providers:</strong> Third parties engaged to support operations, subject to confidentiality obligations.</p>
                                    <p><strong className="text-foreground font-semibold">User ("You"):</strong> Any individual accessing or using the Services.</p>
                                </div>
                            </Card>

                            {/* Information We Collect */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    4. Information We Collect
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        We collect personal data required to provide regulated financial services, verify your identity, and ensure compliance with SEBI and other applicable laws.
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4.1 Personal Information</h3>
                                    <p>When you register or use our Services, we may collect:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Full Name</li>
                                        <li>Email Address</li>
                                        <li>Mobile Number</li>
                                        <li>Date of Birth</li>
                                        <li>PAN and Aadhaar Number (for SEBI-mandated KYC verification)</li>
                                        <li>Communication preferences</li>
                                        <li>Any other details you voluntarily provide during registration or support interactions</li>
                                    </ul>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">4.2 Automatically Collected Information</h3>
                                    <p>We also collect information automatically through your interactions with our platform, such as:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>IP address and approximate location</li>
                                        <li>Browser type, operating system, and device details</li>
                                        <li>Date, time, and duration of access</li>
                                        <li>Usage logs, app performance metrics, and crash data</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* Purpose of Collection */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    5. Purpose of Collection and Use of Data
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>Your personal data is collected and processed for the following lawful purposes:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li><strong className="text-foreground font-semibold">KYC and Regulatory Compliance:</strong> To verify your identity and comply with SEBI, PMLA, and related financial regulations.</li>
                                        <li><strong className="text-foreground font-semibold">Service Delivery:</strong> To provide algorithmic trading, analytics, and portfolio management features.</li>
                                        <li><strong className="text-foreground font-semibold">Communication:</strong> To send account-related notifications, confirmations, and alerts.</li>
                                        <li><strong className="text-foreground font-semibold">Payments:</strong> To process subscription or service payments through third-party payment gateways.</li>
                                        <li><strong className="text-foreground font-semibold">Customer Support:</strong> To respond to your queries and resolve issues.</li>
                                        <li><strong className="text-foreground font-semibold">Security & Fraud Prevention:</strong> To prevent unauthorized access, misuse, or fraudulent activity.</li>
                                        <li><strong className="text-foreground font-semibold">Service Improvement:</strong> To enhance system performance, reliability, and user experience.</li>
                                        <li><strong className="text-foreground font-semibold">Legal Obligations:</strong> To comply with legal, taxation, and audit requirements.</li>
                                    </ul>
                                    <p className="mt-4">
                                        We will not process your personal data for any purpose beyond what is necessary for delivering the Services, except with your consent or as required by law.
                                    </p>
                                </div>
                            </Card>

                            {/* KYC and Regulatory Compliance */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    6. KYC and Regulatory Compliance
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>As a SEBI-regulated entity, TurboTrade performs Know Your Customer (KYC) verification prior to allowing trading activity.</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>We collect your PAN and Aadhaar solely for KYC and compliance purposes.</li>
                                        <li>This information is stored securely and shared only with authorized KYC or regulatory entities when required by law.</li>
                                        <li>We do not share or sell your KYC details to any third party for marketing or non-compliance purposes.</li>
                                        <li>All KYC and personal identity data are encrypted and accessible only to authorized personnel.</li>
                                    </ul>
                                    <p>
                                        We also maintain logs and records as required under SEBI, Prevention of Money Laundering Act (PMLA), and other relevant financial regulations.
                                    </p>
                                </div>
                            </Card>

                            {/* Payment Gateway */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    7. Payment Gateway and Financial Information
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>TurboTrade uses secure, third-party payment gateways to handle subscription and payment processing.</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>These gateways (e.g., Razorpay, Cashfree, or similar providers) may collect limited transaction data such as your name, UPI ID, or card details directly on their secure systems.</li>
                                        <li>All payment transactions are subject to the respective payment gateway's privacy policy and security measures.</li>
                                        <li>The Company receives only transaction confirmations or payment status updates — never full financial credentials.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* Cookies and Tracking */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    8. Use of Cookies and Tracking Technologies
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>We use cookies and similar technologies to:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Maintain session continuity and user authentication</li>
                                        <li>Remember preferences and enhance usability</li>
                                        <li>Analyze site traffic and platform performance</li>
                                    </ul>
                                    <p>
                                        You can disable cookies through your browser settings. However, some platform features may not function optimally if cookies are turned off.
                                    </p>
                                </div>
                            </Card>

                            {/* Data Sharing */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    9. Data Sharing and Disclosure
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>We do not sell or rent your personal information. Data sharing occurs only under the following conditions:</p>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9.1 With Service Providers</h3>
                                    <p>Trusted third-party partners may process your data to provide operational, security, or communication support such as:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Cloud hosting and infrastructure</li>
                                        <li>KYC verification vendors</li>
                                        <li>Communication tools (WhatsApp Business API, email delivery)</li>
                                        <li>Data analytics and performance tracking</li>
                                    </ul>
                                    <p>All service providers are bound by confidentiality and data protection obligations consistent with Indian law.</p>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9.2 Legal and Regulatory Disclosures</h3>
                                    <p>We may disclose your information:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>When required by SEBI, Income Tax authorities, or a court of law;</li>
                                        <li>To comply with AML, KYC, or taxation obligations;</li>
                                        <li>To protect the rights, property, or safety of the Company, its users, or the public.</li>
                                    </ul>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">9.3 Business Transfers</h3>
                                    <p>In the event of a merger, acquisition, or restructuring, user information may be transferred subject to continued protection under this Policy.</p>
                                </div>
                            </Card>

                            {/* Communication */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    10. Communication and Consent
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>By registering on TurboTrade and providing your contact details, you consent to receive:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Transactional messages, alerts, and account updates</li>
                                        <li>Important product or compliance notifications</li>
                                        <li>Optional promotional communications (if opted in)</li>
                                    </ul>
                                    <p>You may withdraw consent or unsubscribe from promotional communications at any time by:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Sending "STOP" on WhatsApp; or</li>
                                        <li>Contacting support@turbotrade.ai</li>
                                    </ul>
                                    <p>Transactional and compliance-related messages may still be sent as required by law.</p>
                                </div>
                            </Card>

                            {/* Data Retention */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    11. Data Retention
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>We retain your data only as long as necessary for:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Providing the Services</li>
                                        <li>Meeting legal and regulatory obligations (including SEBI recordkeeping norms)</li>
                                        <li>Resolving disputes and enforcing agreements</li>
                                    </ul>
                                    <p>After the retention period, data is securely deleted, anonymized, or archived in accordance with industry standards.</p>
                                </div>
                            </Card>

                            {/* Data Security */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    12. Data Security
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>We adopt reasonable security practices as prescribed under the IT Act and SPDI Rules, including:</p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Data encryption (in transit and at rest)</li>
                                        <li>Firewalls and intrusion detection systems</li>
                                        <li>Multi-factor authentication and role-based access control</li>
                                        <li>Regular vulnerability testing and audits</li>
                                        <li>Employee access restricted to authorized personnel only</li>
                                    </ul>
                                    <p>
                                        While we use best efforts to protect your data, no digital system is entirely risk-free. You acknowledge this inherent risk when using online platforms.
                                    </p>
                                </div>
                            </Card>

                            {/* Children's Privacy */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    13. Children's Privacy
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Our Services are intended for individuals aged 18 years and above. We do not knowingly collect personal information from minors. If we become aware of any such data, we will delete it immediately.
                                    </p>
                                </div>
                            </Card>

                            {/* Data Localization */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    14. Data Localization and Storage
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Your data is stored on secure servers located within India or in jurisdictions that provide equivalent data protection standards. Data is retained and processed in compliance with Indian data protection and financial regulations.
                                    </p>
                                </div>
                            </Card>

                            {/* Updates to Policy */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    15. Updates to This Privacy Policy
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        We may periodically update this Privacy Policy to reflect legal, operational, or regulatory changes. The latest version will always be available on our website with the updated "Effective Date." Your continued use of the Services after updates constitutes acceptance of the revised policy.
                                    </p>
                                </div>
                            </Card>

                            {/* Contact */}
                            <Card className="group p-8 bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <h2 className="text-3xl font-bold mb-4 text-accent flex items-center gap-3">
                                    <span className="w-8 h-1 bg-accent rounded-full"></span>
                                    16. Contact and Grievance Officer
                                </h2>
                                <div className="prose max-w-none space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        For any concerns, queries, or rights requests regarding this Privacy Policy or data processing, please email: <a href="mailto:info@turbotrade.ai" className="text-accent hover:underline font-medium transition-colors">info@turbotrade.ai</a>
                                    </p>
                                </div>
                            </Card>

                            {/* CTA Section */}
                            <div className="text-center pt-8">
                                <Link to="/">
                                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        Return to Home
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Privacy;
