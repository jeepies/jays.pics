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

import { baseURL } from "~/lib/ip";
import "../emails/emails.css";

interface ResetPasswordEmailProps {
  code?: string;
  userEmail?: string;
}

const baseUrl = baseURL();

export default function ResetPasswordEmail({
  code = "jp-TOKENHERE-pr",
  userEmail = "user@example.com",
}: Readonly<ResetPasswordEmailProps>) {
  return (
    <Html>
      <Head />
      <Body className="main">
        <Preview>Reset your password for jays.pics</Preview>
        <Container className="container">
          <Img
            src={`${baseUrl}/logo.png`}
            width={48}
            height={48}
            alt="jays.pics"
          />
          <Heading className="heading">🔐 Reset your password</Heading>
          <Section className="body">
            <Text className="paragraph">Hello,</Text>
            <Text className="paragraph">
              Someone recently requested a password change for your jays.pics
              account (<strong>{userEmail}</strong>). If this was you, you can
              set a new password by clicking the button below.
            </Text>
            <Button
              className="button"
              href={`${baseUrl}/reset-password?token=${code}`}
            >
              Reset Password
            </Button>
            <Text className="paragraph">
              If the button above doesn't work, you can copy and paste the
              following link into your browser:
            </Text>
            <code className="codeBlock">{`${baseUrl}/reset-password?token=${code}`}</code>
            <Text className="paragraph">
              If you don't want to change your password or didn't request this,
              just ignore and delete this message.
            </Text>
            <Text className="paragraph">
              This password reset link will expire in 24 hours for security
              reasons.
            </Text>
          </Section>
          <Text className="paragraph">
            Stay secure,
            <br />- The jays.pics Team
          </Text>
          <Hr className="hr" />
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
          <Text className="footer">jays.pics</Text>
          <Text className="footer">
            <Link href={`${baseUrl}/terms`}>Terms of Service</Link> |{" "}
            <Link href={`${baseUrl}/privacy`}>Privacy Policy</Link> |{" "}
            <Link href="https://github.com/jeepies/jays.pics">GitHub</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
