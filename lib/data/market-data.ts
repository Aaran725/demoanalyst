import { dataPoint, unavailable, type DataPoint } from "./types";

/**
 * Best-effort current price/volume via Stooq's free CSV endpoint — no key,
 * no signup. Stooq is an unofficial aggregator with end-of-day (delayed)
 * data, not an exchange feed, so we always label it that way and always
 * show the quote date. If it fails or the symbol isn't covered, we return
 * `unavailable` rather than ever inventing a price.
 */
export interface MarketQuote {
  price: DataPoint<number | null>;
  quoteDate: string | null;
}

export async function fetchMarketQuote(ticker: string): Promise<MarketQuote> {
  const symbol = `${ticker.trim().toLowerCase()}.us`;
  const url = `https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Stooq returned ${res.status}`);
    const csv = await res.text();
    const lines = csv.trim().split("\n");
    if (lines.length < 2) throw new Error("No data row in Stooq response");
    const cols = lines[1].split(",");
    // Header: Symbol,Date,Time,Open,High,Low,Close,Volume
    const [, date, , , , , close] = cols;
    const price = Number(close);
    if (!date || date === "N/D" || !Number.isFinite(price) || price <= 0) {
      throw new Error("Stooq has no valid quote for this symbol");
    }
    return {
      price: dataPoint(price, {
        source: "Stooq — end-of-day quote (unofficial aggregator, delayed)",
        sourceUrl: `https://stooq.com/q/?s=${symbol}`,
        reportingPeriod: date,
        publishedAt: date,
        confidence: "verified",
        dataType: "share_price",
        note: "End-of-day close, not a real-time exchange feed. Treat intraday moves as unknown.",
      }),
      quoteDate: date,
    };
  } catch (err) {
    return {
      price: unavailable("share_price", `Could not retrieve a market quote for ${ticker}. ${err instanceof Error ? err.message : ""}`.trim()),
      quoteDate: null,
    };
  }
}
