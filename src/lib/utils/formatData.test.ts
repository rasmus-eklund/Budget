import { it, describe, expect } from "vitest";
import { dateToString, toSek } from "./formatData";

describe("toSek", () => {
  it("should be 1,00 kr", () => {
    const sek = toSek(1).replace(/\u00A0/g, " ");
    const expected = "1,00 kr";
    expect(sek).toBe(expected);
  });
  it("should be 1000 000,00 kr", () => {
    const sek = toSek(1_000_000).replace(/\u00A0/g, " ");
    const expected = "1 000 000,00 kr";
    expect(sek).toBe(expected);
  });
});

describe("dateToString", () => {
  it("should be 2024-01-01", () => {
    const string = "2024-01-01";
    const date = new Date(string);
    const formattedDate = dateToString(date);
    expect(formattedDate).toStrictEqual(string);
  });
});
