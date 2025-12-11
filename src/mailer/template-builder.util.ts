import { readFileSync } from "fs";
import { join } from "path";
import { EmailTemplate } from "src/configuration/entities/mail_settings";

export function loadTemplateFile(templateName: string): string {
  const path = join(__dirname, "templates", templateName + ".html");
  return readFileSync(path, "utf8");
}

export function renderTemplate(
  html: string,
  template: EmailTemplate,
  variables: Record<string, any>
) {
  // replace template fields
  for (const [key, value] of Object.entries(template)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  // replace variables
  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }

  return html;
}
