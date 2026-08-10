/* ══════════════ FAQ ══════════════
   Candour lives here. Several of these answers are the ones somebody screenshots
   after a bad day, which is exactly why they are written the way they are — a
   softened answer here is a broken promise later, and for a SEBI-registered
   research analyst it is also a compliance problem.

   Specifically do not soften: the first answer ("Not always, and anyone who
   promises you that is lying"), the gap sentence in "Can I lose more than I put
   in", or the ISO answer's split between data security and custody of money. */

const QA: { q: string; a: string; open?: boolean }[] = [
  {
    q: "Will this make me money?",
    a: "Not always, and anyone who promises you that is lying. What this does is make sure your trades follow the plan instead of your mood. It cannot stop the market from going against you. Some months you will lose money. That is normal, and you should expect it before you start.",
    open: true,
  },
  {
    q: "I am completely new to this. What is a strategy?",
    a: "A strategy is a set of fixed rules for when to buy and when to sell. Our research team builds them and tests them before they go live. You do not build anything and you do not write any code. You just pick one and set your size.",
  },
  {
    q: "What is a lot?",
    a: "A lot is the smallest quantity you are allowed to trade in options and futures. The exchange decides the size, not us. Every strategy tells you how many lots it trades and how much money you need for that.",
  },
  {
    q: "Do I need to know how the strategies work inside?",
    a: "No. The strategies section above lists everything you do see — the record, the money you need, the worst drawdown and the rest. The exact buy and sell rules stay private, because a rule stops working once everybody knows it. You can still backtest any strategy over any period you choose, and watch one run live on the free trial.",
  },
  {
    q: "Can I still place my own trades?",
    a: "Yes. Keep trading in the same account as usual. TurboTrade only touches the strategies you switch on, at the size you chose. It leaves the rest of your account alone.",
  },
  {
    q: "What am I giving TurboTrade permission to do?",
    a: "Only to place trades in your account. Nothing else. We cannot take money out, move money around, or reach your bank. You can cancel this permission in your broker's app at any time, and you do not need to tell us.",
  },
  {
    q: "Do you hold my money?",
    a: "Never. Your money and your trades stay in your own broker account the entire time. We do not keep customer money and we never take custody of it.",
  },
  {
    q: "How much of my time will this take?",
    a: "About ten minutes to set up. After that, a few minutes in the evening to look through the day's trades. There is nothing for you to do while the market is open.",
  },
  {
    q: "Can I stop it in the middle of the day?",
    a: "Yes. One tap stops new trades and closes the open ones at the current market price. You do not have to call us, wait for us, or ask permission.",
  },
  {
    /* The stop loss is real and belongs here, but it is never a safety claim: a
       stop picks the exit, not the price. Softening the gap sentence would put
       this answer in contradiction with the strategies tile ("one overnight gap
       takes back several of them"). */
    q: "Can I lose more than I put in?",
    a: "Yes, it is possible — though every strategy carries a stop loss decided before the trade is placed, and exits on its own rules without waiting for you. What a stop cannot do is pick its price: if the market gaps past it, the exit lands on the other side. That is why your size is the setting that matters most. You can also switch any strategy off, or all of them, at any moment.",
  },
  {
    q: "Is my account information safe with you?",
    a: "We are certified to ISO/IEC 27001:2022, the international standard for managing information security. It is audited by an outside body, not self-declared. Worth saying plainly what it covers and what it does not: it governs how we handle your data and our systems. Your money is a separate matter — that never leaves your own broker account, and we cannot move it.",
  },
  {
    q: "What if your system stops working while I have a trade open?",
    a: "Your stop loss and target orders are already sitting with the exchange, so an open trade is still looked after. New trades stop. We tell you what happened, and you can close the trade yourself from your broker's app. Your account is never locked to us.",
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
