import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
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
};

const colors = {
  background: "#f7f6f3",
  card: "#ffffff",
  foreground: "#2a2f2e",
  muted: "#5c6563",
  border: "#ddd9d1",
  primary: "#5f7f80",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Text
      style={{
        color: colors.foreground,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontSize: "15px",
        lineHeight: "1.5",
        margin: "0 0 12px",
      }}
    >
      <strong style={{ color: colors.muted, fontWeight: 600 }}>{label}: </strong>
      {value}
    </Text>
  );
}

export function NewSignupAdminEmail({
  firstName,
  lastName,
  email,
  streetAddress,
  interests,
  submittedAtLabel,
}: NewSignupAdminEmailProps) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || "—";

  return (
    <Html lang="en">
      <Head />
      <Preview>New email list signup: {fullName}</Preview>
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
            padding: "32px",
          }}
        >
          <Heading
            as="h1"
            style={{
              color: colors.foreground,
              fontSize: "24px",
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            New email list signup
          </Heading>
          <Text
            style={{
              color: colors.muted,
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontSize: "14px",
              margin: "0 0 24px",
            }}
          >
            Someone joined through the website join form.
          </Text>

          <Section>
            <Field label="Name" value={fullName} />
            <Field label="Email" value={email} />
            <Field label="Street address" value={streetAddress?.trim() || "—"} />
            <Field label="Interests" value={interests?.trim() || "—"} />
            <Field label="Submitted" value={submittedAtLabel} />
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "24px 0" }} />

          <Text
            style={{
              color: colors.muted,
              fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
              fontSize: "13px",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            Reply to this message to reach the subscriber directly.
          </Text>
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
} satisfies NewSignupAdminEmailProps;

export default NewSignupAdminEmail;
