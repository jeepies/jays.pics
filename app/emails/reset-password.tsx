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

interface ResetPasswordEmailProps {
  code?: string;
  userEmail?: string;
}

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : process.env.BASE_DOMAIN;

export default function ResetPasswordEmail({
  code = "jp-TOKENHERE-pr",
  userEmail = "user@example.com",
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset your password for jays.pics</Preview>
        <Container style={container}>
          <Img
            src={`${baseUrl}/logo.png`}
            width={48}
            height={48}
            alt="jays.pics"
          />
          <Heading style={heading}>🔐 Reset your password</Heading>
          <Section style={body}>
            <Text style={paragraph}>Hello,</Text>
            <Text style={paragraph}>
              Someone recently requested a password change for your jays.pics
              account (<strong>{userEmail}</strong>). If this was you, you can
              set a new password by clicking the button below.
            </Text>
            <Button
              style={button}
              href={`${baseUrl}/reset-password?token=${code}`}
            >
              Reset Password
            </Button>
            <Text style={paragraph}>
              If the button above doesn't work, you can copy and paste the
              following link into your browser:
            </Text>
            <code
              style={codeBlock}
            >{`${baseUrl}/reset-password?token=${code}`}</code>
            <Text style={paragraph}>
              If you don't want to change your password or didn't request this,
              just ignore and delete this message.
            </Text>
            <Text style={paragraph}>
              This password reset link will expire in 24 hours for security
              reasons.
            </Text>
          </Section>
          <Text style={paragraph}>
            Stay secure,
            <br />- The jays.pics Team
          </Text>
          <Hr style={hr} />
          <Img
            src={`${baseUrl}/logo.png`}
            width={32}
            height={32}
            style={{
              WebkitFilter: "grayscale(100%)",
              filter: "grayscale(100%)",
              margin: "20px 0",
            }}
          />
          <Text style={footer}>jays.pics</Text>
          <Text style={footer}>
            <Link href={`${baseUrl}/terms`}>Terms of Service</Link> |{" "}
            <Link href={`${baseUrl}/privacy`}>Privacy Policy</Link> |{" "}
            <Link href="https://github.com/jeepies/jays.pics">GitHub</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/logo.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const body = {
  margin: "24px 0",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const codeBlock = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "12px 20px",
  backgroundColor: "#f0f0f0",
  borderRadius: "4px",
  color: "#000000",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  margin: "20px auto",
};

const button = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "12px 20px",
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  margin: "20px auto",
};

const hr = {
  borderColor: "#dddddd",
  marginTop: "48px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginLeft: "4px",
};
