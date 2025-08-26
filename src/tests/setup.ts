import "@testing-library/jest-dom";
import { beforeAll, beforeEach } from "vitest";

// limpa storage entre testes
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

// mock fetch por padrão (para não bater na rede sem querer);
// reconfigure nos testes que precisarem.
beforeAll(() => {
  if (!globalThis.fetch) {
    globalThis.fetch = () => Promise.reject(new Error("fetch not mocked"));
  }
});
