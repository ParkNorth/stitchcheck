import type { Job } from "./products";

export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; html: string }
  | { type: "ul"; items: string[] }
  | { type: "definition"; term: string; body: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][]; labelCol?: boolean }
  | { type: "short"; text: string }
  | { type: "links"; items: { label: string; href: string }[] };

export interface Guide {
  slug: string;
  title: string;
  h1: string;
  standfirst: string;
  metaTitle: string;
  description: string;
  /** Awareness pages do not open with a product CTA; CTAs sit at the end. */
  awareness?: boolean;
  /** Which hub the guide feeds. */
  feeds: Job;
  blocks: Block[];
  ctaTitle: string;
  ctaSlugs: string[];
  ctaMore: { label: string; href: string };
  faqs: { q: string; a: string }[];
  published: string;
  updated: string;
  /** Draft guides render but carry a "draft" note and stay out of the sitemap until copy lands. */
  status: "published" | "draft";
}

export const guides: Guide[] = [
  {
    slug: "serger-vs-sewing-machine",
    title: "Serger vs Sewing Machine",
    h1: "Serger vs sewing machine: which do you need first?",
    standfirst:
      "They don't compete. One builds the garment; the other finishes its seams. Here's how to tell which one you're missing.",
    metaTitle: "Serger vs Sewing Machine: Which Do You Need First? (2026)",
    description:
      "A serger seams, trims and overcasts in one pass; a sewing machine builds the garment. What each does, a side-by-side table, and which to buy first if you can only buy one.",
    awareness: true,
    feeds: "serger",
    blocks: [
      { type: "h2", id: "what-each-does", text: "What each machine does" },
      {
        type: "p",
        html: "A sewing machine makes a lockstitch with one top thread and a bobbin. It sews seams, zippers, buttonholes and topstitching: everything that holds a garment together.",
      },
      {
        type: "p",
        html: "A serger stitches the seam, trims the allowance and wraps the raw edge in one pass. It's faster on knits and gives the clean inside finish you see on shop-bought clothes, but it can't put in a zipper or a buttonhole.",
      },
      {
        type: "definition",
        term: "Serger (overlocker)",
        body: "A machine that sews, trims and overcasts a seam edge in one pass, using three to five threads, loopers instead of a bobbin, and a built-in knife.",
      },
      { type: "h2", id: "side-by-side", text: "Side by side" },
      {
        type: "table",
        head: ["Job", "Sewing machine", "Serger"],
        labelCol: true,
        rows: [
          ["Threads", "Top thread + bobbin", "3–5 cones, loopers"],
          ["Trims fabric", "No", "Yes, built-in knife"],
          ["Stretch seams", "With a stretch stitch", "Natively"],
          ["Zippers, buttonholes", "Yes", "No"],
          ["Topstitching", "Yes", "No"],
        ],
      },
      { type: "h2", id: "which-first", text: "Which to buy first" },
      {
        type: "p",
        html: "If you don't own a capable sewing machine, buy that first. A serger can't finish a garment on its own. If you already sew regularly and most of your projects are knits, a serger is the upgrade you'll feel most.",
      },
      {
        type: "short",
        text: "No machine yet: sewing machine. Sewing knits every week: add a serger. Hemming activewear: you want a coverstitch, not a serger.",
      },
      { type: "h2", id: "when-both", text: "When you need both" },
      {
        type: "p",
        html: "Most people who make clothing end up with both: the sewing machine for construction and details, the serger for seams and finishing. Quilters and bag makers rarely need a serger at all.",
      },
      {
        type: "links",
        items: [
          { label: "Coverstitch vs serger", href: "/guides/coverstitch-vs-serger" },
          { label: "What is a serger?", href: "/guides/what-is-a-serger" },
        ],
      },
    ],
    ctaTitle: "Machines we'd start with",
    ctaSlugs: ["brother-1034d", "juki-mo-654de", "brother-2340cv"],
    ctaMore: { label: "All serger picks", href: "/best-sergers" },
    faqs: [
      {
        q: "Can a serger replace a sewing machine?",
        a: "No. A serger cannot sew a zipper, a buttonhole, topstitching or a plain straight seam inside a garment. It finishes and seams edges. You need a sewing machine for construction.",
      },
      {
        q: "Can a sewing machine do what a serger does?",
        a: "Partly. An overcast or zigzag stitch finishes an edge, and a stretch stitch handles knits. It will not trim as it sews and the finish is not as clean, but it is enough for most woven projects.",
      },
      {
        q: "Is a serger the same as an overlocker?",
        a: "Yes. Serger is the North American name, overlocker the British one. Same machine.",
      },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "what-is-a-serger",
    title: "What Is a Serger?",
    h1: "What is a serger, and what does it actually do?",
    standfirst:
      "A serger is a machine that seams, trims and wraps a fabric edge in one pass, using loopers and a knife instead of a bobbin. Here is what that means in practice, and what the thread counts mean.",
    metaTitle: "What Is a Serger? What It Does, 2/3/4 Thread Explained (2026)",
    description:
      "A serger, or overlocker, seams, trims and overcasts in one pass with 2 to 5 threads, loopers and a built-in knife. What it does, what it can't, what 2/3/4 thread means, and what differential feed is.",
    awareness: true,
    feeds: "serger",
    blocks: [
      { type: "h2", id: "definition", text: "The one-paragraph answer" },
      {
        type: "p",
        html: "A serger (called an overlocker outside North America) is a sewing machine that sews a seam, trims the seam allowance with a built-in knife, and wraps the raw edge in thread, all in one pass. It uses loopers instead of a bobbin and runs three to five threads at once. The result is the finished edge you see inside store-bought clothes.",
      },
      {
        type: "definition",
        term: "Looper",
        body: "A curved arm below or beside the needle plate that carries thread around the fabric edge. Sergers have an upper and a lower looper in place of a bobbin.",
      },
      { type: "h2", id: "thread-counts", text: "What 2, 3, 4 and 5 thread means" },
      {
        type: "table",
        head: ["Threads", "What it makes", "Use it for"],
        labelCol: true,
        rows: [
          ["2-thread", "Light overcast edge, no seam strength", "Finishing edges on light wovens, rolled hems"],
          ["3-thread", "Overlock edge with light seam", "Edge finishing, knits where the seam is sewn elsewhere"],
          ["4-thread", "Overlock with a safety stitch", "Seaming knits: the everyday setting"],
          ["5-thread", "Chain stitch + overlock", "Wovens that need a strong seam and a finished edge"],
        ],
      },
      {
        type: "p",
        html: "Most home sergers are 3/4-thread. Add a 2-thread option and you get finer edges on light fabric; add a 5th thread and chain stitch and you are into combination machines that also coverstitch.",
      },
      { type: "h2", id: "differential-feed", text: "Differential feed" },
      {
        type: "definition",
        term: "Differential feed",
        body: "Two sets of feed dogs moving at different speeds, so knits don't stretch into waves and slippery fabric doesn't pucker. Set it above 1 to gather or to ease knits; below 1 to stretch a lettuce edge.",
      },
      { type: "h2", id: "cannot", text: "What a serger cannot do" },
      {
        type: "ul",
        items: [
          "Sew a zipper, a buttonhole, or topstitching.",
          "Sew inside a garment away from an edge: the knife is always on.",
          "Replace a coverstitch machine for hems (a serger's rolled hem is a different look).",
        ],
      },
      { type: "h2", id: "threading", text: "Threading: manual, lay-in, or air" },
      {
        type: "p",
        html: "Threading is the thing people hate about sergers. Budget machines use colour-coded lay-in paths and a manual lower looper. Air-threading models push looper thread through a tube with a button. The stitches are the same; you are paying for the minutes saved every colour change.",
      },
      {
        type: "short",
        text: "A serger finishes and seams edges fast. It does not build a garment. If you sew knits every week, it is the upgrade you will feel most; if you sew quilts or bags, you may never need one.",
      },
      {
        type: "links",
        items: [
          { label: "Serger vs sewing machine", href: "/guides/serger-vs-sewing-machine" },
          { label: "Coverstitch vs serger", href: "/guides/coverstitch-vs-serger" },
        ],
      },
    ],
    ctaTitle: "Sergers we'd start with",
    ctaSlugs: ["brother-1034d", "juki-mo-654de", "juki-mo-1000"],
    ctaMore: { label: "All serger picks", href: "/best-sergers" },
    faqs: [
      { q: "Is a serger worth it for a beginner?", a: "Only after you own a capable sewing machine and find yourself finishing seams by zigzag every week. Then a 3/4-thread serger is the biggest single upgrade for knits." },
      { q: "What is the difference between a serger and an overlocker?", a: "None. Serger is the North American term, overlocker the British and Australian one." },
      { q: "Can a serger do a rolled hem?", a: "Yes. Most 3/4-thread home sergers convert to a 2- or 3-thread rolled hem for scarves, napkins and lightweight edges." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "coverstitch-vs-serger",
    title: "Coverstitch vs Serger",
    h1: "Coverstitch vs serger: two machines, two jobs",
    standfirst:
      "A serger seams and finishes edges. A coverstitch machine hems knits with the twin rows you see on a T-shirt. Most people who own one end up owning both.",
    metaTitle: "Coverstitch vs Serger: What Each Does and Which to Buy (2026)",
    description:
      "Coverstitch machines hem knits with parallel needle rows and a looper underneath; sergers seam, trim and overcast edges. What each does, the combo-machine trade-off, and which to buy first.",
    awareness: true,
    feeds: "serger",
    blocks: [
      { type: "h2", id: "jobs", text: "Two jobs, not two grades" },
      {
        type: "p",
        html: "A serger works at the edge: it sews the seam, cuts the allowance and wraps the raw edge. A coverstitch machine works anywhere on the fabric: two or three needles on top, one looper underneath, no knife. That is the stretch hem on activewear and the neckline finish on a T-shirt.",
      },
      {
        type: "definition",
        term: "Coverstitch",
        body: "Two or three parallel rows of straight stitching on top, with a looper thread zigzagging between them underneath. It stretches with the fabric and covers a raw edge on the hem.",
      },
      { type: "h2", id: "side-by-side", text: "Side by side" },
      {
        type: "table",
        head: ["Job", "Serger", "Coverstitch"],
        labelCol: true,
        rows: [
          ["Seams two pieces", "Yes", "No (chain stitch only)"],
          ["Trims the edge", "Yes, knife", "No"],
          ["Hems knits", "Rolled hem only", "Yes, the store-bought look"],
          ["Sews away from an edge", "No", "Yes"],
          ["Threads", "3–5", "2–4"],
        ],
      },
      { type: "h2", id: "combo", text: "Combination machines" },
      {
        type: "p",
        html: "Some machines do both, converting between overlock and coverstitch. They save space and money against two machines. The trade-off is conversion time each switch, which is why people who do a lot of knit garments still end up with two dedicated machines.",
      },
      { type: "short", text: "Buy the serger first. Add a coverstitch when hems, not seams, are what you are unhappy with." },
      {
        type: "links",
        items: [
          { label: "What is a serger?", href: "/guides/what-is-a-serger" },
          { label: "Serger vs sewing machine", href: "/guides/serger-vs-sewing-machine" },
        ],
      },
    ],
    ctaTitle: "Coverstitch and serger picks",
    ctaSlugs: ["brother-2340cv", "janome-coverpro-2000cpx", "juki-mo-654de"],
    ctaMore: { label: "All serger picks", href: "/best-sergers" },
    faqs: [
      { q: "Can a coverstitch machine replace a serger?", a: "No. It does not trim or wrap an edge, and its chain stitch is not a seam you would trust on a garment. It hems." },
      { q: "Can I hem knits without a coverstitch?", a: "Yes, with a twin needle on a sewing machine. The look is close; the stretch and durability are not." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "mechanical-vs-computerized",
    title: "Mechanical vs Computerized Sewing Machines",
    h1: "Mechanical vs computerized sewing machines: what actually differs",
    standfirst:
      "Motors, frames and feed decide how a machine sews. The mechanical or computerized choice decides how you control it, what it costs to fix, and how many stitches you will never use.",
    metaTitle: "Mechanical vs Computerized Sewing Machine: Which to Buy (2026)",
    description:
      "What is mechanically different between a mechanical and a computerized sewing machine, which is better for heavy fabric, quilting and beginners, and what each costs to service.",
    feeds: "heavy-duty",
    blocks: [
      { type: "h2", id: "difference", text: "The actual difference" },
      {
        type: "p",
        html: "A mechanical machine selects stitches, length and width with dials that move cams and levers. A computerized machine uses a stepper motor and a board to position the needle and feed, so you get a needle up/down button, speed limiter, one-touch buttonholes and a stitch memory. The motor that drives the needle and the frame that holds it are the same idea in both.",
      },
      { type: "h2", id: "heavy-fabric", text: "For heavy fabric" },
      {
        type: "p",
        html: "Neither wins on paper. Motor torque, presser-foot lift and feed decide thick seams. In practice, the mechanical heavy-duty tier (Janome HD3000, Singer Heavy Duty) is cheaper for the same motor, and the straight-stitch specialists (Juki TL) are mechanical because they do one thing.",
      },
      { type: "h2", id: "quilting", text: "For quilting" },
      {
        type: "p",
        html: "Computerized machines bring the features quilters use every hour: needle down, a speed limiter for free motion, and a wide throat on the Memory Craft class. Mechanical straight-stitch quilters bring speed. Many quilters own one of each.",
      },
      { type: "h2", id: "service", text: "Service and lifespan" },
      {
        type: "p",
        html: "Mechanical machines are cheaper to service and rarely become unrepairable. Computerized boards can be end-of-life when parts stop. Neither is fragile; the difference is what happens at year twelve.",
      },
      {
        type: "table",
        head: ["Factor", "Mechanical", "Computerized"],
        labelCol: true,
        rows: [
          ["Stitch selection", "Dials", "Buttons, screen"],
          ["Needle up/down", "Handwheel", "Button"],
          ["Speed limiter", "Foot control only", "Slider"],
          ["Buttonhole", "4-step or 1-step lever", "1-step, sized"],
          ["Service cost", "Lower", "Higher, board-dependent"],
          ["Price for same motor", "Lower", "Higher"],
        ],
      },
      { type: "short", text: "Buy mechanical for heavy fabric on a budget or for a machine that outlives its warranty by a decade. Buy computerized for quilting features and buttonholes you will actually use." },
    ],
    ctaTitle: "One of each",
    ctaSlugs: ["janome-hd3000", "janome-mc6650", "juki-tl-2010q"],
    ctaMore: { label: "Best heavy-duty machines", href: "/best-heavy-duty-sewing-machines" },
    faqs: [
      { q: "Are computerized sewing machines less durable?", a: "The mechanics are as durable. The board is the part that can become unrepairable when the maker stops supplying it, typically well past ten years." },
      { q: "Is a mechanical machine better for beginners?", a: "It is simpler and cheaper to fix. A computerized machine is easier to use day to day. Choose on budget and on whether you want the buttons." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "how-to-choose-a-quilting-machine",
    title: "How to Choose a Quilting Machine",
    h1: "How to choose a quilting machine: domestic, mid-arm or long-arm",
    standfirst:
      "Throat space decides the tier. Everything else is a feature. Here is how much room each tier gives you, what it costs, and when to move up.",
    metaTitle: "How to Choose a Quilting Machine: Throat Space, Tiers and Frames (2026)",
    description:
      "Domestic straight-stitch quilters, sit-down mid-arms and stand-up long-arms compared by throat space, speed, frame requirement and room footprint. When to move up a tier.",
    feeds: "quilting",
    blocks: [
      { type: "h2", id: "throat", text: "Throat space is the spec" },
      {
        type: "definition",
        term: "Throat space (harp space)",
        body: "The distance from the needle to the machine body, and its height. It is how much rolled quilt fits through while you stitch the middle.",
      },
      {
        type: "table",
        head: ["Tier", "Throat", "Where it lives", "Frame"],
        labelCol: true,
        rows: [
          ["Typical beginner machine", "about 6 in", "Table", "No"],
          ["Domestic quilter (Juki TL class)", "8.5–10 in", "Table", "Optional"],
          ["Sit-down mid-arm", "16–18 in", "Its own table", "No"],
          ["Stand-up long-arm", "15–26 in", "A room", "Yes, sold separately"],
        ],
      },
      { type: "h2", id: "domestic", text: "Domestic straight-stitch quilters" },
      {
        type: "p",
        html: "The Juki TL tier: 1,500 spm, straight stitch only, 8.5 to 9 in of throat, a knee lifter and drop feed dogs. It handles lap and throw quilts on a table and pieces fast. You keep a second machine for zigzag.",
      },
      { type: "h2", id: "midarm", text: "Sit-down mid-arms" },
      {
        type: "p",
        html: "A long-arm head mounted in a table, so you move the quilt, not the machine. 16 to 18 in of throat without a frame's footprint. The step for people who quilt whole tops on a domestic and want room, not a room.",
      },
      { type: "h2", id: "longarm", text: "Stand-up long-arms" },
      {
        type: "p",
        html: "The machine rides on a frame and you move it over a quilt loaded on rollers. 15 in is the entry (Handi Quilter Moxie class); 20 in and up is where professional quilters work. Budget the frame, stitch regulation, delivery and a wall at least 10 feet long.",
      },
      { type: "h2", id: "move-up", text: "When to move up" },
      {
        type: "ul",
        items: [
          "You have run out of throat on a domestic on more than one quilt.",
          "You quilt whole tops for others, or several a month for yourself.",
          "You have the room, and the frame will not be folded away.",
        ],
      },
      { type: "short", text: "Start at the domestic tier unless you already know throat space is your problem. Read the long-arm cost guide before pricing a frame." },
      { type: "links", items: [{ label: "How much does a long-arm cost?", href: "/guides/how-much-does-a-long-arm-cost" }] },
    ],
    ctaTitle: "One per tier",
    ctaSlugs: ["juki-tl-2010q", "janome-mc6650", "handi-quilter-moxie"],
    ctaMore: { label: "Best quilting machines", href: "/best-quilting-machines" },
    faqs: [
      { q: "Is 9 inches of throat enough for quilting?", a: "For lap and throw quilts on a table, yes. Queen and king tops are possible with rolling and patience; that is where people move to a mid-arm or long-arm." },
      { q: "What is a mid-arm quilting machine?", a: "A long-arm style head with 16 to 18 in of throat mounted in a sit-down table. You move the quilt under the needle." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "how-much-does-a-long-arm-cost",
    title: "How Much Does a Long-Arm Quilting Machine Cost?",
    h1: "How much does a long-arm quilting machine cost?",
    standfirst:
      "The head is the smallest line on the invoice that matters. Frame, stitch regulation, robotics and delivery are where the number moves. Every figure below is a published or dealer-displayed price, dated.",
    metaTitle: "How Much Does a Long-Arm Quilting Machine Cost? Real Totals (2026)",
    description:
      "Long-arm quilting machine prices by tier, plus the frame, stitch regulator, robotics, delivery and used-market ranges that make up the real total. Sourced and dated, no estimates.",
    feeds: "quilting",
    blocks: [
      { type: "h2", id: "short-answer", text: "The short answer" },
      {
        type: "p",
        html: "A stand-up long-arm on a frame starts around $4,500 to $6,000 at the 15 in entry tier and runs to $50,000 and up for a 26 to 30 in computerized machine with delivery and training included. Sit-down mid-arms with a table sit between $6,000 and $9,000. A domestic straight-stitch quilter that people call a long-arm in listings is $600 to $1,900 and has no frame at all.",
      },
      {
        type: "definition",
        term: "Long-arm",
        body: "A quilting head with 18 in or more of throat space, moved over a quilt loaded on a frame. 15 to 16 in heads sold on frames are entry long-arms; 16 to 18 in sit-down heads are mid-arms. The name in a listing is not a measurement.",
      },
      { type: "h2", id: "tiers", text: "Price by tier" },
      {
        type: "p",
        html: "Prices seen on 2026-09-29 at the sources named in the research file. MSRP means the maker's or dealer's stated list; dealer means one dealer's displayed price that day. Dealer-only brands often publish nothing, and we say so rather than guess.",
      },
      {
        type: "table",
        caption: "Machine price by tier, frame noted separately",
        head: ["Tier", "Throat", "Price seen", "Frame"],
        labelCol: true,
        rows: [
          ["Domestic straight-stitch quilter (Brother PQ1600S, Juki TL-2010Q, TL-18QVP)", "8.5 to 8.7 in", "$580 to $1,899 (dealer)", "None; sits on a table"],
          ["Sit-down mid-arm (Handi Quilter Sweet Sixteen, Capri 18, Juki Miyabi J-350QVP S)", "16 to 18 in", "$6,495 to $9,000 (dealer or MSRP)", "Table included"],
          ["Entry stand-up long-arm (Handi Quilter Moxie, Grace Q'nique 15R)", "15 in", "$4,495 to $5,995 with frame", "8 ft frame bundled"],
          ["Stand-up long-arm, 18 to 19 in (Moxie XL, Q'nique 19X, Gammill entry 18)", "18 to 19 in", "$5,499 to $16,499", "Varies; Gammill includes it"],
          ["Long-arm, 20 in and up, free motion (HQ Amara 20, APQS Lenni, Innova M20)", "20 to 24 in", "$12,495 to $19,999", "Usually included"],
          ["Long-arm, 20 in and up, computerized (Gammill Vision and Statler, Innova with Autopilot, HQ Infinity with Pro-Stitcher)", "20 to 30 in", "$33,490 to $52,999", "Included"],
        ],
      },
      { type: "h2", id: "adds", text: "What gets added to the head price" },
      {
        type: "table",
        caption: "Add-on lines and the prices we could source",
        head: ["Line", "Price seen", "Note"],
        labelCol: true,
        rows: [
          ["Frame, hoop style (Grace Q-Zone Hoop)", "$1,399", "Quilts crib to king by repositioning"],
          ["Frame, queen width (Grace Q-Zone Queen)", "$1,899 to $2,200", "Pro upgrade $900"],
          ["Frame, Handi Quilter Loft 8 ft", "Bundled with Moxie at $5,995 MSRP", "Standalone price not published"],
          ["Stitch regulation", "Included on Moxie and Q'nique 15R", "Optional BSR foot on Bernina; none for the Juki TL class"],
          ["Robotics: Grace QCT5", "$2,294 to $3,654", "Discontinued; QCT6 price not published"],
          ["Robotics: Handi Quilter Pro-Stitcher", "$10,995", "Amara, Forte, Infinity class"],
          ["Robotics: APQS Quilt Path", "$6,500 to $10,900", "Dealers disagree; see research file"],
          ["Robotics: Gammill Statler Ascend upgrade", "$8,499", "Retrofit on a non-Statler Gammill: $32,999"],
          ["Robotics: Innova Autopilot Mach 3", "About $16,000", "Difference between the M20 free motion and M20 Autopilot list prices"],
          ["Delivery, setup, training", "Included by Gammill in the lower 48", "APQS quotes shipping separately; Handi Quilter and Grace frames ship flat for owner assembly"],
        ],
      },
      { type: "h2", id: "used", text: "Buying used" },
      {
        type: "p",
        html: "Used long-arms hold value because dealers service them. Listings we saw on the date above ran from $2,195 for a used Sweet Sixteen to $28,000 to $29,000 for a Gammill with Statler Ascend. Manufacturer refurbished programs start around $12,499 at Gammill. Budget a service visit and a re-level on delivery, and confirm the frame and any regulator come with it.",
      },
      {
        type: "table",
        caption: "Used listings seen 2026-09-29",
        head: ["Machine", "Listed price", "Where"],
        labelCol: true,
        rows: [
          ["Handi Quilter Sweet Sixteen, sit-down", "$2,195", "Dealer resale"],
          ["Grace Q'nique 15R with Continuum king frame", "$6,000", "APQS forum"],
          ["Handi Quilter Avante 18 on 10 ft frame", "$8,225", "Dealer resale"],
          ["Gammill Vision 2.0 18-8", "$9,000 to $12,500", "Private sale"],
          ["Handi Quilter Infinity 26 with Pro-Stitcher, 2021", "$14,500", "Private sale"],
          ["Innova 22", "$15,000", "APQS forum"],
          ["APQS Millie, 10 ft, Quilt Path", "$24,500", "APQS forum"],
        ],
      },
      { type: "h2", id: "consumables", text: "Consumables to budget" },
      {
        type: "ul",
        items: [
          "M class bobbins for the Moxie and Q'nique heads; L class TL bobbins for the domestic Juki tier.",
          "134 system needles on the Moxie; 135x5 or DPx5 on the Q'nique, with 134 listed as equivalent.",
          "Rulers, a lamp and a stool for sit-down heads.",
          "Thread by the cone, not the spool.",
        ],
      },
      { type: "short", text: "Price the frame and delivery before you fall for a head. The entry long-arm on a frame is a room-sized commitment, not a machine purchase." },
    ],
    ctaTitle: "Where to start",
    ctaSlugs: ["handi-quilter-moxie", "juki-tl-2010q", "janome-mc6650"],
    ctaMore: { label: "Best quilting machines", href: "/best-quilting-machines" },
    faqs: [
      { q: "Does the price include the frame?", a: "Usually not for stand-up long-arms above the entry tier. Moxie and Q'nique 15R bundles include an 8 ft frame; Gammill includes frame, delivery and training. Sit-down mid-arms include their table. Check the listing line by line." },
      { q: "How much is the cheapest long-arm?", a: "The cheapest stand-up head on a frame we could source was the Handi Quilter Moxie at $4,495 on dealer sale, $5,995 MSRP, with an 8 ft Loft frame. Grace Q'nique 15R bundles with a Q-Zone Queen frame were seen at $5,198." },
      { q: "Is a used long-arm a good idea?", a: "Often, if a dealer will service it. Used listings ran from about $2,200 for a sit-down head to $29,000 for a computerized Gammill. Budget a service visit and confirm the frame and any regulator are included." },
      { q: "What does computerization add?", a: "Between about $2,300 for Grace's older QCT5 and $11,000 for Handi Quilter's Pro-Stitcher or APQS Quilt Path. On Innova the Autopilot list price runs about $16,000 above the free-motion version." },
      { q: "Do I need a stitch regulator?", a: "Stand-up heads at the entry tier include it. On a domestic Juki TL or Brother PQ1600S there is no regulator available, so stitch length on a frame is set by hand speed." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "sewing-machine-brands-ranked",
    title: "Sewing Machine Brands Ranked",
    h1: "Sewing machine brands ranked, by the job you'd buy them for",
    standfirst:
      "There is no best brand. There is a best brand for straight-stitch speed, for sergers, for a first machine, for a dealer relationship. Ranked by job, with the lineup letters decoded.",
    metaTitle: "Sewing Machine Brands Ranked by Job: Juki, Janome, Brother, Singer, Baby Lock, Bernina (2026)",
    description:
      "Eight sewing machine brands ranked for heavy fabric, sergers, quilting and first machines, with what each series name means and where each brand is weak. No brand is best at everything.",
    feeds: "heavy-duty",
    blocks: [
      { type: "h2", id: "method", text: "How we rank" },
      {
        type: "p",
        html: "By job. A brand that makes the fastest straight-stitch machine and no good budget serger is not better or worse than one that does the opposite. Each row below names the job, the brand that wins it on the spec sheet, and the runner-up.",
      },
      {
        type: "table",
        head: ["Job", "First", "Second", "Why"],
        labelCol: true,
        rows: [
          ["Straight-stitch speed", "Juki (TL)", "Janome (HD9)", "1,500 spm class, knee lifter, drop feed"],
          ["Budget serger", "Brother (1034D)", "Singer (ProFinish)", "3/4 thread with differential feed under $300"],
          ["Serger you keep", "Juki (MO)", "Baby Lock", "Industrial heritage; Baby Lock for air threading via dealers"],
          ["Mechanical heavy duty", "Janome (HD)", "Singer (Heavy Duty)", "Build weight and presser-foot pressure"],
          ["Computerized quilting", "Janome (MC)", "Bernina (5 series)", "Throat space and stitch quality; Bernina is dealer-only"],
          ["Industrial for home", "Juki (DDL, DNU)", "None in scope", "Factory lockstitch and walking-foot heads with servo motors"],
          ["Long-arm quilting", "Handi Quilter", "Grace Company", "Dealer network and stitch regulation; Grace wins on bundle price"],
        ],
      },
      { type: "h2", id: "brands", text: "Brand by brand" },
      { type: "h3", text: "Juki" },
      { type: "p", html: "Industrial maker with a home line that inherits speed and sergers. Weak on budget computerized and embroidery. <a href=\"/brands/juki\">Juki decoder</a>." },
      { type: "h3", text: "Janome" },
      { type: "p", html: "Widest range of the six. Mechanical HD line and Memory Craft quilters are the reasons to buy. <a href=\"/brands/janome\">Janome decoder</a>." },
      { type: "h3", text: "Brother" },
      { type: "p", html: "Volume brand. The best-selling budget sergers and coverstitch. Embroidery is out of our scope. <a href=\"/brands/brother\">Brother decoder</a>." },
      { type: "h3", text: "Singer" },
      { type: "p", html: "Heavy Duty is a series name. Cheap, everywhere, and honest for denim hems. <a href=\"/brands/singer\">Singer decoder</a>." },
      { type: "h3", text: "Baby Lock" },
      { type: "p", html: "Dealer-only, made by Juki's parent. Air-threading sergers are the draw; you buy the dealer relationship too. <a href=\"/brands/babylock\">Baby Lock decoder</a>." },
      { type: "h3", text: "Bernina" },
      { type: "p", html: "Swiss, dealer-only, top of the price range. Quilting features and stitch quality; bernette is the budget sub-brand. <a href=\"/brands/bernina\">Bernina decoder</a>." },
      { type: "h3", text: "Handi Quilter" },
      { type: "p", html: "Long-arm specialist. Moxie is the entry stand-up head; Amara and the sit-down Sweet Sixteen are the next rungs. Nothing under 15 in of throat. <a href=\"/brands/handi-quilter\">Handi Quilter decoder</a>." },
      { type: "h3", text: "Grace Company" },
      { type: "p", html: "The frame maker that also sells Q'nique heads. Wins on bundle price at the 15 to 19 in tier; thinner dealer service than Handi Quilter. <a href=\"/brands/grace-company\">Grace Company decoder</a>." },
      { type: "h2", id: "where-to-buy", text: "Dealer-only or online" },
      {
        type: "p",
        html: "Baby Lock and Bernina sell only through dealers, so there is no online price to compare and no buy button on our pages for them; you get setup and service in the price. Juki, Janome, Brother and Singer sell through online retailers, and their warranties depend on buying from an authorized dealer, which the retailer we link is for those brands. Handi Quilter and Grace sit in between: dealers first, a few online retailers, and the frame usually ships flat for you to assemble.",
      },
      {
        type: "table",
        head: ["Brand", "Where it sells", "What that means for price"],
        labelCol: true,
        rows: [
          ["Juki, Janome, Brother, Singer", "Online retailers and dealers", "Prices are public and move weekly; bundles vary by seller"],
          ["Baby Lock, Bernina", "Dealers only", "No published price; the dealer sets it and includes classes and service"],
          ["Handi Quilter, Grace Company", "Dealers and some online retailers", "Head price is public; frame, delivery and robotics are separate lines"],
        ],
      },
      { type: "short", text: "Pick the job, then the brand that wins it. Cross-brand loyalty costs money in this category." },
    ],
    ctaTitle: "The machines behind the ranking",
    ctaSlugs: ["juki-tl-2010q", "janome-hd3000", "brother-1034d"],
    ctaMore: { label: "All brands", href: "/brands" },
    faqs: [
      { q: "Which sewing machine brand lasts the longest?", a: "Mechanical machines from Juki and Janome have the longest service records in this price range. Any brand's computerized machine is limited by board availability late in life." },
      { q: "Is Singer still a good brand?", a: "For budget mechanical machines, yes, with limits: Heavy Duty is a series name and the family struggles on upholstery. For sergers and quilting, other brands win." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "sewing-machine-for-thick-fabric",
    title: "Sewing Machine for Thick Fabric",
    h1: "Sewing thick fabric: needle, presser foot, motor, then the machine",
    standfirst:
      "Most thick-fabric failures are a needle and a foot, not a machine. Fix those first. If it still stalls, here is what to look for in the spec sheet.",
    metaTitle: "Best Sewing Machine for Thick Fabric: Denim, Canvas, Leather (2026)",
    description:
      "What thick fabric needs from a sewing machine: needle size, presser-foot lift and pressure, walking foot, motor and feed. Then which heavy-duty and industrial machines clear the bar for denim, canvas, leather and upholstery.",
    feeds: "heavy-duty",
    blocks: [
      { type: "h2", id: "needle", text: "Needle first" },
      {
        type: "p",
        html: "Denim and canvas want a 100/16 or 110/18 needle; leather wants a leather point (wedge) needle in the same sizes. A universal 80/12 skips and breaks on four layers of denim and gets blamed on the machine.",
      },
      { type: "h2", id: "foot", text: "Presser foot lift and pressure" },
      {
        type: "definition",
        term: "Presser foot lift",
        body: "How high the foot rises above the plate. A high lift (some machines publish an extra-high position) is what lets you feed a jeans hem or a bag strap under the foot at all.",
      },
      {
        type: "p",
        html: "Adjustable presser-foot pressure lets you back off for thick layers so the top layer feeds instead of creeping. A walking foot adds feed dogs on top and is the single most useful accessory for layered denim, canvas and quilts.",
      },
      { type: "h2", id: "motor", text: "Motor and feed" },
      {
        type: "p",
        html: "Domestic machines publish speed, not torque. A machine that holds speed under load is what you are after; in practice the mechanical heavy-duty tier and the Juki TL straight-stitch class clear denim and canvas. Upholstery and marine vinyl are industrial walking-foot territory.",
      },
      {
        type: "table",
        head: ["Fabric", "Needle", "Foot", "Machine tier"],
        labelCol: true,
        rows: [
          ["Denim, 2–4 layers", "100/16 to 110/18 denim", "Walking foot for hems", "Mechanical heavy duty and up"],
          ["Canvas bags", "100/16 to 110/18", "Walking or Teflon foot", "Mechanical heavy duty, Juki TL"],
          ["Garment leather", "90/14 to 100/16 leather point", "Teflon or roller foot", "Juki TL, industrial"],
          ["Upholstery, vinyl", "110/18 to 120/19", "Walking foot", "Industrial walking-foot machine"],
        ],
      },
      { type: "short", text: "Change the needle, add a walking foot, back off the pressure. If it still stalls, you need the heavy-duty tier; if you sew upholstery weekly, you need an industrial." },
      { type: "links", items: [{ label: "Best heavy-duty sewing machines", href: "/best-heavy-duty-sewing-machines" }] },
    ],
    ctaTitle: "Machines that clear the bar",
    ctaSlugs: ["juki-tl-2010q", "janome-hd3000", "juki-ddl-8700"],
    ctaMore: { label: "Best heavy-duty machines", href: "/best-heavy-duty-sewing-machines" },
    faqs: [
      { q: "Can a regular sewing machine sew denim?", a: "Two layers, yes, with a 100/16 needle. Hems where four to six layers meet are where light machines stall; a hump jumper or walking foot helps, a heavy-duty tier machine solves it." },
      { q: "What needle for thick fabric?", a: "100/16 for denim and canvas, 110/18 for very heavy layers, leather point needles in 90/14 to 100/16 for leather." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "industrial-sewing-machine-for-home",
    title: "Industrial Sewing Machine for Home Use",
    h1: "Industrial sewing machine for home use: what you are actually buying",
    standfirst:
      "An industrial is a head. The table, the motor and the floor space are the rest of the purchase, and they decide whether one belongs in your house.",
    metaTitle: "Industrial Sewing Machine for Home Use: Head, Table, Motor, Footprint (2026)",
    description:
      "What an industrial sewing machine is, how it differs from a domestic heavy duty and a semi-industrial straight stitch, clutch vs servo motors, the table footprint, needle systems, and which Juki head fits which work. Spec-checked, no field test.",
    feeds: "heavy-duty",
    blocks: [
      { type: "h2", id: "short-answer", text: "The short answer" },
      {
        type: "p",
        html: "An industrial sewing machine is sold as a bare head that bolts into a table with a separate motor underneath. It does one stitch, usually straight only, at up to 5,500 spm, and it does not go back in a closet. Dealer bundles with table and servo motor start around $900 to $1,300 for a Juki DDL-8700 or DDL-5550N, and around $2,500 for the walking-foot DNU-1541S that upholstery and leather workers buy first.",
      },
      {
        type: "definition",
        term: "Industrial head",
        body: "The sewing mechanism alone: cast body, hook, feed and needle bar, built for continuous running. No motor, no table, no light. Everything else is bought with it or around it.",
      },
      { type: "h2", id: "tiers", text: "Domestic heavy duty, semi-industrial, industrial" },
      {
        type: "p",
        html: "Three different machines share the words heavy duty and industrial in listings. The numbers separate them.",
      },
      {
        type: "table",
        head: ["Tier", "Example", "Max speed", "Stitches", "Where it lives"],
        labelCol: true,
        rows: [
          ["Domestic heavy duty", "Singer Heavy Duty 4452, Janome HD3000", "860 to 1,100 spm", "18 to 32", "Portable, any table"],
          ["Semi-industrial straight stitch", "Juki TL-2010Q, Brother PQ1600S, Janome HD9", "1,500 to 1,600 spm", "Straight only", "Portable at 24 to 32 lb, table optional"],
          ["Industrial lockstitch", "Juki DDL-8700, DDL-5550N", "5,500 spm", "Straight only", "Bolted into a table with a motor"],
          ["Industrial walking foot", "Juki DNU-1541S", "2,500 spm", "Straight only", "Bolted into a table with a motor"],
        ],
      },
      {
        type: "p",
        html: "\"Heavy Duty\" is a Singer series name and \"industrial-quality\" is Juki marketing for the TL line; neither is a rating. The tier is set by whether the head needs a table and by the needle system it takes.",
      },
      { type: "h2", id: "motor", text: "Clutch or servo motor" },
      {
        type: "p",
        html: "Juki sells the head without a motor. Dealer bundles ship one of two kinds. A clutch motor runs at full speed all the time and you feather a clutch with the pedal; it is cheap, loud and hard to run slowly. A servo motor turns only when you press the pedal and has a speed dial under the table, so a 5,500 spm head can be turned down to a crawl. Owners on PatternReview and the upholstery forums credit the servo for making slow, precise work possible on the DDL-8700 and DNU-1541S. Motor wattage and brand vary by bundle and are rarely published in the listing; ask before you buy.",
      },
      { type: "h2", id: "table", text: "The table and the footprint" },
      {
        type: "ul",
        items: [
          "A standard industrial table is about 48 by 20 in with an adjustable stand, 26 to 32 in high, per one dealer's DDL-5550N bundle. It is furniture, not an appliance.",
          "The DDL-8700 head alone weighs 28 kg, about 62 lb, per Juki. Table and motor weights are not published; budget two people and a ground-floor room.",
          "\"Table Comes Assembled\" is a dealer claim on some Sewing Machines Plus listings. Marketplace bundles at lower prices usually ship the table flat for you to assemble and to mount and belt the motor.",
          "The head sits in an oil pan. Industrials use Juki New Defrix Oil No. 1 and drip if moved carelessly.",
        ],
      },
      { type: "h2", id: "needles", text: "Straight stitch only, and a different needle" },
      {
        type: "p",
        html: "Every industrial in our catalog does one straight stitch with reverse; no zigzag, no buttonhole. Needle systems change too: the DDL heads take DBx1 (16x231) in sizes 9 to 18, the DNU-1541S takes 135x17 and 135x16 for leather. Domestic needles (130/705H) do not fit. Bobbins, feet and folders are industrial-standard and cheap, but they are a different shelf at the store.",
      },
      { type: "h2", id: "which", text: "Which industrial for which work" },
      {
        type: "table",
        head: ["Work", "Head", "Why", "Watch for"],
        labelCol: true,
        rows: [
          ["Garments, bags, canvas, flat seams", "Juki DDL-8700", "The budget industrial straight stitch; 13 mm foot lift, 5 mm stitch", "The -7 suffix adds a trimmer; -H is the heavy setup"],
          ["Same work, made in Japan", "Juki DDL-5550N", "Same class as the 8700, sold as the 5550N today", "5,500 spm is the medium setup; light and heavy setups run 4,000"],
          ["Upholstery, leather, vinyl, webbing", "Juki DNU-1541S", "Unison feed walking foot, 9 mm stitch, 16 mm knee lift", "The S safety clutch can trip on bulky seams; the plain 1541 has none"],
        ],
      },
      { type: "h2", id: "costs", text: "Costs beyond the head" },
      {
        type: "ul",
        items: [
          "Table, stand and motor: bundled by dealers, or bought separately for a used head.",
          "Servo motor upgrade if the bundle ships a clutch motor.",
          "Industrial needles, bobbins and feet in the right system.",
          "Oil, a lamp, and delivery for a crate that does not go through a standard door on its own.",
          "A needle positioner, optional on the DNU-1541S, if you do a lot of pivoting.",
        ],
      },
      { type: "short", text: "Buy an industrial when the work is one stitch, every day, and you have the floor. Buy a semi-industrial straight stitch when you want the speed without the furniture." },
    ],
    ctaTitle: "The industrials we spec-checked",
    ctaSlugs: ["juki-ddl-8700", "juki-dnu-1541s", "juki-tl-2010q"],
    ctaMore: { label: "Best heavy-duty sewing machines", href: "/best-heavy-duty-sewing-machines" },
    faqs: [
      { q: "Can I use an industrial sewing machine at home?", a: "Yes, if you have a permanent spot for a table about 48 by 20 in and a normal wall outlet; the servo motors in home bundles run on household power. It is not portable." },
      { q: "Does an industrial come with a table and motor?", a: "Not from Juki. Dealers sell bundles with table, stand, motor and lamp. Check whether the table ships assembled and whether the motor is a servo." },
      { q: "Servo or clutch motor?", a: "Servo for home use. It is quiet, starts only when you press the pedal and has a speed dial. A clutch motor runs constantly and is harder to control at low speed." },
      { q: "Can an industrial do zigzag or buttonholes?", a: "Not these. Industrial zigzag and buttonhole machines exist as separate heads. Every industrial in our catalog is straight stitch only." },
      { q: "What is a semi-industrial sewing machine?", a: "Retail shorthand for a portable straight-stitch machine at 1,500 to 1,600 spm, such as the Juki TL-2010Q, Brother PQ1600S or Janome HD9. Domestic needles, domestic power, no table required." },
      { q: "How much does an industrial sewing machine cost?", a: "Dealer bundles with table and servo were seen at $900 to $1,300 for the DDL-8700 and DDL-5550N and about $2,500 for the DNU-1541S on 2026-09-29. Prices vary by dealer and by whether the table ships assembled." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
  {
    slug: "brother-vs-singer-sewing-machine",
    title: "Brother vs Singer Sewing Machines",
    h1: "Brother vs Singer: which brand for which job",
    standfirst:
      "Neither brand is better. Singer sells the cheapest metal-frame mechanical; Brother sells the best budget sergers and the cheapest computerized machine worth owning. Model for model, with the warranty terms that actually differ.",
    metaTitle: "Brother vs Singer Sewing Machines: Which Brand Wins Each Job (2026)",
    description:
      "Brother and Singer compared by job, model for model: Heavy Duty 4452 vs ST371HD, 6700C vs CS7000X, ProFinish vs 1034D, plus who owns each brand and how the 25-year warranties differ. Spec-checked.",
    awareness: true,
    feeds: "beginner",
    blocks: [
      { type: "h2", id: "short-answer", text: "The short answer" },
      {
        type: "p",
        html: "Pick the job, then the brand. On the spec sheets we checked, Singer wins the cheapest metal-frame mechanical and the only sub-$700 serger-plus-coverstitch combo. Brother wins budget sergers, dedicated coverstitch, a 1,500 spm straight-stitch quilter and computerized machines under $300. Both publish a 25-year warranty; the parts-and-labor window underneath it is 90 days at Singer and one year at Brother.",
      },
      {
        type: "table",
        head: ["Job", "Winner", "Model", "Why"],
        labelCol: true,
        rows: [
          ["Cheapest mechanical you will not outgrow", "Singer", "Heavy Duty 4452", "1,100 spm, 32 stitches, metal interior frame, walking foot in the box"],
          ["Mechanical for leather and vinyl", "Brother", "ST371HD", "37 stitches, nonstick foot included; slower at 800 spm"],
          ["Computerized under $300", "Brother", "CS7000X", "70 stitches, 7 one-step buttonholes, 10 feet, wide table"],
          ["Computerized with a heavy-duty frame", "Singer", "Heavy Duty 6700C", "1,100 spm, metal frame, walking foot, speed slider"],
          ["First serger", "Brother", "1034D", "3/4 thread, 1,300 spm, the value pick in our serger hub"],
          ["Serger and coverstitch in one", "Singer", "Professional 5 14T968DC", "2/3/4/5 thread with coverstitch conversion"],
          ["Straight-stitch quilting speed", "Brother", "PQ1600S", "1,500 spm, wide table; Singer has no equivalent in our set"],
        ],
      },
      { type: "h2", id: "who-owns-them", text: "Who makes them" },
      {
        type: "p",
        html: "Brother sewing machines come from Brother Industries of Japan through its US subsidiary. Singer is a brand of SVP Worldwide in Nashville, which also owns Husqvarna Viking and Pfaff and has been controlled by the private equity firm Platinum Equity since 2021. Both sell direct and through mass retail, and both have models at Sewing Machines Plus, the retailer we link.",
      },
      { type: "h2", id: "model-for-model", text: "Model for model" },
      {
        type: "table",
        caption: "Closest pairs in our catalog, from the published specs",
        head: ["Pair", "Singer", "Brother", "Difference that matters"],
        labelCol: true,
        rows: [
          ["Mechanical heavy duty", "Heavy Duty 4452: 1,100 spm, 32 stitches, walking foot", "ST371HD: 800 spm, 37 stitches, nonstick foot, 14.3 lb", "Singer is faster; Brother includes the foot for sticky fabrics"],
          ["Computerized", "Heavy Duty 6700C: 1,100 spm, metal frame, 10 feet incl. walking foot, 15.4 lb", "CS7000X: 750 spm, 70 stitches, 10 feet, wide table, 10.5 lb", "Singer for speed and frame; Brother for stitches and the table"],
          ["Serger", "ProFinish 14CG754: 2/3/4 thread, 1,300 spm, 13.5 lb", "1034D: 3/4 thread, 1,300 spm, 13.9 lb", "Singer adds 2-thread stitches; Brother has the larger owner base and parts supply"],
          ["Entry mechanical", "Heavy Duty 4411: 1,100 spm, 11 stitches, 4-step buttonhole", "None under the ST line in our set", "Only buy the 4411 on a real price gap to the 4423"],
        ],
      },
      { type: "h2", id: "warranty", text: "What the 25-year warranties actually cover" },
      {
        type: "p",
        html: "Singer's statement: 25 years against defective materials and workmanship on the head, 2 years on motors, light, wiring, switches, speed control and electrical components, 90 days parts and labor. Brother's statement: 25 years on the chassis casting, electrical components covered for 2 years on most machines (some Brother documents say 5 years for sergers), 1 year on parts, labor and accessories. The 25 is the same; the labor window is the difference: three months at Singer, one year at Brother. Either way, the warranty depends on buying from an authorized dealer.",
      },
      { type: "h2", id: "names", text: "Where the names mislead" },
      {
        type: "ul",
        items: [
          "\"Heavy Duty\" is a Singer series name covering the 4411, 4423, 4432, 4452 and the computerized 6600C to 6800C. Same 1,100 spm motor across the mechanical family; stitch count and accessory pack are the differences.",
          "\"Strong & Tough\" (ST) is Brother's series name. The ST371HD runs at 800 spm, slower than the Singers it is compared with.",
          "Brother's 1034D, 1034DX and 1634D are one serger platform in different bundles and retail channels. Buy whichever is cheapest on the day.",
          "Singer's ProFinish is the budget serger line; the Professional 5 is the 5-thread combo. Similar names, different machines.",
        ],
      },
      { type: "short", text: "Singer for the cheapest solid mechanical and the combo serger. Brother for sergers, coverstitch, budget computerized and straight-stitch speed. Loyalty to either costs you a better machine somewhere." },
    ],
    ctaTitle: "The machines behind the comparison",
    ctaSlugs: ["singer-4452", "brother-st371hd", "brother-1034d"],
    ctaMore: { label: "Best sewing machines for beginners", href: "/best-sewing-machines-for-beginners" },
    faqs: [
      { q: "Is Brother or Singer better for beginners?", a: "For a first mechanical machine, the Singer Heavy Duty 4452 is faster and heavier-framed for the money. For a first computerized machine under $300, the Brother CS7000X gives more for the price. Our beginner hub ranks both against Janome and Juki." },
      { q: "Which brand has the better warranty?", a: "Both say 25 years. Brother covers parts and labor for a year; Singer covers them for 90 days. Electrical coverage is 2 years at both on most models." },
      { q: "Is Singer still made by Singer?", a: "Singer is a brand of SVP Worldwide, owned by Platinum Equity since 2021. Machines are made in Asia, as Brother's home machines are." },
      { q: "Brother or Singer for a serger?", a: "Brother. The 1034D is the value pick in our serger hub and has the largest owner community. Singer's exception is the 14T968DC, the only 5-thread serger with coverstitch under $700 in our catalog." },
      { q: "Brother or Singer for quilting?", a: "Brother, for the PQ1600S straight-stitch quilter at 1,500 spm. Neither brand's computerized quilters match a Janome Memory Craft or Juki HZL on throat and frame." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "published",
  },
];

export const guidesBySlug: Record<string, Guide> = Object.fromEntries(guides.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return guidesBySlug[slug];
}

export function publishedGuides(): Guide[] {
  return guides.filter((g) => g.status === "published");
}

export function guideToc(g: Guide): { id: string; text: string }[] {
  const items = g.blocks.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2").map((b) => ({ id: b.id, text: b.text }));
  items.push({ id: "picks", text: g.ctaTitle });
  return items;
}
