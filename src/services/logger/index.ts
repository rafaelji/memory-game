import type { Logger } from "./types";
import { IS_DEV } from "@/constants/env";

const noop = () => {};

export const defaultLogger: Logger = IS_DEV
  ? {
      error: (...args) => console.error(...args),
      warn: (...args) => console.warn(...args),
      info: (...args) => console.info(...args),
    }
  : { error: noop, warn: noop, info: noop };

export default defaultLogger;
