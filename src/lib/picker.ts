/** Home page "Which machine type do I need?" picker. Static data, client-side selection. */
export interface PickerOption {
  id: string;
  label: string;
  mark: string;
  result: {
    type: string;
    why: string;
    look: string;
    cta: string;
    ctaHref: string;
    guide: string;
    guideHref: string;
  };
}

export const pickerOptions: PickerOption[] = [
  {
    id: "denim",
    label: "Denim, canvas, bags",
    mark: "01",
    result: {
      type: "A mechanical heavy-duty machine",
      why: "Layers of denim and canvas need a motor that holds speed, a high presser-foot lift and a 100/16 needle. A metal-frame mechanical does it without paying for stitches you will not use.",
      look: "Look for: presser-foot lift height · adjustable pressure · walking foot",
      cta: "Best heavy-duty machines",
      ctaHref: "/best-heavy-duty-sewing-machines",
      guide: "Sewing machine for thick fabric",
      guideHref: "/guides/sewing-machine-for-thick-fabric",
    },
  },
  {
    id: "knits",
    label: "Knits and T-shirts",
    mark: "02",
    result: {
      type: "A serger",
      why: "A serger seams, trims and wraps the edge in one pass and stretches with the fabric. Add a coverstitch later if the hems are what bother you.",
      look: "Look for: differential feed · 3/4 thread · threading system",
      cta: "Best sergers",
      ctaHref: "/best-sergers",
      guide: "Serger vs sewing machine",
      guideHref: "/guides/serger-vs-sewing-machine",
    },
  },
  {
    id: "hems",
    label: "Hemming activewear",
    mark: "03",
    result: {
      type: "A coverstitch machine",
      why: "The twin rows on a bought T-shirt hem are a coverstitch. A serger does a rolled hem, which is a different look, and a twin needle on a sewing machine gets close but not as stretchy.",
      look: "Look for: 2 and 3 needle positions · chain stitch · differential feed",
      cta: "Coverstitch picks",
      ctaHref: "/best-sergers#coverstitch",
      guide: "Coverstitch vs serger",
      guideHref: "/guides/coverstitch-vs-serger",
    },
  },
  {
    id: "quilts",
    label: "Quilts on a table",
    mark: "04",
    result: {
      type: "A straight-stitch quilting machine",
      why: "Piecing and free-motion quilting are straight stitch. The Juki TL class gives you 1,500 spm, a knee lifter and 8.5 to 9 in of throat on a normal table.",
      look: "Look for: throat space · knee lifter · drop feed dogs",
      cta: "Best quilting machines",
      ctaHref: "/best-quilting-machines",
      guide: "How to choose a quilting machine",
      guideHref: "/guides/how-to-choose-a-quilting-machine",
    },
  },
  {
    id: "longarm",
    label: "Whole quilts, often",
    mark: "05",
    result: {
      type: "A long-arm on a frame",
      why: "When you have run out of throat on a domestic more than once and quilt whole tops every month, a 15 in or larger head on a frame is the step. Budget the frame and the room.",
      look: "Look for: throat space · stitch regulation · frame length",
      cta: "Long-arm picks",
      ctaHref: "/best-quilting-machines",
      guide: "How much does a long-arm cost?",
      guideHref: "/guides/how-much-does-a-long-arm-cost",
    },
  },
];
