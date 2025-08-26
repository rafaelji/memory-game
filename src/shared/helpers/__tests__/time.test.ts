import { formatTime } from "../time";
import { describe, expect, it } from "vitest";

describe("formatTime", () => {
  it("formats < 1h as MM:SS", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(35)).toBe("00:35");
    expect(formatTime(80)).toBe("01:20");
  });

  it("formats >= 1h as HH:MM:SS", () => {
    expect(formatTime(3600)).toBe("01:00:00");
    expect(formatTime(3661)).toBe("01:01:01");
  });

  it("guards invalid inputs", () => {
    expect(formatTime(NaN)).toBe("00:00");
  });
});
