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

export type AnnouncementBlastEmailProps = {
  firstName: string;
  siteUrl: string;
  announcementTitle: string;
  announcementExcerpt: string;
  announcementUrl: string;
  heroImageUrl?: string | null;
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

export function AnnouncementBlastEmail({
  firstName,
  siteUrl,
  announcementTitle,
  announcementExcerpt,
  announcementUrl,
  heroImageUrl,
}: AnnouncementBlastEmailProps) {
  const name = firstName.trim() || "neighbor";
  const base = siteUrl.replace(/\/$/, "");
  const logoUrl = `${base}/images/logo-mark.png`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{announcementTitle}</Preview>
      <Body
        style={{
          backgroundColor: colors.background,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
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
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Earley Lake Neighborhood Organization
            </Text>
          </Section>

          {heroImageUrl ? (
            <Section style={{ margin: 0, lineHeight: 0 }}>
              <Img
                src={heroImageUrl}
                width="560"
                alt=""
                style={{
                  display: "block",
                  maxHeight: "280px",
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            </Section>
          ) : null}

          <Section style={{ padding: "36px 32px 8px" }}>
            <Text
              style={{
                color: colors.muted,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "14px",
                margin: "0 0 12px",
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
              }}
            >
              Neighborhood news
            </Text>
            <Heading
              as="h1"
              style={{
                color: colors.foreground,
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.25",
                margin: "0 0 16px",
              }}
            >
              Hi {name} — {announcementTitle}
            </Heading>
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
              {announcementExcerpt}
            </Text>

            <Section style={{ textAlign: "center" as const, marginBottom: "28px" }}>
              <Button
                href={announcementUrl}
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
                Read the full story
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

export default AnnouncementBlastEmail;