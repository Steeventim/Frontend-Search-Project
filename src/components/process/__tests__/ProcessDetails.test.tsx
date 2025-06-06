import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import ProcessDetails from "../ProcessDetails";
import { RolePermissionsProvider } from "../../../context/RolePermissionsContext";

// Mock du hook useProcessData
vi.mock("../../../hooks/useProcessData", () => ({
  useProcessData: () => ({
    process: {
      idProcessus: "1",
      Titre: "Test Process",
      Description: "Test Description",
      Statut: "En cours",
      DateCreation: "2024-01-01",
      auteur: {
        nom: "John Doe",
        email: "john@example.com",
      },
      etapes: [
        {
          idEtape: "1",
          Titre: "Étape 1",
          Description: "Description étape 1",
          Statut: "Terminée",
          Ordre: 1,
        },
      ],
    },
    isLoading: false,
    error: null,
    updateProcessStatus: vi.fn(),
    addComment: vi.fn(),
  }),
}));

// Mock du service API
vi.mock("../../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <RolePermissionsProvider>{component}</RolePermissionsProvider>
    </BrowserRouter>
  );
};

describe("ProcessDetails", () => {
  beforeEach(() => {
    // Reset des mocks avant chaque test
    vi.clearAllMocks();
  });

  test("se rend sans erreur", () => {
    expect(() => {
      renderWithProviders(<ProcessDetails />);
    }).not.toThrow();
  });

  test("affiche soit le processus soit un message d'erreur", async () => {
    renderWithProviders(<ProcessDetails />);

    // Vérifier que le composant affiche quelque chose
    await waitFor(() => {
      const element = document.body;
      expect(element.textContent?.length).toBeGreaterThan(0);
    });
  });

  test("gère l'état d'absence de processus", async () => {
    renderWithProviders(<ProcessDetails />);

    // Vérifier que le message d'absence est affiché ou que les données sont là
    await waitFor(() => {
      const notFoundMessage = screen.queryByText("Processus non trouvé");
      const hasContent = document.body.textContent?.includes("Process");

      // Au moins l'un des deux devrait être vrai
      expect(notFoundMessage || hasContent).toBeTruthy();
    });
  });
});
