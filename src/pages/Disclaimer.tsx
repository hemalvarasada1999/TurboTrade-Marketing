import LegalPageLayout from "@/components/LegalPageLayout";
import { Separator } from "@/components/ui/separator";

const Disclaimer = () => {
    return (
        <LegalPageLayout
            title="Disclaimer"
            description="Important information about investment risks and limitations."
        >
            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Investment Risks</h2>
                <p className="text-muted-foreground mb-4">
                    Trading and investing in financial markets involves substantial risk of loss and is not suitable for every investor. The valuation of securities may fluctuate, and, as a result, clients may lose more than their original investment.
                </p>
                <p className="text-muted-foreground">
                    Past performance is not indicative of future results. The investment return and principal value of an investment will fluctuate so that an investor's shares, when redeemed, may be worth more or less than their original cost.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">No Guarantee of Returns</h2>
                <p className="text-muted-foreground mb-4">
                    AlgoWealth does not guarantee any specific level of performance, the success of any investment decision or strategy that our algorithms or services may adopt, or the success of our overall management of any client account.
                </p>
                <p className="text-muted-foreground">
                    Clients and prospective clients should be prepared to bear investment losses. Investment results may vary substantially over time, especially for long-term investments.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Not Financial Advice</h2>
                <p className="text-muted-foreground mb-4">
                    The content and information provided on this platform is for informational purposes only and should not be construed as financial, investment, or legal advice.
                </p>
                <p className="text-muted-foreground">
                    Before making any investment decisions, you should consult with qualified financial advisors who can take into account your individual circumstances, objectives, and risk tolerance.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Algorithmic Trading Risks</h2>
                <p className="text-muted-foreground mb-4">
                    Algorithmic trading strategies carry unique risks including system failures, connectivity issues, and unforeseen market conditions that may result in significant losses.
                </p>
                <p className="text-muted-foreground">
                    No algorithm or system can predict market movements with certainty. Market conditions can change rapidly, and algorithms may not perform as expected in volatile or unprecedented scenarios.
                </p>
            </section>

            <Separator className="my-4" />

            <section className="">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Information</h2>
                <p className="text-muted-foreground">
                    We may provide links to third-party websites or information. AlgoWealth is not responsible for the accuracy, completeness, or timeliness of any information provided by third parties. The inclusion of any link does not imply our endorsement.
                </p>
            </section>
        </LegalPageLayout>
    );
};

export default Disclaimer;
