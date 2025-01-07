import type { LogType as LogTypeOrigin } from "@prisma/client";

export const LogType: { [k in LogTypeOrigin]: k } = {
    ERROR: "ERROR",
    DOMAIN_CHECK: "DOMAIN_CHECK",
    HONEYPOT: "HONEYPOT",
} as const;

export type LogType = LogTypeOrigin