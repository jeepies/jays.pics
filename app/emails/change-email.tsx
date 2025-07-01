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
  Button,
} from "@react-email/components";

import { baseURL } from "~/lib/ip";
import "../emails/emails.css";

interface ChangeEmailProps {
  code?: string;
  userEmail?: string;
  newEmail?: string;
}

const baseUrl = baseURL();

export default function ChangeEmail({
  code = "jp-EMAILCHANGE-pr",
  userEmail = "user@example.com",
  newEmail = "newuser@example.com",
}: Readonly<ChangeEmailProps>) {
  return (
    <Html>
      <Head />
      <Body className="main">
        <Preview>Confirm your new email address for jays.pics</Preview>
        <Container className="container">
          <Img
            src={`${baseUrl}/logo.png`}
            width={48}
            height={48}
            alt="jays.pics"
          />
          <Heading className="heading">
            ✉️ Confirm your new email address
          </Heading>
          <Section className="body">
            <Text className="paragraph">Hello,</Text>
            <Text className="paragraph">
              You recently requested to change your email address for your
              jays.pics account from <strong>{userEmail}</strong> to{" "}
              <strong>{newEmail}</strong>. To confirm this change, please click
              the button below:
            </Text>
            <Button
              className="button"
              href={`${baseUrl}/verify-email?token=${code}`}
            >
              Confirm Email Change
            </Button>
            <Text className="paragraph">
              If the button above doesn't work, copy and paste this link into
              your browser:
            </Text>
            <code className="codeBlock">{`${baseUrl}/verify-email?token=${code}`}</code>
            <Text className="paragraph">
              If you did not request this change, you can safely ignore this
              email.
            </Text>
          </Section>
          <Text className="paragraph">
            Stay secure,
            <br />- The jays.pics Team
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
