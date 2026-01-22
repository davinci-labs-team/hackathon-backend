import { Phase } from "../entities/phase_settings";

export const DEFAULT_HACKATHON_PHASES: Phase[] = [
  {
    name: "Complétion du Profil",
    order: 1,
    status: "PENDING",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Sélection du Sujet",
    order: 2,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Formation des Equipes",
    order: 3,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
  {
    name: "Hackathon",
    order: 4,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: false,
  },
  {
    name: "Evaluation & Feedback",
    order: 5,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
  {
    name: "Clôture & Résultats",
    order: 6,
    status: "NOT_STARTED",
    endDate: null,
    startDate: null,
    optionalPhase: true,
  },
];
