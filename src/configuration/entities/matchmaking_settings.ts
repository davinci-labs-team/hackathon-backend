export class Constraint {
  rule: "MIN" | "MAX" | "EQUAL";
  schools: string[];
  value: number;
  multiple: boolean;

  constructor(
    rule: "MIN" | "MAX" | "EQUAL",
    schools: string[],
    value: number,
    multiple: boolean
  ) {
    this.rule = rule;
    this.schools = schools;
    this.value = value;
    this.multiple = multiple;
  }
}

export class MatchmakingSettings {
  isActive: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  constraints: Constraint[];

  constructor(
    isActive: boolean,
    teamSizeMin: number,
    teamSizeMax: number,
    constraints: Constraint[]
  ) {
    this.isActive = isActive;
    this.teamSizeMin = teamSizeMin;
    this.teamSizeMax = teamSizeMax;
    this.constraints = constraints;
  }
}
