import LegalPageLayout from "@/components/LegalPageLayout";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            description="How we collect, use, and protect your personal information."
        >
            <section className="">
                <p className="text-muted-foreground mb-4">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-muted-foreground">
                    At AlgoWealth, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                    We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Name, email address, and contact information</li>
                    <li>Account credentials and security information</li>
                    <li>Financial information and investment preferences</li>
                    <li>Communication preferences and customer service interactions</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Automatically Collected Information</h3>
                <p className="text-muted-foreground mb-4">
                    When you access our platform, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>Cookies and similar tracking technologies</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                    We use the collected information for various purposes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and manage your account</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments, questions, and requests</li>
                    <li>Analyze usage patterns and improve user experience</li>
                    <li>Detect, prevent, and address fraud and security issues</li>
                    <li>Comply with legal obligations and enforce our terms</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing</h2>
                <p className="text-muted-foreground mb-4">
                    We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>With your consent or at your direction</li>
                    <li>With service providers who perform services on our behalf</li>
                    <li>For legal reasons or to protect rights and safety</li>
                    <li>In connection with a merger, sale, or acquisition</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                    You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Access and receive a copy of your data</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your data</li>
                    <li>Object to or restrict certain processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent at any time</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:privacy@algowealth.com" className="text-accent hover:underline">
                        privacy@algowealth.com
                    </a>
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default Privacy;
