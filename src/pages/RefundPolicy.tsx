import LegalPageLayout from "@/components/LegalPageLayout";
import { Separator } from "@/components/ui/separator";

const RefundPolicy = () => {
    return (
        <LegalPageLayout
            title="Cancellation & Refund Policy"
            description="Our policies regarding subscription cancellations and refu4ds."
        >
            <section className="">
                <p className="text-muted-foreground mb-4">
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-muted-foreground">
                    This Cancellation & Refund Policy explains the terms and conditions for cancelling your AlgoWealth subscription and requesting refunds.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Subscription Cancellation</h2>
                <p className="text-muted-foreground mb-4">
                    You may cancel your subscription at any time through your account settings or by contacting our support team. Upon cancellation:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>You will retain access to paid features until the end of your current billing period</li>
                    <li>Your subscription will not automatically renew</li>
                    <li>No further charges will be made to your payment method</li>
                    <li>You may re-subscribe at any time</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">30-Day Money-Back Guarantee</h2>
                <p className="text-muted-foreground mb-4">
                    We offer a 30-day money-back guarantee for new subscribers. If you are not satisfied with our services, you may request a full refund within 30 days of your initial subscription purchase.
                </p>
                <p className="text-muted-foreground mb-4">
                    To qualify for the money-back guarantee:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>You must be a first-time subscriber</li>
                    <li>The request must be made within 30 days of your initial payment</li>
                    <li>You must submit a refund request through our official channels</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Eligibility</h2>
                <p className="text-muted-foreground mb-4">
                    Beyond the 30-day guarantee period, refunds may be issued at our discretion in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Technical issues that prevented service access for an extended period</li>
                    <li>Duplicate charges or billing errors</li>
                    <li>Service downtime exceeding our service level agreement</li>
                    <li>Other exceptional circumstances reviewed on a case-by-case basis</li>
                </ul>
                <p className="text-muted-foreground">
                    Refunds are not typically issued for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Investment losses or poor trading performance</li>
                    <li>Change of mind after 30-day period</li>
                    <li>Failure to cancel before renewal</li>
                    <li>Partial billing periods</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">How to Request a Refund</h2>
                <p className="text-muted-foreground mb-4">
                    To request a refund, please follow these steps:
                </p>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                    <li>Contact our support team at <a href="mailto:support@algowealth.com" className="text-accent hover:underline">support@algowealth.com</a></li>
                    <li>Include your account email and reason for the refund request</li>
                    <li>Provide any relevant transaction or subscription details</li>
                    <li>Allow 5-7 business days for review and processing</li>
                </ol>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Processing</h2>
                <p className="text-muted-foreground mb-4">
                    Once approved, refunds will be processed according to the following timeline:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                    <li>Processing time: 5-7 business days from approval</li>
                    <li>Credit card refunds: 7-10 business days to appear in your account</li>
                    <li>Bank transfer refunds: 3-5 business days to appear in your account</li>
                </ul>
                <p className="text-muted-foreground">
                    Refunds will be issued to the original payment method used for the purchase.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Annual Subscriptions</h2>
                <p className="text-muted-foreground mb-4">
                    For annual subscriptions:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>The 30-day money-back guarantee applies to new annual subscriptions</li>
                    <li>After 30 days, refunds are prorated based on unused months (at our discretion)</li>
                    <li>A minimum retention period of one month may apply</li>
                    <li>Discounted annual rates are not refunded at monthly rate equivalents</li>
                </ul>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Account Closure</h2>
                <p className="text-muted-foreground">
                    Upon receiving a refund, your account may be closed and access to all services will be terminated immediately. Any data associated with your account will be handled according to our Privacy Policy.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Questions</h2>
                <p className="text-muted-foreground">
                    If you have questions about our Cancellation & Refund Policy, please contact us at{" "}
                    <a href="mailto:support@algowealth.com" className="text-accent hover:underline">
                        support@algowealth.com
                    </a>
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default RefundPolicy;
