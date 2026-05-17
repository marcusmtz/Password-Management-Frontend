import { PasswordSummary } from "./PasswordSummary";

export interface SecurityReport {
    totalPasswords: number;
    weakPasswords: PasswordSummary[];
    repeatedPasswords: PasswordSummary[];
}