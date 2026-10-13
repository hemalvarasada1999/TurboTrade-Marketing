import { WHATSAPP_CHAT_URL, WhatsAppIcon } from "@/lib/social";

/* ══════════════ FLOATING WHATSAPP ══════════════
   Pinned bottom-right on every route and every breakpoint, never hidden on
   scroll. The scroll-to-top button stacks directly above it (see
   ScrollToTopButton), so the two offsets must change together.

   z-[140] keeps it over page content (nothing there goes above 4) but under
   the opening curtain (150, site.css), so on the home page it stays hidden
   behind the meditation artwork and is revealed as the curtain lifts. It is
   also under the fixed header (200), so the mobile menu still covers it. */

const WhatsAppButton = () => (
  <a
    href={WHATSAPP_CHAT_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with TurboTrade on WhatsApp"
    title="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[140] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#1ebe5a] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <WhatsAppIcon className="h-7 w-7" aria-hidden="true" />
  </a>
);

export default WhatsAppButton;
