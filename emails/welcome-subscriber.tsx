import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type WelcomeSubscriberEmailProps = {
  firstName: string;
  siteUrl: string;
};

const colors = {
  background: "#f7f6f3",
  card: "#ffffff",
  foreground: "#2a2f2e",
  muted: "#5c6563",
  border: "#ddd9d1",
  primary: "#5f7f80",
  primaryForeground: "#f7f6f3",
};

export function WelcomeSubscriberEmail({
  firstName,
  siteUrl,
}: WelcomeSubscriberEmailProps) {
  const name = firstName.trim() || "neighbor";
  const base = siteUrl.replace(/\/$/, "");
  const logoUrl = `${base}/images/logo-mark.png`;
  const eventsUrl = `${base}/events`;
  const aboutUrl = `${base}/about`;

  return (
    <Html lang="en">
      <Head />
      <Preview>
        Thanks for joining the Earley Lake Neighborhood email list — you&apos;re
        in!
      </Preview>
      <Body
        style={{
          backgroundColor: colors.background,
          fontFamily:
            'Georgia, "Times New Roman", Times, serif',
          margin: 0,
          padding: "32px 16px",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "16px",
            margin: "0 auto",
            maxWidth: "560px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              backgroundColor: colors.primary,
              padding: "28px 32px",
              textAlign: "center" as const,
            }}
          >
            <Img
              src={logoUrl}
              width="48"
              height="48"
              alt=""
              style={{
                borderRadius: "999px",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <Text
              style={{
                color: colors.primaryForeground,
                fontFamily:
                  'Georgia, "Times New Roman", Times, serif',
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Earley Lake Neighborhood Organization
            </Text>
          </Section>

          <Section style={{ padding: "36px 32px 8px" }}>
            <Heading
              as="h1"
              style={{
                color: colors.foreground,
                fontFamily:
                  'Georgia, "Times New Roman", Times, serif',
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.25",
                margin: "0 0 16px",
              }}
            >
              Thank you, {name}
            </Heading>
            <Text
              style={{
                color: colors.muted,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "0 0 16px",
              }}
            >
              You&apos;re on the Earley Lake Neighborhood email list. We&apos;re
              glad you&apos;re here — we&apos;ll share announcements, gathering
              ideas, and ways to get involved around Earley Lake in Burnsville,
              MN.
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "16px",
                lineHeight: "1.6",
                margin: "0 0 28px",
              }}
            >
              No spam, no pressure — just neighborly updates when there&apos;s
              something worth knowing.
            </Text>

            <Section style={{ textAlign: "center" as const, marginBottom: "12px" }}>
              <Button
                href={eventsUrl}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: "10px",
                  color: colors.primaryForeground,
                  display: "inline-block",
                  fontFamily:
                    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 22px",
                  textDecoration: "none",
                }}
              >
                See upcoming events
              </Button>
            </Section>
            <Section style={{ textAlign: "center" as const, marginBottom: "28px" }}>
              <Button
                href={aboutUrl}
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  color: colors.foreground,
                  display: "inline-block",
                  fontFamily:
                    'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 22px",
                  textDecoration: "none",
                }}
              >
                Learn about us
              </Button>
            </Section>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "0 32px" }} />

          <Section style={{ padding: "24px 32px 32px" }}>
            <Text
              style={{
                color: colors.muted,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "13px",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Earley Lake Neighborhood Organization · Burnsville, MN
              <br />
              <Link
                href={base}
                style={{ color: colors.primary, textDecoration: "underline" }}
              >
                Visit our website
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeSubscriberEmail.PreviewProps = {
  firstName: "Jordan",
  siteUrl: "https://www.earleylakeneighbors.org",
} satisfies WelcomeSubscriberEmailProps;

export default WelcomeSubscriberEmail;
