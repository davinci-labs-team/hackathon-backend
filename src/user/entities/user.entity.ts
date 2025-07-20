export class User {
  id: string;
  name: string;
  email: string;
  supabaseId: string;
  createdAt: Date;
  updatedAt: Date;

  subjectPreferences: string[];
  languagePreferences: string[];
  schoolAffiliations: string[];
}
