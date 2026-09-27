# Demo Guide

How to actually run the "give Aaran any startup" moment, and what to do if
something goes wrong live.

## Before the meeting

1. Decide: are you running with a real `ANTHROPIC_API_KEY` (so Anis can
   give you a company AARAN AI has never seen before), or purely in Demo
   Mode (only the 3 built-in companies)? For the real "give me any
   startup" moment, you need a real key — Demo Mode can't research an
   arbitrary company you haven't hand-written data for.
2. If using a real key: set `DEMO_MODE=false` and `ANTHROPIC_API_KEY` in
   `.env.local`, then test with 2-3 real companies beforehand so you know
   roughly how long a live analysis takes on your connection.
3. Either way, confirm Demo Mode works as a fallback: temporarily set
   `DEMO_MODE=true`, load the Dashboard, and confirm the 3 sample companies
   ("Cargofox Robotics," "Aveline Health," "Ledgerline AI") show up and
   open correctly. Then switch back.
4. Have the app already running (`npm run dev` or deployed) and open in a
   browser tab before the meeting starts. Don't build/deploy live.

## The actual demo flow

1. Go to **Challenge Mode**.
2. Say: *"Give me any startup you're looking at. Don't tell me what you
   think about it. Give me five minutes."*
3. Type the company name (or website) Anis gives you.
4. Optional: check "Ask Aaran First" if you want to answer 3 questions
   yourself before seeing the AI's output — this is the strongest way to
   show you're using AI to sharpen your own thinking, not replace it.
5. Click "Challenge AARAN AI." The timer starts, the progress list runs.
6. When it finishes, walk through in this order (this is exactly the order
   `ChallengeResults` renders):
   - What the company does
   - Why now
   - Why it could become important
   - **What could kill it** (Devil's Advocate) — this is a strong moment
   - Top competitors
   - Strategic corporate fit
   - Japan opportunity
   - **5 Critical Questions** — say out loud: *"Here are the five things I'd
     want to know before spending more time on this company."*
   - Questions for founders
   - Next diligence
7. Click **Generate IC Brief** for the formatted memo. Point out: it never
   says invest or don't invest. Say: *"AI gave me the research, but I don't
   want it making the investment decision. The interesting part is knowing
   what questions we still need answered."*
8. Optional: turn on **Presentation Mode** (top bar) beforehand to hide the
   sidebar and keep the screen focused during the walkthrough.

## If live AI fails mid-demo

This is designed for exactly this situation. If a live analysis fails
(rate limit, timeout, network issue), the app shows:

> Live research unavailable right now. This can happen if the AI service is
> rate-limited or times out.

with a **"Use Demo Analysis Instead"** button. Click it — it substitutes
the closest-matching built-in demo company and continues seamlessly. Say
something like: *"Looks like the live connection hiccuped — here's how the
same analysis looks on a company we've already researched,"* and keep
going. The demo should never just stop.

## Talking points to have ready

- Why multiple agents instead of one prompt (see `docs/HOW_AI_WORKS.md`)
- Why the Evidence Engine matters — point at a VERIFIED FACT vs. UNKNOWN
  badge on screen and explain the difference
- Why Devil's Advocate exists — confirmation bias, not accuracy, is the
  problem it solves
- What you'd improve next (see `docs/QUESTIONS_ANIS_MIGHT_ASK.md`) — having
  a real answer to "what's missing" is more credible than pretending it's
  finished
