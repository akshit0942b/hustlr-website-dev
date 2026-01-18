import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface HustlrNotificationEmailProps {
  name?: string;
  email?: string;
  statusText?: string;
  link?: string;
}

export const HustlrNotificationEmail = ({
  name,
  email,
  statusText,
  link,
}: HustlrNotificationEmailProps) => {
  const previewText = `Update from huslr.`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-gray-50 px-4 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-10 max-w-[500px] rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <Heading className="text-center font-serif text-2xl tracking-tight text-black">
              huslr.
            </Heading>

            <Hr className="my-6 border border-gray-200" />

            <Text className="text-[14px] text-gray-900 leading-6">
              Hello <span className="font-medium">{name}</span>,
            </Text>
            <Text className="text-[14px] text-gray-800 leading-6">
              {statusText}
            </Text>

            {link && (
              <div className="my-8 text-center">
                <Button
                  className="rounded-xl bg-black px-6 py-3 text-[14px] font-semibold text-white no-underline"
                  href={link}
                >
                  Continue
                </Button>
              </div>
            )}

            {link && (
              <Text className="text-[12px] text-gray-600 leading-5">
                Or copy and paste this URL into your browser:{" "}
                <Link href={link} className="text-blue-600 no-underline">
                  {link}
                </Link>
              </Text>
            )}

            <Hr className="my-6 border border-gray-200" />

            <Text className="text-[12px] text-gray-500 leading-5">
              This message was intended for{" "}
              <span className="text-black font-medium">{email}</span>. If you
              weren't expecting this email, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

HustlrNotificationEmail.PreviewProps = {
  name: "John Doe",
  email: "john.doe@example.com",
  statusText:
    "Congratulations! You have qualified Round 1. Please click the link below to create a new account.",
  link: "https://huslr.com/signup",
} as HustlrNotificationEmailProps;

export default HustlrNotificationEmail;
