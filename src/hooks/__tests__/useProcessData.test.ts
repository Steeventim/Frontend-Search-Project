import { renderHook } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { useProcessData } from "../useProcessData";

// Mock du service processus
vi.mock("../../services/processService", () => ({
  default: {
    getProcessById: vi.fn(),
    updateProcessStatus: vi.fn(),
    addProcessComment: vi.fn(),
  },
}));

describe("useProcessData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("peut être appelé sans erreur", () => {
    expect(() => {
      renderHook(() => useProcessData("1"));
    }).not.toThrow();
  });

  test("peut être appelé avec un ID vide", () => {
    expect(() => {
      renderHook(() => useProcessData(""));
    }).not.toThrow();
  });

  test("peut être appelé avec un ID null", () => {
    expect(() => {
      renderHook(() => useProcessData(null));
    }).not.toThrow();
  });
});
