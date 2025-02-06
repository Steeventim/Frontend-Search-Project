import React, { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "../../common/Button";
import api from "../../../services/api";
import type { Project } from "../../../types/setup";

interface ProjectSetupProps {
  onUpdate: (projects: Project[]) => void;
}

export const ProjectSetup: React.FC<ProjectSetupProps> = ({ onUpdate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addProject = async () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
    };

    try {
      const response = await api.post("/projets", newProject);
      const updatedProjects = [...projects, response.data];
      setProjects(updatedProjects);
      onUpdate(updatedProjects);
    } catch {
      setError("Failed to add project");
    }
  };

  const updateProject = async (
    index: number,
    key: keyof Project,
    value: string
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };

    try {
      await api.put(
        `/projects/${updatedProjects[index].id}`,
        updatedProjects[index]
      );
      setProjects(updatedProjects);
      onUpdate(updatedProjects);
    } catch {
      setError("Failed to update project");
    }
  };

  const removeProject = async (index: number) => {
    const projectId = projects[index].id;
    const updatedProjects = projects.filter((_, i) => i !== index);

    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(updatedProjects);
      onUpdate(updatedProjects);
    } catch {
      setError("Failed to remove project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Projets</h3>
        </div>
        <Button variant="secondary" size="sm" icon={Plus} onClick={addProject}>
          Ajouter un projet
        </Button>
      </div>
      {projects.map((project, index) => (
        <div key={project.id} className="mb-4 p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Nom du projet"
              value={project.name}
              onChange={(e) => updateProject(index, "name", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
          </div>
          <div className="flex items-center mb-2">
            <textarea
              placeholder="Description"
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
              className="mr-2 p-2 border rounded w-full"
              rows={4}
            />
          </div>
          <Button
            onClick={() => removeProject(index)}
            className="bg-red-500 text-white"
          >
            <Trash2 className="mr-2" /> Supprimer
          </Button>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
