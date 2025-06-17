// Tests pour l'architecture modulaire de recherche
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import SearchInterface from "../SearchInterface";
import { RolePermissionsProvider } from "../../../context/RolePermissionsContext";

// Mock des services
vi.mock("../../../services/searchService", () => ({
  searchService: {
    search: vi.fn().mockResolvedValue({
      success: true,
      data: { hits: [] },
    }),
    getDocumentPreview: vi.fn(),
  },
}));

vi.mock("../../../services/userService", () => ({
  userService: {
    getUserById: vi.fn().mockResolvedValue({ id: "test-user" }),
  },
}));

vi.mock("../../../services/api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { success: true, data: [] } }),
    post: vi.fn(),
    defaults: { baseURL: "http://localhost:3003" },
  },
}));

vi.mock("../../../hooks/useProcessData", () => ({
  useProcessData: vi.fn().mockReturnValue({
    process: null,
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <RolePermissionsProvider>{component}</RolePermissionsProvider>
    </BrowserRouter>
  );
};

describe("SearchInterface", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("affiche l'interface de recherche modulaire", () => {
    renderWithProviders(<SearchInterface />);

    // Vérifier la présence du titre
    expect(screen.getByText("Recherche de documents")).toBeInTheDocument();

    // Vérifier la présence du champ de recherche
    expect(
      screen.getByPlaceholderText("Rechercher dans les documents...")
    ).toBeInTheDocument();

    // Vérifier la présence du bouton de recherche
    expect(
      screen.getByRole("button", { name: /rechercher/i })
    ).toBeInTheDocument();
  });

  test("permet la saisie dans le champ de recherche", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchInterfaceModular />);

    const searchInput = screen.getByPlaceholderText(
      "Rechercher dans les documents..."
    );
    await user.type(searchInput, "test modulaire");

    expect(searchInput).toHaveValue("test modulaire");
  });

  test("affiche les mots-clés de recherche", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchInterfaceModular />);

    const searchInput = screen.getByPlaceholderText(
      "Rechercher dans les documents..."
    );
    await user.type(searchInput, "test modulaire");

    // Vérifier que les mots-clés apparaissent
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("modulaire")).toBeInTheDocument();
  });

  test("peut déclencher une recherche en cliquant sur le bouton", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchInterfaceModular />);

    const searchInput = screen.getByPlaceholderText(
      "Rechercher dans les documents..."
    );
    const searchButton = screen.getByRole("button", { name: /rechercher/i });

    await user.type(searchInput, "test");
    await user.click(searchButton);

    // Vérifier que le service de recherche a été appelé
    const { searchService } = await import("../../../services/searchService");
    expect(searchService.search).toHaveBeenCalledWith("test");
  });

  test("peut déclencher une recherche avec la touche Entrée", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SearchInterfaceModular />);

    const searchInput = screen.getByPlaceholderText(
      "Rechercher dans les documents..."
    );

    await user.type(searchInput, "test");
    await user.keyboard("{Enter}");

    // Vérifier que le service de recherche a été appelé
    const { searchService } = await import("../../../services/searchService");
    expect(searchService.search).toHaveBeenCalledWith("test");
  });

  test("peut être rendu sans erreur", () => {
    expect(() => {
      renderWithProviders(<SearchInterfaceModular />);
    }).not.toThrow();
  });
});
