# Sad Pod Wiatrakiem — landing page rework for its real audience

Date: 2026-08-21 · Issue: [#2](https://github.com/naxvb/sad-web/issues/2)

## Why

Facebook Insights (28 days, 5196 visits) describes a narrow, consistent audience:

| Dimension | Reality |
|---|---|
| Age + gender | Women; 35–44 = 34.6%, 45–54 = 31.2% (65.8% together) |
| Country | Poland 98.6% |
| Cities | Poznań 60.6%, Suchy Las 13%, Rokietnica 12.4%, Oborniki 3.7% + gmina 3.2% |

That is one persona: a woman in her forties, 15–25 minutes' drive away, who buys fruit by the
kilogram and makes preserves. Before she drives out she wants four answers — **what is ripe
today, when are you open, what does a kilo cost, how far is it**. The current page answers none
of them; its only call to action is "phone us". Every visit therefore costs the owners a phone
call, and every unanswered question costs a visit.

The page is also long. Measured mobile height is ~10 000 px, roughly 15 screens, because the
8 variety cards and the 6 gallery tiles each stack one per row below 900 px.

## What changes

### 1. Answer the four questions, high up

- **Opening hours** — Sunday–Friday 16:00–19:00, **closed Saturday**. Unusual enough that
  burying it would send people out for nothing, so it appears in the facts bar, the contact
  section and JSON-LD, with a live *open now / closes at 19:00 / closed today* indicator
  computed from the visitor's clock.
- **"What's ripe now"** — a strip driven by the current month (August → Royal and Inka peaches).
  Creates urgency and answers the first question before any scrolling.
- **Prices** — a section driven by one config object, `DANE.ceny`. While it is `null` the
  section renders an honest "current prices by phone — they move during the season" variant with
  a call button. Setting real values turns it into a full price table. Invented amounts are never
  published: a visitor who arrives with a wrong number in her head is worse than one who calls.
- **Drive times** — Poznań 15 min, Suchy Las 8 min, Rokietnica 10 min, Oborniki 20 min. Literally
  the top four cities in the Insights data.

### 2. Content aimed at this persona

- **"Na przetwory"** — which variety for jam, for liqueur, for freezing, and how many kilograms
  fill how many jars. This is the reason the audience drives out, and no competitor page carries
  it.
- **FAQ** as a native `<details>` accordion — payment, parking, whether to phone first, bulk
  orders. Compact, and good for long-tail local search.
- The existing "Zamówienia" news card folds into the ordering content; the news section shrinks
  to one Facebook card, since Facebook is where the updates actually live.

### 3. Cut the mobile scroll

| Move | Saved |
|---|---|
| 8 variety cards → 2 native `<details>` accordions | ~1800 px |
| 6 stacked gallery tiles → scroll-snap carousel | ~1800 px |
| Facts bar → compact rows instead of 3 full blocks | ~300 px |
| Season calendar → stacked month chips instead of a 720 px scroller | ~150 px |
| Tighter section padding below 700 px | ~600 px |

A **sticky bottom bar** (call · navigate) rides above everything under 900 px, so converting
never requires scrolling at all.

### 4. Real photos

Five photos exist in `images/`. Each is resampled to 1600 px and 800 px JPEG and served through
`srcset`, so a phone downloads roughly a quarter of the bytes a desktop does. Placement follows
what each photo actually shows:

| Photo | Content | Placement |
|---|---|---|
| `brzoskwinia-na-drzewie` | peach on the branch, close-up | hero background |
| `wisnie-na-galezi` | cherries on the branch | cherry card |
| `brzoskwinie-skrzynki` | eight crates from above | peach card |
| `wisnie-skrzynka` | crate of cherries, 2.2:1 panorama | full-width band |
| `brzoskwinie-zolte` | crates of yellow peaches | gallery |

There is no photo of the owners, the windmill or the blossom, so the "O sadzie" section keeps its
illustration and the gallery holds five items rather than six.

### 5. Findability

`LocalBusiness` JSON-LD carrying address, telephone, opening hours and the Facebook profile, so
Google can show hours directly for "wiśnie Poznań" and "sad brzoskwiniowy Suchy Las". No `geo`
block — coordinates precise enough to publish are not available, and Google geocodes the address
anyway.

## Structure

Header · Hero (photo) · Facts + hours · What's ripe now · Fruit cards + prices · How to buy ·
Preserves · Varieties (accordion) · Photo band · Gallery (carousel) · About · FAQ · Contact +
directions · Footer · Sticky mobile bar.

## Constraints

- One self-contained `site/index.html` plus `site/img/` — no build step, no framework, no external
  requests beyond the existing Google Fonts link. The Pages workflow deploys `site/` unchanged.
- Native elements over JavaScript where they exist (`<details>` for accordions, CSS scroll-snap
  for the carousel), so the page degrades gracefully and stays small.
- `prefers-reduced-motion` continues to disable animation.

## Verification

Render the page headless at 390 × 844, measure `document.body.scrollHeight`, and confirm it is at
least 35% below the current 10 000 px baseline. Then confirm the deploy is green and the live URL
returns HTTP 200.
