export type JsonObject = { [key: string]: any };
export type JsonType = string | number | boolean | null | JsonObject | JsonType[];

export class SettingResponse {
  id: string;
  key: string;
  value: JsonType;
  createdAt: Date;
  updatedAt: Date | null;
}