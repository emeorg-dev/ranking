export type Locale = "es" | "en";

export type BaseDictionary = typeof import("./dictionaries/es").es;

// Recursively convert string literal types to string
export type RelaxStringLiterals<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: RelaxStringLiterals<T[K]> }
    : T;

export type TranslationDictionary = RelaxStringLiterals<BaseDictionary>;

export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

export type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string
        ? `${F}${D}${Join<Extract<R, string[]>, D>}`
        : never
      : string;

export type TranslationKey = Join<PathsToStringProps<BaseDictionary>, ".">;
