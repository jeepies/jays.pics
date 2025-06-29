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

import { baseURL } from "~/lib/ip";
import "../emails/emails.css";

interface VerificationEmailProps {
  verificationCode?: string;
}

const baseUrl = baseURL();

export default function VerificationEmail({
  verificationCode = "JP-12345-V",
}: Readonly<VerificationEmailProps>) {
  return (
    <Html>
      <Head />
      <Body className="main">
        <Preview>Log in with this magic link.</Preview>
        <Container className="container">
          <Img
            src={`${baseUrl}/logo.png`}
            width={48}
            height={48}
            alt="jays.pics"
          />
          <Heading className="heading">🔑 Your verification code</Heading>
          <Section className="body">
            <code className="code">{verificationCode}</code>
            <Text className="paragraph">
              If you didn't request this, ignore this email, or use the key and
              get some free image hosting.
            </Text>
          </Section>
          <Text className="paragraph">
            Welcome and thank you for joining jays.pics,
            <br />- jays.pics Team
          </Text>
          <Hr className="hr" />
          <Text className="footer">jays.pics</Text>
          <Text className="footer">
            <Link href={`${baseUrl}/tos`}>Terms of Service</Link> |{" "}
            <Link href={`${baseUrl}/privacy`}>Privacy Policy</Link> |{" "}
            <Link href="https://github.com/jeepies/jays.pics">GitHub</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
