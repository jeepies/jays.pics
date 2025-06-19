/**
 * "Prettier" verification code generator with a <CODE> format.
 */

export enum CodeCharacterType {
  NUMERIC = "NUMERIC",
  ALPHABETIC_LOWER = "ALPHABETIC_LOWER",
  ALPHABETIC_UPPER = "ALPHABETIC_UPPER",
  ALPHABETIC_MIXED = "ALPHABETIC_MIXED",
  ALPHANUMERIC_LOWER = "ALPHANUMERIC_LOWER",
  ALPHANUMERIC_UPPER = "ALPHANUMERIC_UPPER",
  ALPHANUMERIC_MIXED = "ALPHANUMERIC_MIXED",
}

export interface GenerateCodeOptions {
  /**
   * The desired length of the variable part of the code (the <CODE> in JP-<CODE>-V).
   * @default 6
   */
  codeLength?: number;
  /**
   * The type of characters to include in the variable part of the code.
   * @default JPVCodeCharacterType.ALPHANUMERIC_MIXED
   */
  characterType?: CodeCharacterType;
  /**
   * The prefix to add to the code. [Optional] default is "JP-"
   */
  prefix?: string;
  /**
   * The suffix to add to the code. [Optional] default is "-V"
   */
  suffix?: string;
}

/**
 * Generates a verification code specifically for jays.pics in the "<CODE>" format or a prefix and suffix.
 *
 * @param options - Configuration options for the variable part of the code.
 * @returns The generated verification code in the "<CODE>" format or a prefix and suffix.
 * @param prefix - The prefix to add to the code. [Optional] default is ""
 * @param suffix - The suffix to add to the code. [Optional] default is ""
 */
export function generateCode(options?: GenerateCodeOptions): string {
  const {
    codeLength = 6,
    characterType = CodeCharacterType.ALPHANUMERIC_MIXED,
    prefix = "",
    suffix = "",
  } = options || {};

  if (codeLength <= 0) {
    throw new Error("Code length must be a positive number.");
  }

  let characters = "";
  switch (characterType) {
    case CodeCharacterType.NUMERIC:
      characters = "0123456789";
      break;
    case CodeCharacterType.ALPHABETIC_LOWER:
      characters = "abcdefghijklmnopqrstuvwxyz";
      break;
    case CodeCharacterType.ALPHABETIC_UPPER:
      characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case CodeCharacterType.ALPHABETIC_MIXED:
      characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case CodeCharacterType.ALPHANUMERIC_LOWER:
      characters = "0123456789abcdefghijklmnopqrstuvwxyz";
      break;
    case CodeCharacterType.ALPHANUMERIC_UPPER:
      characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case CodeCharacterType.ALPHANUMERIC_MIXED:
      characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
  }

  const charactersLength = characters.length;
  if (charactersLength === 0) {
    throw new Error("No characters available for code generation.");
  }

  let variableCode = "";

  const randomValues = new Uint32Array(codeLength);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < codeLength; i++) {
    const idx = randomValues[i] % charactersLength;
    variableCode += characters.charAt(idx);
  }

  return `${prefix}${variableCode}${suffix}`;
}
