import { Phase } from "../entities/phase_settings";

export const DEFAULT_HACKATHON_PHASES: Phase[] = [
  {
    name: "Phase 1",
    order: 1,
    status: "PENDING",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Phase 2",
    order: 2,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Phase 3",
    order: 3,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
  {
    name: "Phase 4",
    order: 4,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Phase 5",
    order: 5,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
  {
    name: "Phase 6",
    order: 6,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
];
