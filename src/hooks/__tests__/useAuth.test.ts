import { renderHook } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { useAuth } from "../useAuth";

// Mock des dépendances
vi.mock("../../services/authService", () => ({
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("peut être appelé sans erreur", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).not.toThrow();
  });

  test("retourne un objet avec les propriétés attendues", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("isAuthenticated");
    expect(result.current).toHaveProperty("login");
    expect(result.current).toHaveProperty("logout");
  });

  test("initialise avec un état cohérent", () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.isAuthenticated).toBe("boolean");
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
  });
});
