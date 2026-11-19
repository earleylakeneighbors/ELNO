const MIN_GAP_MS = 125;
const RATE_LIMIT_RETRIES = 2;
const RATE_LIMIT_BACKOFF_MS = 1000;

let lastSendAt = 0;

function isRateLimitError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("too many requests") ||
    lower.includes("rate limit") ||
    lower.includes("429")
  );
}

async function pace(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastSendAt;
  if (elapsed < MIN_GAP_MS) {
    await new Promise((r) => setTimeout(r, MIN_GAP_MS - elapsed));
  }
  lastSendAt = Date.now();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Runs a single Resend send with pacing and limited retries on rate-limit errors.
 */
export async function sendWithRateLimit<T extends { error?: { message: string } | null; data?: { id?: string } | null }>(
  send: () => Promise<T>,
): Promise<{ ok: boolean; resendId?: string; error?: string }> {
  await pace();

  let attempt = 0;
  while (attempt <= RATE_LIMIT_RETRIES) {
    try {
      const result = await send();
      if (result.error) {
        const msg = result.error.message;
        if (isRateLimitError(msg) && attempt < RATE_LIMIT_RETRIES) {
          attempt += 1;
          await sleep(RATE_LIMIT_BACKOFF_MS * attempt);
          await pace();
          continue;
        }
        return { ok: false, error: msg };
      }
      return { ok: true, resendId: result.data?.id ?? undefined };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected send error";
      if (isRateLimitError(msg) && attempt < RATE_LIMIT_RETRIES) {
        attempt += 1;
        await sleep(RATE_LIMIT_BACKOFF_MS * attempt);
        await pace();
        continue;
      }
      return { ok: false, error: msg };
    }
  }

  return { ok: false, error: "Rate limit: max retries exceeded." };
}