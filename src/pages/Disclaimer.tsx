import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";

const RiskDisclaimer = () => {
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
                                Investment Risk & <span className="text-amber-600">Liability Disclaimer</span>
                            </h1>
                            <p className="text-slate-600 text-lg">
                                Please read this disclaimer carefully before using TurboTrade services
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-12">
                            {/* Introduction */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">1. Introduction</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        This Investor Disclaimer & Liability Waiver ("Disclaimer") forms part of and must be read in conjunction with the Terms & Conditions and Risk Disclosure Document of TurboTrade, owned and operated by EquityPulse Tech Private Limited ("Company", "We", "Us", "Our").
                                    </p>
                                    <p>
                                        By subscribing to or using TurboTrade's services, the investor ("You", "Your") acknowledges and agrees to all terms contained herein.
                                    </p>
                                </div>
                            </Card>

                            {/* 2. Nature of Services */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">2. Nature of Services</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade is a technology-based platform providing access to algorithmic trading strategies, backtesting tools, and broker integration for automated order placement through official APIs (including Zerodha, Angel One, and others).
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>TurboTrade does not handle investor funds, execute trades directly, or guarantee returns of any kind.</li>
                                        <li>All trades are executed through the investor's own registered broker account, under their explicit authorization.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 3. No Investment Advice or Guarantee */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">3. No Investment Advice or Guarantee</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade does not provide personalized financial, investment, tax, or legal advice.
                                    </p>
                                    <p>Any strategy, signal, or information displayed on the platform:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Is for educational and informational purposes only.</li>
                                        <li>Should not be construed as a recommendation to buy, sell, or hold any security.</li>
                                        <li>Is based on historical data, which may not represent future results.</li>
                                    </ul>
                                    <p>
                                        You acknowledge that investing in securities markets involves risk, and any decision to use a strategy or execute a trade is solely at your own discretion and responsibility.
                                    </p>
                                    <p>
                                        TurboTrade and EquityPulse Tech Private Limited make no assurance or warranty that:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Any strategy will perform as expected.</li>
                                        <li>Any loss can be avoided.</li>
                                        <li>Any return or profit will be achieved.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 4. Investor's Responsibility */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">4. Investor's Responsibility</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>By using the TurboTrade platform, you confirm that:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>You understand the functioning of algorithmic and automated trading.</li>
                                        <li>You have assessed your own risk tolerance, financial capability, and trading experience.</li>
                                        <li>You accept full responsibility for all investment decisions, strategy subscriptions, and trade executions made through your broker account.</li>
                                        <li>You will independently verify the accuracy of any signal, data, or alert before acting on it.</li>
                                        <li>You are solely responsible for monitoring open positions, margin levels, and potential exposure at all times.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 5. Limitation of Liability */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">5. Limitation of Liability</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        To the fullest extent permitted under applicable law, EquityPulse Tech Private Limited, its directors, officers, employees, affiliates, and service providers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including (but not limited to):
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Trading or investment losses;</li>
                                        <li>Missed or delayed trading signals;</li>
                                        <li>Broker execution failures or rejections;</li>
                                        <li>Technology or connectivity failures;</li>
                                        <li>Data feed inaccuracies;</li>
                                        <li>Unauthorized account access;</li>
                                        <li>Regulatory or exchange-related actions;</li>
                                        <li>Force majeure events or natural disasters.</li>
                                    </ul>
                                    <p className="mt-4">
                                        You expressly waive any right to claim compensation, refund, or damages arising from or related to your use of the TurboTrade platform, whether under contract, tort, negligence, equity, or any other legal theory.
                                    </p>
                                </div>
                            </Card>

                            {/* 6. Broker & Third-Party Dependency */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">6. Broker & Third-Party Dependency</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade's services depend on integrations with third-party brokers and data providers.
                                    </p>
                                    <p>The Company:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Does not control broker systems, APIs, or data sources.</li>
                                        <li>Is not responsible for any delays, inaccuracies, or failures in data, order execution, or signal delivery.</li>
                                        <li>Cannot be held liable for losses caused by third-party system errors, disconnections, or market outages.</li>
                                    </ul>
                                    <p className="mt-4">
                                        You acknowledge that all transactions and broker activities are subject to the terms, conditions, and policies of your respective broker and applicable SEBI and exchange regulations.
                                    </p>
                                </div>
                            </Card>

                            {/* 7. Data & Technology Risks */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">7. Data & Technology Risks</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade operates on cloud-based systems and internet infrastructure.
                                    </p>
                                    <p>You agree that:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Temporary outages, slowdowns, or maintenance activities may occur.</li>
                                        <li>Internet connectivity and system latency can cause delays in signal transmission or execution.</li>
                                        <li>Despite security measures, no online platform is completely immune to cyberattacks or unauthorized access.</li>
                                    </ul>
                                    <p className="mt-4">
                                        The Company will not be responsible for any financial or non-financial impact resulting from such occurrences.
                                    </p>
                                </div>
                            </Card>

                            {/* 8. No Fiduciary Relationship */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">8. No Fiduciary Relationship</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        Use of the TurboTrade platform does not create a fiduciary, advisory, or partnership relationship between you and EquityPulse Tech Private Limited.
                                    </p>
                                    <p>
                                        You remain independent and solely accountable for your investment actions and portfolio management.
                                    </p>
                                </div>
                            </Card>

                            {/* 9. Indemnification */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">9. Indemnification</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        You agree to indemnify and hold harmless EquityPulse Tech Private Limited, its officers, employees, and affiliates from and against any and all claims, liabilities, damages, losses, or expenses (including reasonable legal fees) arising from:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Your use or misuse of the platform;</li>
                                        <li>Any breach of these terms or applicable laws;</li>
                                        <li>Any action, inaction, or decision taken by you based on information or strategy from the platform.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 10. No Performance Representation */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">10. No Performance Representation</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        All charts, returns, and analytics shown on TurboTrade are backtested or simulated results based on historical data.
                                    </p>
                                    <p>
                                        Such information is illustrative only and should not be construed as actual, verified, or guaranteed performance.
                                    </p>
                                    <p>
                                        You understand that past performance is not indicative of future returns and that algorithmic models may perform differently in live conditions due to slippage, liquidity, and other market factors.
                                    </p>
                                </div>
                            </Card>

                            {/* 11. Regulatory Compliance */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">11. Regulatory Compliance</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        TurboTrade operates in compliance with SEBI regulations applicable to registered investment advisers and research analysts.
                                    </p>
                                    <p>
                                        However, regulatory interpretations and requirements may evolve over time.
                                    </p>
                                    <p>
                                        The Company reserves the right to modify or discontinue any part of its services to comply with applicable laws, without prior notice or liability.
                                    </p>
                                </div>
                            </Card>

                            {/* 12. Force Majeure */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">12. Force Majeure</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        The Company shall not be held responsible for failure or delay in performing its obligations due to events beyond its reasonable control, including but not limited to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Acts of God, natural disasters, pandemics,</li>
                                        <li>Technical failures, cyberattacks,</li>
                                        <li>Power outages, data center failures,</li>
                                        <li>Regulatory restrictions or government actions.</li>
                                    </ul>
                                </div>
                            </Card>

                            {/* 13. Jurisdiction */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">13. Jurisdiction</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>
                                        This Disclaimer shall be governed by and construed in accordance with the laws of India.
                                    </p>
                                    <p>
                                        All disputes shall be subject to the exclusive jurisdiction of the Courts of Bengaluru, Karnataka.
                                    </p>
                                </div>
                            </Card>

                            {/* 14. Investor Declaration */}
                            <Card className="p-8 bg-white/70 backdrop-blur border-slate-200 shadow-sm">
                                <h2 className="text-3xl font-bold mb-4 text-amber-600">14. Investor Declaration</h2>
                                <div className="prose max-w-none space-y-4 text-slate-700 leading-relaxed">
                                    <p>By using TurboTrade or subscribing to any strategy, you hereby declare that:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>You have read, understood, and voluntarily agreed to this Disclaimer.</li>
                                        <li>You understand and accept all associated risks.</li>
                                        <li>You release and discharge EquityPulse Tech Private Limited from any liability for financial losses, damages, or claims arising from your trading or investment activities.</li>
                                    </ul>
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

export default RiskDisclaimer;
