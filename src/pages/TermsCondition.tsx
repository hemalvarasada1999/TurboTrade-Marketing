import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";

const TermsCondition = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.05),transparent_50%)] pointer-events-none" />
            <div className="relative z-10">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                            <span className="font-semibold">Back to Home</span>
                        </Link>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 border-b border-slate-200">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
                                Terms and <span className="text-amber-600">Conditions</span>
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center text-slate-600 text-sm">
                                <p>
                                    <strong className="text-slate-800">Effective Date:</strong> 1st December, 2025
                                </p>
                                <span className="hidden sm:inline">•</span>
                                <p>
                                    <strong className="text-slate-800">Entity:</strong> EquityPulse Tech Private Limited
                                </p>
                                <span className="hidden sm:inline">•</span>
                                <p>
                                    <strong className="text-slate-800">Application:</strong> TurboTrade
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
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">Introduction</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        Welcome to TurboTrade, a digital platform owned and operated by EquityPulse Tech Private Limited ("Company", "We", "Us", "Our").
                                    </p>
                                    <p>
                                        These Terms and Conditions ("Terms") govern your access to and use of the TurboTrade mobile application, website, and related services (collectively referred to as the "Platform").
                                    </p>
                                    <p>
                                        By accessing or using TurboTrade, you ("User", "Investor", or "Client") agree to be bound by these Terms, our Privacy Policy, and our Risk Disclosure, Investor Disclaimer & Liability Waiver, which together form a legally binding agreement between you and the Company.
                                    </p>
                                    <p className="font-medium text-slate-900">
                                        If you do not agree to these Terms, please discontinue use of the Platform immediately.
                                    </p>
                                </div>
                            </Card>

                            {/* 1. Definitions */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">1. Definitions</h2>
                                <div className="prose max-w-none space-y-3 text-slate-700 leading-relaxed">
                                    <p>For the purposes of this document:</p>
                                    <p><strong className="text-slate-900">"Account"</strong> means the personalized account created by a User to access the Platform.</p>
                                    <p><strong className="text-slate-900">"Broker"</strong> refers to SEBI-registered stockbrokers integrated with TurboTrade through official APIs, such as Zerodha, Angel One, and others.</p>
                                    <p><strong className="text-slate-900">"Company"</strong> means EquityPulse Tech Private Limited, including its directors, employees, representatives, and affiliates.</p>
                                    <p><strong className="text-slate-900">"Platform"</strong> means the TurboTrade mobile application, web portal, APIs, and related digital services operated by the Company.</p>
                                    <p><strong className="text-slate-900">"Service" or "Services"</strong> means the provision of algorithmic trading strategies, analytics, portfolio insights, automation tools, and associated services offered through TurboTrade.</p>
                                    <p><strong className="text-slate-900">"SEBI"</strong> means the Securities and Exchange Board of India.</p>
                                    <p><strong className="text-slate-900">"User Data"</strong> means all personal or financial data submitted, uploaded, or processed through the Platform.</p>
                                </div>
                            </Card>

                            {/* 2. Scope and Nature of Services */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">2. Scope and Nature of Services</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade is a <strong className="text-slate-900">technology-based investment and trading enablement platform</strong> that allows Investors to:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Access algorithmic trading and investment strategies designed by experts.</li>
                                        <li>Subscribe to these strategies through a monthly or periodic subscription plan.</li>
                                        <li>Automate trade execution through integrations with SEBI-registered brokers via official APIs.</li>
                                        <li>Monitor strategy performance, portfolio movements, and analytics through the Platform.</li>
                                    </ol>
                                    <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Important Clarifications:</h3>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>TurboTrade does not handle client funds, bank accounts, or trading capital.</li>
                                        <li>TurboTrade does not execute trades directly; execution occurs through the Investor's own broker account.</li>
                                        <li>TurboTrade does not provide personalized investment advice or portfolio management.</li>
                                        <li>The Investor retains full control of their trading account and authorization at all times.</li>
                                    </ul>
                                    <p>
                                        The Platform is a technological facilitator only and shall not be construed as a financial advisor, portfolio manager, or intermediary under SEBI (Investment Advisers) Regulations, 2013.
                                    </p>
                                </div>
                            </Card>

                            {/* 3. Eligibility */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">3. Eligibility</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>To use TurboTrade, you must:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Be an individual of at least 18 years of age and legally competent under Indian law;</li>
                                        <li>Have a valid PAN, bank, and broker account registered in your name;</li>
                                        <li>Be a resident or entity permitted under Indian laws to trade or invest in securities;</li>
                                        <li>Agree to provide accurate and verifiable information during registration;</li>
                                        <li>Not be restricted or barred by SEBI, NSE, BSE, or any regulatory authority.</li>
                                    </ul>
                                    <p className="mt-4">
                                        By registering, you confirm that all information submitted is true, complete, and current.
                                    </p>
                                </div>
                            </Card>

                            {/* 4. Account Registration and Access */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">4. Account Registration and Access</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Users must create an account on TurboTrade by providing valid details and completing the verification process.</li>
                                        <li>You are responsible for maintaining the confidentiality of your login credentials and all activity under your account.</li>
                                        <li>The Company will not be liable for unauthorized access due to loss or sharing of credentials.</li>
                                        <li>You agree to notify the Company immediately in case of suspected unauthorized use or breach of security.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 5. Subscription and Fees */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">5. Subscription and Fees</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>TurboTrade operates on a subscription-based model.</li>
                                        <li>Fees for strategies, analytics, or other premium features are displayed transparently on the Platform.</li>
                                        <li>Subscription charges are non-refundable, except where required by law or explicitly mentioned otherwise.</li>
                                        <li>The Company reserves the right to modify its pricing plans, introduce new features, or revise charges with prior notice.</li>
                                        <li>Failure to pay applicable fees may result in suspension or termination of access to paid features.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 6. Use of Platform and Services */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">6. Use of Platform and Services</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>By using TurboTrade, you agree that you will:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Use the Platform solely for lawful purposes;</li>
                                        <li>Access strategies for personal investment and not redistribute or resell them;</li>
                                        <li>Ensure compliance with SEBI, NSE, BSE, and other applicable laws;</li>
                                        <li>Not engage in reverse engineering, unauthorized access, scraping, or tampering with data, APIs, or systems;</li>
                                        <li>Use your own broker credentials when linking API access.</li>
                                    </ul>
                                    <p className="mt-4">
                                        The Company reserves the right to suspend or terminate accounts that violate these conditions.
                                    </p>
                                </div>
                            </Card>

                            {/* 7. Broker Integration */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">7. Broker Integration</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade integrates with the customer's chosen SEBI-registered broker for trade execution. Orders are executed via secured API.
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>The Platform acts as a technology intermediary and does not execute or confirm trades.</li>
                                        <li>All trades are placed and settled directly with your broker, under your name and account.</li>
                                        <li>The Company is not responsible for broker-side issues, including execution delays, rejections, system outages, or API limitations.</li>
                                        <li>You acknowledge that all broker transactions are governed by your broker's terms, policies, and SEBI regulations.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 8. Data Collection and Privacy */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">8. Data Collection and Privacy</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade collects and processes limited personal data necessary to provide services — such as name, contact details, trading account identifiers, and usage data.
                                    </p>
                                    <p>We comply with:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>The Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                                        <li>The Information Technology Act, 2000 and Rules</li>
                                    </ul>
                                    <p>
                                        Data is handled in accordance with our Privacy Policy, which explains how information is collected, used, stored, and shared.
                                    </p>
                                    <p className="mt-4">
                                        By using the Platform, you consent to the processing of your data as per the Privacy Policy.
                                    </p>
                                </div>
                            </Card>

                            {/* 9. Intellectual Property */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">9. Intellectual Property</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        All content, software, algorithms, designs, trademarks, and materials available on TurboTrade are the intellectual property of EquityPulse Tech Private Limited.
                                    </p>
                                    <p>
                                        You are granted a limited, non-exclusive, revocable license to use the Platform for personal, non-commercial investment purposes only.
                                    </p>
                                    <p>You may not:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Copy, distribute, modify, or reverse-engineer any component of TurboTrade;</li>
                                        <li>Use Company content or algorithms to create competing products;</li>
                                        <li>Claim any ownership or derivative rights over the intellectual property of the Company.</li>
                                    </ul>
                                    <p className="mt-4">
                                        Violation of this clause may result in immediate account suspension and legal action.
                                    </p>
                                </div>
                            </Card>

                            {/* 10. Platform Availability and Maintenance */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">10. Platform Availability and Maintenance</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade strives to ensure uninterrupted availability. However, we do not guarantee continuous access or error-free operation.
                                    </p>
                                    <p>
                                        Maintenance, updates, or third-party service issues may cause temporary downtime.
                                    </p>
                                    <p>The Company shall not be liable for:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Service interruptions due to maintenance or upgrades;</li>
                                        <li>Data loss caused by hardware/software failure, broker issues, or external factors;</li>
                                        <li>Delays or non-execution of trades due to system or API disruptions.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 11. No Financial Advice */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">11. No Financial Advice</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade facilitates algorithmic execution based on strategies chosen by the user. By using the platform, users acknowledge that all trading involves substantial risk and that TurboTrade does not provide individualized advice or assurances of profit. Users remain solely responsible for the outcomes of executed trades.
                                    </p>
                                    <p>
                                        The Company and its affiliates do not provide personalized investment advice.
                                    </p>
                                    <p>
                                        Any strategy, backtest, or recommendation presented is impersonal and based on algorithmic logic.
                                    </p>
                                    <p>
                                        Users are solely responsible for evaluating whether a strategy is suitable for their personal investment goals, financial condition, and risk appetite.
                                    </p>
                                </div>
                            </Card>

                            {/* 12. Limitation of Liability */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">12. Limitation of Liability</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>To the fullest extent permitted by law:</p>
                                    <p>
                                        The Company, its directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Use or misuse of the Platform,</li>
                                        <li>Trading losses,</li>
                                        <li>Broker execution issues,</li>
                                        <li>API failures, or</li>
                                        <li>Unauthorized access or data breach.</li>
                                    </ul>
                                    <p className="mt-4">
                                        The Company's total cumulative liability shall not exceed the subscription fees paid by the user in the last three (3) months.
                                    </p>
                                </div>
                            </Card>

                            {/* 13. Indemnification */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">13. Indemnification</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        You agree to indemnify and hold harmless EquityPulse Tech Private Limited, its affiliates, officers, and employees from any claims, damages, or expenses (including legal fees) arising from:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Violation of these Terms,</li>
                                        <li>Misuse of the Platform,</li>
                                        <li>Breach of any law or regulation, or</li>
                                        <li>Disputes with brokers or third parties resulting from your actions.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 14. Compliance with SEBI and Indian Laws */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">14. Compliance with SEBI and Indian Laws</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade operates in compliance with applicable Indian laws and SEBI Research Analyst Regulations, 2014.
                                    </p>
                                    <p>
                                        Our SEBI Registration Number is <strong className="text-slate-900">INH00000XXXX</strong>.
                                    </p>
                                    <p>
                                        We reserve the right to modify services or restrict access to ensure continued compliance with regulatory or exchange requirements.
                                    </p>
                                </div>
                            </Card>

                            {/* 15. Communication and Notices */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">15. Communication and Notices</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>All communication from the Company shall be sent via official channels such as:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>The TurboTrade app or website notifications,</li>
                                        <li>Registered email ID, or</li>
                                        <li>Official support contact.</li>
                                    </ul>
                                    <p className="mt-4">
                                        Users must ensure their registered email and phone number remain valid for receiving important updates or disclosures.
                                    </p>
                                </div>
                            </Card>

                            {/* 16. Termination */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">16. Termination</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>The Company reserves the right to terminate or suspend access to TurboTrade without prior notice in case of:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Breach of Terms or applicable law,</li>
                                        <li>Fraudulent activity,</li>
                                        <li>Misuse of the Platform, or</li>
                                        <li>Regulatory direction.</li>
                                    </ul>
                                    <p>
                                        You may terminate your account anytime by notifying the Company and ceasing use of the Platform.
                                    </p>
                                    <p className="mt-4">
                                        Upon termination, all rights granted to you under these Terms shall immediately cease.
                                    </p>
                                </div>
                            </Card>

                            {/* 17. Governing Law and Jurisdiction */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">17. Governing Law and Jurisdiction</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        These Terms are governed by and construed under the laws of India.
                                    </p>
                                    <p>
                                        Any dispute or claim shall be subject to the exclusive jurisdiction of the Courts of Bengaluru, Karnataka.
                                    </p>
                                </div>
                            </Card>

                            {/* 18. Amendments */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">18. Amendments</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        The Company may revise these Terms from time to time to reflect changes in law, technology, or business operations.
                                    </p>
                                    <p>
                                        Updated versions will be published on the Platform, and continued use shall imply acceptance of the revised Terms.
                                    </p>
                                </div>
                            </Card>

                            {/* 19. Contact Information */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">19. Contact Information</h2>
                                <div className="prose max-w-none space-y-3 text-slate-700 leading-relaxed">
                                    <p><strong className="text-slate-900">EquityPulse Tech Private Limited</strong></p>
                                    <p>
                                        <strong className="text-slate-900">Registered Office:</strong> RK Complex, Electronic City Phase-1, Bengaluru, Karnataka – 560100, India
                                    </p>
                                    <p>
                                        <strong className="text-slate-900">Email:</strong> <a href="mailto:support@turbotrade.in" className="text-amber-600 hover:text-amber-700">support@turbotrade.in</a>
                                    </p>
                                    <p>
                                        <strong className="text-slate-900">Website:</strong> <a href="https://turbotrade.in" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">https://turbotrade.in</a>
                                    </p>
                                    <p>
                                        <strong className="text-slate-900">SEBI Registration No.:</strong> INH00000XXXX
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default TermsCondition;
