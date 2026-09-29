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
      "The machine is the smallest line on the invoice that matters. Frame, stitch regulation, computerization and delivery are where the number moves.",
    metaTitle: "How Much Does a Long-Arm Quilting Machine Cost? Real Totals (2026)",
    description:
      "Long-arm quilting machine prices by tier, plus the frame, stitch regulator, robotics, delivery and used-market ranges that make up the real total. Sourced and dated.",
    feeds: "quilting",
    blocks: [
      { type: "h2", id: "tiers", text: "Price by tier" },
      {
        type: "p",
        html: "Prices below are the published or dealer-quoted figures we could source on the date shown in the source line. Dealer-only brands often list no price; we say so rather than guess. This section is refreshed from docs/research/_long-arm-cost.md.",
      },
      {
        type: "table",
        head: ["Tier", "Throat", "Machine price range", "Frame"],
        labelCol: true,
        rows: [
          ["Domestic straight-stitch quilter", "8.5–10 in", "[verify]", "Optional"],
          ["Sit-down mid-arm", "16–18 in", "[verify]", "Table included"],
          ["Entry stand-up long-arm", "15–16 in", "[verify]", "Sold separately"],
          ["Full long-arm", "18–26 in", "[verify]", "Sold separately"],
        ],
      },
      { type: "h2", id: "adds", text: "What gets added" },
      {
        type: "ul",
        items: [
          "Frame: sized to the largest quilt you will load, usually 8 to 12 feet.",
          "Stitch regulation: keeps stitch length even as you change speed. Included on some heads, an add-on on others.",
          "Computerized robotics: the machine follows a digital pattern. The largest single add-on.",
          "Delivery and setup: freight plus assembly, often quoted separately by the dealer.",
          "Bobbins, thread, rulers and a lamp.",
        ],
      },
      { type: "h2", id: "used", text: "Buying used" },
      {
        type: "p",
        html: "Used long-arms hold value because dealers service them. Expect to pay for a service visit and a re-level on delivery, and confirm the frame comes with it.",
      },
      { type: "short", text: "Price the frame and delivery before you fall for a head. The entry long-arm on a frame is a room-sized commitment, not a machine purchase." },
    ],
    ctaTitle: "Where to start",
    ctaSlugs: ["handi-quilter-moxie", "juki-tl-2010q", "janome-mc6650"],
    ctaMore: { label: "Best quilting machines", href: "/best-quilting-machines" },
    faqs: [
      { q: "Does the price include the frame?", a: "Usually not for stand-up long-arms. Sit-down mid-arms include their table. Check the listing line by line." },
      { q: "Is a used long-arm a good idea?", a: "Often, if a dealer will service it. Budget a service visit and confirm the frame and any regulator are included." },
    ],
    published: "2026-09-29",
    updated: "2026-09-29",
    status: "draft",
  },
  {
    slug: "sewing-machine-brands-ranked",
    title: "Sewing Machine Brands Ranked",
    h1: "Sewing machine brands ranked, by the job you'd buy them for",
    standfirst:
      "There is no best brand. There is a best brand for straight-stitch speed, for sergers, for a first machine, for a dealer relationship. Ranked by job, with the lineup letters decoded.",
    metaTitle: "Sewing Machine Brands Ranked by Job: Juki, Janome, Brother, Singer, Baby Lock, Bernina (2026)",
    description:
      "Six sewing machine brands ranked for heavy fabric, sergers, quilting and first machines, with what each series name means and where each brand is weak. No brand is best at everything.",
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
          ["Industrial for home", "Juki (DDL)", "—", "Factory lockstitch heads with servo motors"],
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
