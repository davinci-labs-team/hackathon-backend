export type JsonObject = { [key: string]: any };
export type JsonType = string | number | boolean | null | JsonObject | JsonType[];

export class ConfigurationResponse {
  id: string;
  key: string;
  value: JsonType;
  createdAt: Date;
  updatedAt: Date | null;
}
