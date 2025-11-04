import LegalPageLayout from "@/components/LegalPageLayout";
import { Separator } from "@/components/ui/separator";

const TermsCondition = () => {
    return (
        <LegalPageLayout
            title="Terms & Conditions"
            description="The rules and regulations for using AlgoWealth services."
        >
            <section className="">
                <p className="text-muted-foreground mb-4">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-muted-foreground">
                    Welcome to AlgoWealth. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Please read them carefully.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                    By creating an account, accessing, or using AlgoWealth's services, you agree to comply with and be legally bound by these Terms and Conditions, whether or not you become a registered user.
                </p>
                <p className="text-muted-foreground">
                    If you do not agree to these terms, you must not access or use our services.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Eligibility</h2>
                <p className="text-muted-foreground mb-4">
                    To use our services, you must:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Be at least 18 years of age</li>
                    <li>Have the legal capacity to enter into binding contracts</li>
                    <li>Not be prohibited from using our services under applicable laws</li>
                    <li>Provide accurate and complete registration information</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Account Responsibilities</h2>
                <p className="text-muted-foreground mb-4">
                    When you create an account with us, you are responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized use</li>
                    <li>Ensuring your account information is accurate and up-to-date</li>
                </ul>
                <p className="text-muted-foreground">
                    You may not transfer your account to another person or entity.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Use of Services</h2>
                <p className="text-muted-foreground mb-4">
                    You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use the services in any way that violates applicable laws or regulations</li>
                    <li>Attempt to gain unauthorized access to our systems or networks</li>
                    <li>Interfere with or disrupt the services or servers</li>
                    <li>Use automated systems to access the services without permission</li>
                    <li>Impersonate or misrepresent your affiliation with any person or entity</li>
                    <li>Engage in any fraudulent or deceptive practices</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Investment Risks</h2>
                <p className="text-muted-foreground mb-4">
                    You acknowledge and understand that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>All investments involve risk, including possible loss of principal</li>
                    <li>Past performance does not guarantee future results</li>
                    <li>AlgoWealth does not guarantee any specific investment returns</li>
                    <li>You are solely responsible for your investment decisions</li>
                    <li>You should consult with qualified financial advisors before investing</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                    All content, features, and functionality of our services are owned by AlgoWealth and protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground">
                    You may not reproduce, distribute, modify, or create derivative works from our content without express written permission.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                    To the maximum extent permitted by law, AlgoWealth shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Your use or inability to use our services</li>
                    <li>Investment losses or financial damages</li>
                    <li>Unauthorized access to or alteration of your data</li>
                    <li>System failures or technical errors</li>
                    <li>Any other matter relating to our services</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
                <p className="text-muted-foreground">
                    We reserve the right to suspend or terminate your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                    We may modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the services after changes constitutes acceptance of the modified Terms.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground">
                    If you have questions about these Terms, please contact us at{" "}
                    <a href="mailto:legal@algowealth.com" className="text-accent hover:underline">
                        legal@algowealth.com
                    </a>
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default TermsCondition;
