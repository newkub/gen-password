export interface PasswordOptions {
	length: number;
	includeUppercase: boolean;
	includeLowercase: boolean;
	includeNumbers: boolean;
	includeSymbols: boolean;
}

export type SecurityLevel = "veryWeak" | "weak" | "medium" | "strong" | "veryStrong";

export interface GeneratePasswordResponse {
	password: string;
}
