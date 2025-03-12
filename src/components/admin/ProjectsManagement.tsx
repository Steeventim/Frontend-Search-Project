import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Edit } from "lucide-react";
// import { Card } from "../common/Card";
import { Button } from "../common/Button";
import api from "../../services/api";

interface Project {
  idType: string;
  Libelle: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
}

export const ProjectsManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projets/all");
        setProjects(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des projets");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const addProject = () => {
    setProjects([
      ...projects,
      {
        idType: Date.now().toString(),
        Libelle: "",
        Description: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  const removeProject = async (idType: string) => {
    try {
      await api.delete(`/projets/${idType}`);
      setProjects(projects.filter((p) => p.idType !== idType));
    } catch (err) {
      console.error("Erreur lors de la suppression du projet", err);
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await api.put(`/projets/${project.idType}`, project);
      setProjects(
        projects.map((p) => (p.idType === project.idType ? project : p))
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du projet", err);
    }
  };

  const handleUpdateClick = (project: Project) => {
    const updatedLibelle = prompt("Nom du projet:", project.Libelle);
    const updatedDescription = prompt(
      "Description du projet:",
      project.Description
    );

    if (updatedLibelle !== null && updatedDescription !== null) {
      updateProject({
        ...project,
        Libelle: updatedLibelle,
        Description: updatedDescription,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des projets
        </h1>
        <Button variant="primary" icon={Plus} onClick={addProject}>
          Ajouter un projet
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Nom
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.idType} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {project.Libelle}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {project.Description}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <button
                      type="button"
                      onClick={() => handleUpdateClick(project)}
                      className="text-blue-600 hover:text-blue-700 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProject(project.idType)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
