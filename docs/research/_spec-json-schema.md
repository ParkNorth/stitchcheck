# data/specs/{slug}.json schema

Research agents write one JSON file per model. Fields the manufacturer does not publish are `null`, never guessed.
Every non-null spec has a `source` URL. Strings are plain text: no em-dashes, no marketing adjectives.

```json
{
  "slug": "juki-tl-2010q",
  "brand": "Juki",
  "model": "TL-2010Q",
  "series": "TL",
  "type": "mechanical | computerized | serger | coverstitch | long-arm",
  "industrial": false,
  "jobs": ["heavy-duty", "quilting"],
  "manufacturerUrl": "https://...",
  "retailerUrl": "https://www.sewingmachinesplus.com/...",
  "priceUsdSeen": 1099,
  "priceSeenDate": "2026-09-29",
  "priceSeenAt": "Sewing Machines Plus",
  "specs": {
    "stitchTypes": {"value": "Straight stitch only", "source": "https://..."},
    "stitchCount": {"value": 1, "source": "..."},
    "maxSpm": {"value": 1500, "source": "..."},
    "threads": {"value": null, "source": null},
    "differentialFeed": {"value": null, "source": null},
    "throatIn": {"value": 8.5, "source": "..."},
    "needleSystem": {"value": "HAx1 / 130/705H", "source": "..."},
    "presserFootLift": {"value": "Knee lifter, 12 mm", "source": "..."},
    "threadTrimmer": {"value": "Automatic, pedal and button", "source": "..."},
    "feedSystem": {"value": "Drop feed, lowers for free motion", "source": "..."},
    "buttonhole": {"value": null, "source": null},
    "motor": {"value": null, "source": null},
    "frame": {"value": "Aluminum die-cast", "source": "..."},
    "weightLb": {"value": 25.4, "source": "..."},
    "dimensionsIn": {"value": "17.8 x 8.6 x 13.8", "source": "..."},
    "includedFeet": {"value": "...", "source": "..."},
    "warrantyUs": {"value": "5 yr mechanical, 2 yr electrical, 1 yr labor", "source": "..."}
  },
  "claims": ["\"...\" (manufacturer claim, product page)"],
  "conflicts": ["Weight: 25 lb (retailer) vs 25.4 lb (Juki PDF). Use Juki."],
  "ownerThemes": [{"theme": "...", "tone": "positive|negative|mixed", "source": "https://..."}],
  "evidence": "owner | mixed | positioning",
  "buyerQuestions": ["..."],
  "crossShop": [{"slug": "juki-tl-2000qi", "why": "..."}],
  "discontinued": false,
  "replacedBy": null,
  "sources": ["https://...", "https://..."]
}
```
