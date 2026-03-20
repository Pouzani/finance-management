import { formatMAD } from "./data";

// Node.js ICU data in CI may produce different thousand-separators than a browser
// (e.g. "." vs "\u202f"). We test numeric content, not separator character.
function digits(s: string) {
  return s.replace(/\D/g, "");
}

describe("formatMAD", () => {
  it("formats a positive integer — numeric digits are correct", () => {
    expect(digits(formatMAD(28500))).toBe("28500");
  });

  it("formats a negative number as its absolute value (no minus sign)", () => {
    const result = formatMAD(-6500);
    expect(result).not.toContain("-");
    expect(digits(result)).toBe("6500");
  });

  it("formats zero as '0'", () => {
    expect(formatMAD(0)).toBe("0");
  });

  it("formats amounts below 1000 — no thousands separator", () => {
    expect(formatMAD(480)).toBe("480");
  });

  it("rounds to integer — no fractional digits in output", () => {
    // 1234.99 rounds to 1235; there should be no decimal separator followed by digits
    const result = formatMAD(1234.99);
    // After stripping thousands separators, we get pure integer digits
    expect(digits(result)).toBe("1235");
  });

  it("formats large numbers — digits are correct", () => {
    expect(digits(formatMAD(128450))).toBe("128450");
  });

  it("formatMAD(28500) is consistent across calls", () => {
    expect(formatMAD(28500)).toBe(formatMAD(28500));
  });
});
