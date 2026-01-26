-- This is an empty migration.
INSERT INTO "HackathonConfig" ("id", "key", "value", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'MAILING',
  '{
    "passwordResetTemplate": {
      "title": "Password Reset Request",
      "object": "Password Reset Request for Qubit or Not Qubit",
      "buttonText": "Reset My Password",
      "closingNote": "If you did not request a password reset, please ignore this email.",
      "actionPrompt": "To reset your password, please click the button below:",
      "signatureName": "The Qubit or Not Qubit Team",
      "introParagraph": "We received a request to reset your password for your account at Qubit or Not Qubit.",
      "signatureSalutation": "Best regards,"
    },
    "firstConnectionTemplate": {
      "title": "Welcome to Qubit or not Qubit",
      "object": "Welcome to Qubit or Not Qubit !",
      "buttonText": "Access to my account",
      "closingNote": "If you have any questions, our team is here to help you.",
      "actionPrompt": "To confirm your participation and access your account, please click the button below:",
      "signatureName": "The Qubit or Not Qubit Team",
      "introParagraph": "You are invited to participate in Qubit or Not Qubit. We are excited to have you on board!",
      "signatureSalutation": "Best regards,"
    }
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT ("key") DO NOTHING;
