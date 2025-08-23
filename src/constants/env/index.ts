const IS_DEV = import.meta.env.DEV;
const IS_PROD = import.meta.env.PROD;
const MODE = import.meta.env.MODE as "development" | "production" | "test";
const IS_TEST = MODE === "test";

export { IS_DEV, IS_PROD, IS_TEST, MODE };
