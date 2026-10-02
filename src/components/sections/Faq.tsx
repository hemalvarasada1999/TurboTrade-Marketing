/* ══════════════ FAQ ══════════════
   Seven questions, merged from fourteen. Every promise the old answers made is
   still here; each is just said once.

   Candour lives here. Several of these answers are the ones somebody screenshots
   after a bad day, which is exactly why they are written the way they are — a
   softened answer here is a broken promise later, and for a SEBI-registered
   research analyst it is also a compliance problem.

   Specifically do not soften: the first answer ("Not always, and anyone who
   promises you that is lying"), the gap sentence in "Can I lose more than I put
   in", or the ISO answer's split between data security and custody of money.

   No backtesting claims: the feature is not available yet. */

const QA: { q: string; a: string; open?: boolean }[] = [
  {
    q: "Will this make me money?",
    a: "Not always, and anyone who promises you that is lying. What this does is make sure your trades follow the plan instead of your mood. It cannot stop the market from going against you. Some months you will lose money. That is normal, and you should expect it before you start.",
    open: true,
  },
  {
    q: "What do I get when I sign up, and how am I charged?",
    a: "Every strategy page, in full: its record, its worst drawdown, its price and the money it needs to run. Nothing trades until you connect your broker, pick a strategy and set your size. After that you pay per strategy, only on the days it places a trade. Strategies wait for conditions that suit them, so a quiet week costs you nothing. That is by design, not a fault.",
  },
  {
    q: "I’m new to this. What is a strategy, and what is a lot?",
    a: "A strategy is a fixed set of rules for when to buy and when to sell. Our research team builds and tests them; you don’t write any code, you just pick one and set your size. A lot is the smallest quantity the exchange lets you trade in options and futures, and every strategy shows how many lots it trades and the money you need. The exact rules stay private, because a rule stops working once everybody knows it. The full record is on every strategy page.",
  },
  {
    q: "What can TurboTrade do in my account?",
    a: "Only place trades for the strategies you switch on, at the size you chose. It cannot take money out, move money around or reach your bank. Your money stays in your own broker account the whole time and we never hold it. You can keep placing your own trades in the same account, and you can cancel our permission in your broker’s app at any time without telling us.",
  },
  {
    q: "How much of my time does it take, and can I stop it?",
    a: "About ten minutes to set up, then a few minutes in the evening to look through the day’s trades. There is nothing to do while the market is open. If you want out, one tap stops new trades and closes the open ones at the current market price. No call, no waiting, no permission needed.",
  },
  {
    /* The stop loss is real and belongs here, but it is never a safety claim: a
       stop picks the exit, not the price. */
    q: "Can I lose more than I put in?",
    a: "Yes, it is possible — though every strategy carries a stop loss decided before the trade is placed, and exits on its own rules without waiting for you. What a stop cannot do is pick its price: if the market gaps past it, the exit lands on the other side. That is why your size is the setting that matters most. You can also switch any strategy off, or all of them, at any moment.",
  },
  {
    q: "Is my data safe, and what if your system goes down?",
    a: "We are certified to ISO/IEC 27001:2022 and audited by an outside body. That covers how we handle your data and our systems; your money is separate, and it never leaves your broker account. If our system stops while you have a trade open, your stop loss and target orders are already sitting with the exchange. New trades stop, we tell you what happened, and you can close the trade yourself from your broker’s app.",
  },
];

export default function Faq() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="s-head ctr">
          <span className="eyebrow">Fair questions</span>
          <h2>Yes, but.</h2>
        </div>
        <div className="faq">
          {QA.map((item) => (
            <details key={item.q} open={item.open}>
              <summary>{item.q}</summary>
              <div className="a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
