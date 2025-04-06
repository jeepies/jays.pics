import type { LogType as LogTypeOrigin } from "@prisma/client";

export const LogType: { [k in LogTypeOrigin]: k } = {
    ERROR: "ERROR",
    DOMAIN_CHECK: "DOMAIN_CHECK",
} as const;

export type LogType = LogTypeOrigin