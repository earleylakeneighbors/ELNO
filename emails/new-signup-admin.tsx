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
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

export type NewSignupAdminEmailProps = {
  firstName: string;
  lastName: string | null;
  email: string;
  streetAddress: string | null;
  interests: string | null;
  submittedAtLabel: string;
  adminListUrl: string;
};

const colors = {
  background: "#f7f6f3",
  card: "#ffffff",
  foreground: "#2a2f2e",
  muted: "#5c6563",
  border: "#ddd9d1",
  primary: "#5f7f80",
  primaryForeground: "#f7f6f3",
  panel: "#f3f2ee",
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Row style={{ marginBottom: "10px" }}>
      <Column style={{ width: "132px", verticalAlign: "top" }}>
        <Text
          style={{
            color: colors.muted,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            margin: 0,
            textTransform: "uppercase" as const,
          }}
        >
          {label}
        </Text>
      </Column>
      <Column style={{ verticalAlign: "top" }}>
        <Text
          style={{
            color: colors.foreground,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            fontSize: "15px",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          {children}
        </Text>
      </Column>
    </Row>
  );
}

export function NewSignupAdminEmail({
  firstName,
  lastName,
  email,
  streetAddress,
  interests,
  submittedAtLabel,
  adminListUrl,
}: NewSignupAdminEmailProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || "—";
  const logoUrl = `${adminListUrl.replace(/\/admin\/subscribers\/?$/, "")}/images/elno-logo.png`;

  return (
    <Html lang="en">
      <Head />
      <Preview>New signup: {fullName} — open the email list in admin</Preview>
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
              padding: "24px 32px",
              textAlign: "center" as const,
            }}
          >
            <Img
              src={logoUrl}
              width="44"
              height="44"
              alt=""
              style={{
                borderRadius: "999px",
                display: "block",
                margin: "0 auto 10px",
              }}
            />
            <Text
              style={{
                color: colors.primaryForeground,
                fontFamily: 'Georgia, "Times New Roman", Times, serif',
                fontSize: "16px",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Earley Lake Neighborhood Organization
            </Text>
          </Section>

          <Section style={{ padding: "32px 32px 8px" }}>
            <Heading
              as="h1"
              style={{
                color: colors.foreground,
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: "1.25",
                margin: "0 0 8px",
              }}
            >
              New email list signup
            </Heading>
            <Text
              style={{
                color: colors.muted,
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "15px",
                lineHeight: "1.55",
                margin: "0 0 24px",
              }}
            >
              A neighbor joined through the website. Details are below.
            </Text>

            <Section
              style={{
                backgroundColor: colors.panel,
                border: `1px solid ${colors.border}`,
                borderRadius: "12px",
                padding: "20px 18px",
              }}
            >
              <DetailRow label="Name">{fullName}</DetailRow>
              <DetailRow label="Email">
                <Link
                  href={`mailto:${email}`}
                  style={{ color: colors.primary, textDecoration: "underline" }}
                >
                  {email}
                </Link>
              </DetailRow>
              <DetailRow label="Address">{streetAddress?.trim() || "—"}</DetailRow>
              <DetailRow label="Interests">{interests?.trim() || "—"}</DetailRow>
              <DetailRow label="Submitted">{submittedAtLabel}</DetailRow>
            </Section>

            <Section style={{ marginTop: "28px", textAlign: "center" as const }}>
              <Button
                href={adminListUrl}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: "10px",
                  color: colors.primaryForeground,
                  display: "inline-block",
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 22px",
                  textDecoration: "none",
                }}
              >
                Open email list in admin
              </Button>
            </Section>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "8px 32px 0" }} />

          <Section style={{ padding: "20px 32px 28px" }}>
            <Text
              style={{
                color: colors.muted,
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "13px",
                lineHeight: "1.55",
                margin: "0 0 8px",
              }}
            >
              Reply to this message to email the subscriber directly.
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontSize: "12px",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              <Link href={adminListUrl} style={{ color: colors.primary }}>
                {adminListUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

NewSignupAdminEmail.PreviewProps = {
  firstName: "Jordan",
  lastName: "Hale",
  email: "jordan.hale@example.com",
  streetAddress: "123 Lakeview Dr",
  interests: "Events, neighborhood news",
  submittedAtLabel: "Mar 29, 2026, 4:10 PM",
  adminListUrl: "https://www.earleylakeneighbors.org/admin/subscribers",
} satisfies NewSignupAdminEmailProps;

export default NewSignupAdminEmail;
