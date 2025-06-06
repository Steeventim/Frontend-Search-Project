import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { TextArea } from "../common/form/TextArea";

export const NewProcess: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    templateId: "",
    title: "",
    description: "",
    priority: "normal",
  });

  const templates = [
    { id: "1", name: "Demande de congés" },
    { id: "2", name: "Note de frais" },
    { id: "3", name: "Demande d'achat" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement process creation
    navigate("/processes");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau processus</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Modèle de processus
            </label>
            <select
              value={formData.templateId}
              onChange={(e) =>
                setFormData({ ...formData, templateId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            >
              <option value="">Sélectionnez un modèle</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="low">Basse</option>
              <option value="normal">Normale</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/processes")}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" icon={Plus}>
              Créer le processus
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
