import {
  Body,
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

import logo from "~/assets/logo.png";

interface VerificationEmailProps {
  verificationCode?: string;
}

const baseUrl = process.env.BASE_DOMAIN ?? "http://localhost:5173";

export default function VerificationEmail({
  verificationCode = "JP-12345-V",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Log in with this magic link.</Preview>
        <Container style={container}>
          <Img src={logo} width={48} height={48} alt="jays.pics" />
          <Heading style={heading}>🔑 Your verification code</Heading>
          <Section style={body}>
            <code style={code}>{verificationCode}</code>
            <Text style={paragraph}>
              If you didn't request this, ignore this email, or use the key and
              get some free image hosting.
            </Text>
          </Section>
          <Text style={paragraph}>
            Welcome and thank you for joining jays.pics,
            <br />- jays.pics Team
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
  backgroundImage: `url(${logo})`,
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

const code = {
  fontFamily: "monospace",
  fontWeight: "700",
  padding: "1px 4px",
  backgroundColor: "#dfe1e4",
  letterSpacing: "-0.3px",
  fontSize: "21px",
  borderRadius: "4px",
  color: "#3c4149",
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
