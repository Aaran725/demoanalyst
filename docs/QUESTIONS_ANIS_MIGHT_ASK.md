# Questions Anis Might Ask

Honest, specific answers — not generic pitch-deck language. Study these,
but answer in your own words in the actual conversation.

### Why did you build this?

I'm interested in AI, startups, and venture capital, and I wanted to build
something that actually reflects how real investment research works —
facts vs. inference, confirmation bias, strategic fit — instead of another
generic AI chatbot wrapper.

### What problem does it solve?

Doing real due diligence on a startup means pulling together market
research, competitor analysis, business model analysis, founder background,
and a healthy amount of skepticism — and keeping straight what's actually
verified vs. what's just a reasonable guess. That's slow and easy to do
inconsistently. AARAN AI organizes that process and is explicit, every
time, about which parts are facts and which parts are AI reasoning.

### Why is this different from simply using Claude directly?

If you just ask Claude "analyze this startup," you get one unstructured
answer that mixes verified facts, speculation, and analysis together with
no way to tell them apart, and it's easy to get a confidently-worded answer
that sounds more certain than it should. AARAN AI splits the work across 14
focused agents, forces every factual claim to be labeled by confidence
level, and has a dedicated step whose only job is to argue against the
optimistic case. That structure is the product — not the fact that it calls
an LLM.

### How does Claude work inside the application?

Every agent sends Claude a system prompt (rules) and a user prompt
(the specific question plus context from earlier agents), and gets back
text that's supposed to be JSON. The app parses that JSON and checks it
against a strict schema before trusting it. All of this happens server-side
— the browser never talks to Claude directly and never sees the API key.

### Why did you use multiple AI agents?

A model asked to do many different things in one prompt tends to do all of
them a little shallowly. A model asked to do one specific thing — "just
analyze the competitive moat" — does that one thing more carefully. It also
means I can validate and debug each piece independently instead of one
giant unstructured response.

### Where can AI hallucinate?

Anywhere it's asked about something it doesn't actually have reliable
knowledge of — specific financial figures, funding amounts, founder
credentials, market size numbers, or a very recent event outside its
training data. Without a live web-search connection (which this prototype
doesn't have wired in), the model is reasoning from what it already knows,
not fresh research.

### How do you reduce hallucinations?

Two ways, and I'm honest that neither fully eliminates the problem: (1)
every agent's instructions explicitly forbid inventing specific numbers it
can't support, and require marking anything uncertain as "unknown" instead
of guessing, and (2) every response is checked against a strict schema, so
at least malformed or incomplete answers get caught and retried rather than
silently shown. Neither of these guarantees the *content* is true — that
still needs independent verification, which the app says outright.

### How do you verify information?

Right now: the model's stated confidence level is shown, plus sources when
it names them. This prototype does not have a live web-search or
document-retrieval step to independently check claims — that's a clearly
named next step (see the README's Future Roadmap). Today, "verified fact"
means "the model states this with a specific source," not "an independent
system re-checked this against that source."

### Why did you choose these VC criteria?

I based the analysis structure on what real due diligence actually
involves: understanding the market, the product's real differentiation, the
business model's economics, evidence of actual customer demand, the
competitive landscape, defensibility (moat), the team, and — critically —
what could go wrong. The Strategic Fit and Japan Opportunity sections come
specifically from thinking about what would matter to a firm like Pegasus,
which invests globally and connects startups to corporate partners.

### How does Strategic Fit work?

A dedicated agent looks at the company's sector, product, and market, and
reasons about what kinds of companies or industries — not confirmed deals,
just plausible fits based on business logic — could benefit from a
relationship with this startup (as a customer, distributor, or technology
partner). It always gives a confidence level and explains why, and it's
explicitly instructed never to claim a real relationship exists unless
there's actual evidence.

### How does Devil's Advocate work?

It's the same underlying model, but with a very different instruction:
instead of "analyze neutrally," it's told to actively try to disprove the
optimistic case for this specific company. This exists because confirmation
bias — unconsciously looking for evidence that supports what you already
want to believe — is one of the best-documented failure modes in
investing. Having a forced, structural "argue the other side" step catches
things that an enthusiastic read-through would just skip past.

### What part did you personally build?

Every prompt, the schema design, the decision about which agents run in
what order and in parallel, all the demo company content, every page and
component, and the overall design system. I used existing libraries for
solved problems — React/Next.js for the app framework, Zod for schema
validation, Tailwind for styling, Radix for accessible tab components — so
I could spend my own effort on the actual novel part: the agent design and
the evidence discipline.

### What was hardest?

Being disciplined about NOT letting the AI sound more confident than it
actually is. It's very easy to write a prompt that produces impressive,
fluent-sounding analysis — the hard part is forcing it to say "unknown"
instead of guessing, everywhere that's the honest answer, and building the
schema so the UI can't accidentally hide that uncertainty.

### What mistakes did you make?

Early on it's tempting to make the app "look" sophisticated with lots of
generated numbers and confident language — that's actually the opposite of
what real diligence looks like. The Evidence Engine exists because of that
realization: a report that's honest about what it doesn't know is more
useful than one that fills every gap with a plausible-sounding guess.

### What would you improve next?

In priority order: (1) a real web-search/document-retrieval step so
"verified fact" means independently checked, not just "the model said so
with a source name," (2) real pitch deck parsing (today the file is
referenced by name only, not read), (3) a real Supabase-backed multi-user
database instead of browser localStorage, (4) OpenAI/Gemini as alternate
providers behind the existing abstraction, (5) a real company database
behind Startup World Cup Scout instead of sample data.

### Could Pegasus actually use this?

Not as-is, on real confidential deals — see the next answer. But the
architecture (specialist agents, structured evidence, forced skepticism) is
a real pattern a VC-as-a-service platform could build on, and I'd want to
talk through what a production version would need.

### How would you make this enterprise-ready?

At minimum: real authentication and role-based access control, encrypted
storage for uploaded documents (pitch decks aren't even parsed today, only
referenced by filename), a signed data-processing agreement with the AI
provider covering confidential data, audit logging of who accessed what,
a real database with Row Level Security instead of browser storage, and
independent verification of "facts" rather than trusting the model's own
stated confidence.

### How would you protect confidential pitch decks?

Today: the app doesn't upload or parse pitch deck contents at all — only
the filename is referenced, specifically to avoid handling confidential
files without the security controls that would require. A real version
would need encryption at rest, strict access control, a data-processing
agreement with whichever AI provider is used, and probably an option to
run against a private/enterprise AI deployment rather than a shared API.

### What happens when AI is wrong?

The app can't detect that on its own — it can only tell you when it *isn't
sure*, via the Evidence Engine's status labels. When it states something as
a fact, that's the model's claim, not an independently verified truth. This
is said outright in the app itself: "AI can make mistakes. Important
information should be independently verified." The whole design — multiple
focused agents, Devil's Advocate, explicit uncertainty labeling — is meant
to reduce how often and how badly it's wrong, not to claim it's never
wrong.

### How much does one analysis cost?

It depends on the Claude model and pricing at the time, and how much text
each of the 14 agent calls generates — this prototype doesn't track or cap
that cost per run. A rough way to think about it: it's roughly 14-15 model
calls per full analysis (some running in parallel), each with a moderate
amount of context. For an exact number, check current Anthropic API pricing
against the model configured in `.env.local`.

### How long does one analysis take?

With live AI, roughly the time for 4 sequential rounds of API calls (see
`docs/ARCHITECTURE.md`) — typically well under a minute in testing, though
this depends on the model and current API load. In Demo Mode, it's
instant, since no AI call happens at all.
