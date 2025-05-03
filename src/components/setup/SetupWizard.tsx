import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../common/Card";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import { TextArea } from "../common/form/TextArea";
import Select from "../common/form/Select";
import Tooltip from "../common/Tooltip";
import Modal from "../common/Modal";
import {
  Plus,
  Trash2,
  Users,
  Settings,
  Building,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import api from "../../services/api";

// Hook personnalisé pour gérer les formulaires
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (field: keyof T, value: any) => {
    console.log(
      `handleChange called for ${String(field)} with value: ${value}`
    );
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = (
    validators: Partial<Record<keyof T, (value: any) => string>>
  ) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    Object.entries(validators).forEach(([field, validator]) => {
      const error = validator ? validator(values[field as keyof T]) : "";
      if (error) newErrors[field as keyof T] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, handleChange, validate, setValues, setErrors };
};

// Validateurs utilitaires
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email invalide";

const validatePassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  )
    ? ""
    : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial";

const validatePhone = (phone: string) =>
  phone
    ? /^\+?[\d\s-]{10,}$/.test(phone)
      ? ""
      : "Numéro de téléphone invalide"
    : "";

// Schéma de validation pour les données sauvegardées
const validateSavedProgress = (data: any) => {
  try {
    if (!data || typeof data !== "object") return false;
    const { currentStep, company, projects, processSteps, roles, users } = data;
    if (
      typeof currentStep !== "number" ||
      !company ||
      !Array.isArray(projects) ||
      !Array.isArray(processSteps) ||
      !Array.isArray(roles) ||
      !Array.isArray(users)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<
    "project" | "step" | "role" | "user" | null
  >(null);
  const [generalError, setGeneralError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // États pour chaque étape
  const companyForm = useForm({
    companyName: "",
    companyDescription: "",
  });
  const [projects, setProjects] = useState<
    { id: string; Libelle: string; Description: string }[]
  >([]);
  const [processSteps, setProcessSteps] = useState<
    {
      id: string;
      projectId: string;
      stepName: string;
      stepDescription: string;
      validation: string;
    }[]
  >([]);
  const [roles, setRoles] = useState<
    {
      id: string;
      name: string;
      description: string;
      isSystemRole: boolean;
      etapeName: string;
      permissions: string[];
    }[]
  >([]);
  const [users, setUsers] = useState<
    {
      id: string;
      NomUser: string;
      PrenomUser: string;
      Email: string;
      Telephone: string;
      IsActive: boolean;
      roleNames: string;
      tempPassword?: string;
    }[]
  >([]);

  // Charger les progrès sauvegardés depuis localStorage au montage
  useEffect(() => {
    const savedProgress = localStorage.getItem("setupWizardProgress");
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (validateSavedProgress(parsed)) {
          const { currentStep, company, projects, processSteps, roles, users } =
            parsed;
          setCurrentStep(currentStep);
          companyForm.setValues(company);
          setProjects(projects);
          setProcessSteps(processSteps);
          setRoles(roles);
          setUsers(users);
        } else {
          console.warn("Données sauvegardées invalides, ignorées.");
          localStorage.removeItem("setupWizardProgress");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des progrès:", error);
        localStorage.removeItem("setupWizardProgress");
      }
    }
  }, []);

  // Nettoyer localStorage après la fin du processus (facultatif)
  const clearProgress = () => {
    localStorage.removeItem("setupWizardProgress");
  };

  // Gestion de la suppression
  const handleDelete = (id: string) => {
    if (!deleteType) return;
    switch (deleteType) {
      case "project":
        setProjects(projects.filter((p) => p.id !== id));
        break;
      case "step":
        setProcessSteps(processSteps.filter((s) => s.id !== id));
        break;
      case "role":
        setRoles(roles.filter((r) => r.id !== id));
        break;
      case "user":
        setUsers(users.filter((u) => u.id !== id));
        break;
    }
    setShowDeleteModal(null);
    setDeleteType(null);
  };

  // Sauvegarde sécurisée (exclut tempPassword)
  const handleSaveAndExit = () => {
    const progressData = {
      currentStep,
      company: companyForm.values,
      projects,
      processSteps,
      roles,
      users: users.map(({ tempPassword, ...user }) => user), // Exclure tempPassword
    };
    try {
      localStorage.setItem("setupWizardProgress", JSON.stringify(progressData));
      navigate("/admin/dashboard");
    } catch (error) {
      setGeneralError("Erreur lors de la sauvegarde des progrès.");
      console.error(error);
    }
  };

  // Configuration des étapes
  const steps = [
    {
      title: "Configuration de l'entreprise",
      description: "Saisissez les informations de base de votre structure.",
      icon: Building,
      content: (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Entrez le nom légal et une brève description de votre entreprise.{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() =>
                alert("Aide : Utilisez le nom officiel de l'entreprise.")
              }
            >
              Besoin d'aide ?
            </button>
          </p>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom de l'entreprise <span className="text-red-500">*</span>
            </label>
            <InputField
              id="companyName"
              placeholder="Ex: Ma Société SAS"
              value={companyForm.values.companyName}
              onChange={(e) =>
                companyForm.handleChange("companyName", e.target.value)
              }
              aria-invalid={!!companyForm.errors.companyName}
              aria-describedby="companyName-error"
              ref={firstInputRef}
              required
            />
            {companyForm.errors.companyName && (
              <p id="companyName-error" className="text-red-500 text-sm mt-1">
                {companyForm.errors.companyName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="companyDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <TextArea
              id="companyDescription"
              placeholder="Description de votre entreprise"
              rows={4}
              value={companyForm.values.companyDescription}
              onChange={(e) =>
                companyForm.handleChange("companyDescription", e.target.value)
              }
            />
          </div>
        </div>
      ),
      apiEndpoint: "/structures",
      validate: () =>
        companyForm.validate({
          companyName: (value: string) =>
            value.trim() ? "" : "Le nom de l'entreprise est requis",
        }),
      formatData: () => ({
        NomStructure: companyForm.values.companyName,
        DescriptionStructure: companyForm.values.companyDescription,
      }),
    },
    {
      title: "Projets",
      description: "Définissez les types de projets que vous gérez.",
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Types de projets
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const newProject = {
                  id: uuidv4(),
                  Libelle: "",
                  Description: "",
                };
                setProjects([...projects, newProject]);
                setTimeout(() => firstInputRef.current?.focus(), 0);
              }}
              aria-label="Ajouter un projet"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Button>
          </div>
          <div className="space-y-4 divide-y divide-gray-200">
            {projects.map((project, index) => (
              <div key={project.id} className="pt-4">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    Projet {index + 1}{" "}
                    {project.Libelle && (
                      <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-2" />
                    )}
                  </h4>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div>
                        <label
                          htmlFor={`project-libelle-${project.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom du projet <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`project-libelle-${project.id}`}
                          value={project.Libelle}
                          onChange={(e) => {
                            console.log(
                              `Updating project ${project.id} Libelle to: ${e.target.value}`
                            );
                            const newProjects = [...projects];
                            newProjects[index] = {
                              ...newProjects[index],
                              Libelle: e.target.value,
                            };
                            setProjects(newProjects);
                          }}
                          placeholder="Nom du projet"
                          required
                          ref={
                            index === projects.length - 1 ? firstInputRef : null
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`project-description-${project.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <TextArea
                          id={`project-description-${project.id}`}
                          value={project.Description}
                          onChange={(e) => {
                            console.log(
                              `Updating project ${project.id} Description to: ${e.target.value}`
                            );
                            const newProjects = [...projects];
                            newProjects[index] = {
                              ...newProjects[index],
                              Description: e.target.value,
                            };
                            setProjects(newProjects);
                          }}
                          placeholder="Description du projet"
                          rows={2}
                        />
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setShowDeleteModal(project.id);
                        setDeleteType("project");
                      }}
                      aria-label="Supprimer le projet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      apiEndpoint: "/projets",
      validate: () => {
        if (projects.length === 0) return false;
        return projects.every((p) => p.Libelle.trim());
      },
      formatData: () => ({
        Libelle: projects[0].Libelle,
        Description: projects[0].Description,
      }),
    },
    {
      title: "Configuration des étapes de processus",
      description: "Définissez les étapes pour chaque type de projet.",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Étapes de processus
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const newStep = {
                  id: uuidv4(),
                  projectId: "",
                  stepName: "",
                  stepDescription: "",
                  validation: "Validation par le chef de projet",
                };
                setProcessSteps([...processSteps, newStep]);
                setTimeout(() => firstInputRef.current?.focus(), 0);
              }}
              aria-label="Ajouter une étape"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>
          <div className="space-y-4 divide-y divide-gray-200">
            {projects.map((project) => (
              <div key={project.id} className="pt-4">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    {project.Libelle}
                  </h4>
                  {processSteps
                    .filter((step) => step.projectId === project.Libelle)
                    .map((step) => (
                      <div key={step.id} className="space-y-4 mb-4">
                        <div>
                          <label
                            htmlFor={`step-name-${step.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nom de l'étape{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <InputField
                            id={`step-name-${step.id}`}
                            value={step.stepName}
                            onChange={(e) => {
                              console.log(
                                `Updating step ${step.id} stepName to: ${e.target.value}`
                              );
                              setProcessSteps(
                                processSteps.map((s) =>
                                  s.id === step.id
                                    ? { ...s, stepName: e.target.value }
                                    : s
                                )
                              );
                            }}
                            placeholder="Nom de l'étape"
                            required
                            ref={
                              step.id ===
                              processSteps[processSteps.length - 1]?.id
                                ? firstInputRef
                                : null
                            }
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`step-description-${step.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Description
                          </label>
                          <TextArea
                            id={`step-description-${step.id}`}
                            value={step.stepDescription}
                            onChange={(e) => {
                              console.log(
                                `Updating step ${step.id} stepDescription to: ${e.target.value}`
                              );
                              setProcessSteps(
                                processSteps.map((s) =>
                                  s.id === step.id
                                    ? { ...s, stepDescription: e.target.value }
                                    : s
                                )
                              );
                            }}
                            placeholder="Description de l'étape"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`step-validation-${step.id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Validation
                          </label>
                          <Select
                            id={`step-validation-${step.id}`}
                            value={step.validation}
                            onChange={(e) => {
                              console.log(
                                `Updating step ${step.id} validation to: ${e.target.value}`
                              );
                              setProcessSteps(
                                processSteps.map((s) =>
                                  s.id === step.id
                                    ? { ...s, validation: e.target.value }
                                    : s
                                )
                              );
                            }}
                          >
                            <option value="Validation par le chef de projet">
                              Chef de projet
                            </option>
                            <option value="Validation automatique">
                              Automatique
                            </option>
                            <option value="Validation manuelle">
                              Manuelle
                            </option>
                          </Select>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            setShowDeleteModal(step.id);
                            setDeleteType("step");
                          }}
                          aria-label="Supprimer l'étape"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const newStep = {
                        id: uuidv4(),
                        projectId: project.Libelle,
                        stepName: "",
                        stepDescription: "",
                        validation: "Validation par le chef de projet",
                      };
                      setProcessSteps([...processSteps, newStep]);
                      setTimeout(() => firstInputRef.current?.focus(), 0);
                    }}
                    aria-label={`Ajouter une étape pour ${project.Libelle}`}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une étape
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      apiEndpoint: "/etapes",
      validate: () => {
        if (processSteps.length === 0) return false;
        return processSteps.every((s) => s.stepName.trim() && s.projectId);
      },
      formatData: () =>
        processSteps.map((step) => ({
          LibelleEtape: step.stepName,
          Description: step.stepDescription,
          Validation: step.validation,
          typeProjetLibelle: step.projectId,
        })),
    },
    {
      title: "Rôles et permissions",
      description: "Définissez les rôles et leurs droits d'accès.",
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Rôles</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const newRole = {
                  id: uuidv4(),
                  name: "",
                  description: "",
                  isSystemRole: false,
                  etapeName: "",
                  permissions: [],
                };
                setRoles([...roles, newRole]);
                setTimeout(() => firstInputRef.current?.focus(), 0);
              }}
              aria-label="Ajouter un rôle"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un rôle
            </Button>
          </div>
          <div className="space-y-4 divide-y divide-gray-200">
            {roles.map((role, index) => (
              <div key={role.id} className="pt-4">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    Rôle {index + 1}{" "}
                    {role.name &&
                      role.etapeName &&
                      role.permissions.length > 0 && (
                        <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-2" />
                      )}
                  </h4>
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <div>
                        <label
                          htmlFor={`role-name-${role.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom du rôle <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`role-name-${role.id}`}
                          value={role.name}
                          onChange={(e) => {
                            console.log(
                              `Updating role ${role.id} name to: ${e.target.value}`
                            );
                            const newRoles = [...roles];
                            newRoles[index] = {
                              ...newRoles[index],
                              name: e.target.value,
                            };
                            setRoles(newRoles);
                          }}
                          placeholder="Entrez le nom du rôle"
                          required
                          ref={
                            index === roles.length - 1 ? firstInputRef : null
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`role-description-${role.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <TextArea
                          id={`role-description-${role.id}`}
                          value={role.description}
                          onChange={(e) => {
                            console.log(
                              `Updating role ${role.id} description to: ${e.target.value}`
                            );
                            const newRoles = [...roles];
                            newRoles[index] = {
                              ...newRoles[index],
                              description: e.target.value,
                            };
                            setRoles(newRoles);
                          }}
                          placeholder="Entrez la description du rôle"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`role-etape-${role.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Étape associée <span className="text-red-500">*</span>
                        </label>
                        <Select
                          id={`role-etape-${role.id}`}
                          value={role.etapeName}
                          onChange={(e) => {
                            console.log(
                              `Updating role ${role.id} etapeName to: ${e.target.value}`
                            );
                            const newRoles = [...roles];
                            newRoles[index] = {
                              ...newRoles[index],
                              etapeName: e.target.value,
                            };
                            setRoles(newRoles);
                          }}
                          placeholder="Sélectionner une étape"
                          required
                        >
                          {processSteps.map((step) => (
                            <option key={step.id} value={step.stepName}>
                              {step.stepName}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <h5
                          id={`permissions-label-${role.id}`}
                          className="text-sm font-medium text-gray-700 mb-2"
                        >
                          Permissions <span className="text-red-500">*</span>
                        </h5>
                        <p
                          id={`permissions-desc-${role.id}`}
                          className="text-sm text-gray-500 mb-2"
                        >
                          Sélectionnez les actions que ce rôle peut effectuer.
                        </p>
                        <div
                          className="grid grid-cols-1 md:grid-cols-2 gap-2"
                          aria-describedby={`permissions-desc-${role.id}`}
                        >
                          {[
                            "Valider",
                            "Rechercher",
                            "Transférer",
                            "Rejeter",
                          ].map((perm) => (
                            <Tooltip
                              key={perm}
                              content={`Permet de ${perm.toLowerCase()} les éléments.`}
                            >
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`perm-${role.id}-${perm}`}
                                  checked={role.permissions.includes(perm)}
                                  onChange={() =>
                                    handlePermissionChange(role.id, perm)
                                  }
                                  className="rounded"
                                />
                                <label
                                  htmlFor={`perm-${role.id}-${perm}`}
                                  className="text-sm"
                                >
                                  {perm}
                                </label>
                              </div>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setShowDeleteModal(role.id);
                        setDeleteType("role");
                      }}
                      aria-label="Supprimer le rôle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      apiEndpoint: "/roles",
      validate: () => {
        if (roles.length === 0) return false;
        return roles.every(
          (r) => r.name.trim() && r.etapeName && r.permissions.length > 0 // Vérifie que des permissions sont sélectionnées
        );
      },
      formatData: () =>
        roles.map((role) => ({
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
          etapeName: role.etapeName,
          permissions: role.permissions,
        })),
    },
    {
      title: "Utilisateurs",
      description: "Ajoutez les utilisateurs qui auront accès au système.",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Utilisateurs
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const newUser = {
                  id: uuidv4(),
                  NomUser: "",
                  PrenomUser: "",
                  Email: "",
                  Telephone: "",
                  IsActive: true,
                  roleNames: "",
                  tempPassword: "",
                };
                setUsers([...users, newUser]);
                setTimeout(() => firstInputRef.current?.focus(), 0);
              }}
              aria-label="Ajouter un utilisateur"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
          <div className="space-y-4 divide-y divide-gray-200">
            {users.map((user, index) => (
              <div key={user.id} className="pt-4">
                <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-6">
                  <h4 className="text-md font-semibold text-gray-700 mb-4">
                    Utilisateur {index + 1}{" "}
                    {user.NomUser &&
                      user.PrenomUser &&
                      user.Email &&
                      user.tempPassword &&
                      user.roleNames && (
                        <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-2" />
                      )}
                  </h4>
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-700">
                      Informations personnelles
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`user-nom-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`user-nom-${user.id}`}
                          value={user.NomUser}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} NomUser to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              NomUser: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Nom"
                          required
                          ref={
                            index === users.length - 1 ? firstInputRef : null
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`user-prenom-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Prénom <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`user-prenom-${user.id}`}
                          value={user.PrenomUser}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} PrenomUser to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              PrenomUser: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Prénom"
                          required
                        />
                      </div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-700">
                      Authentification
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`user-email-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`user-email-${user.id}`}
                          value={user.Email}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} Email to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              Email: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`user-password-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Mot de passe <span className="text-red-500">*</span>
                        </label>
                        <InputField
                          id={`user-password-${user.id}`}
                          value={user.tempPassword || ""}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} tempPassword to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              tempPassword: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Mot de passe"
                          type="password"
                          required
                        />
                      </div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-700">
                      Coordonnées et rôle
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`user-telephone-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Téléphone
                        </label>
                        <InputField
                          id={`user-telephone-${user.id}`}
                          value={user.Telephone}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} Telephone to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              Telephone: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Téléphone"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`user-role-${user.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Rôle <span className="text-red-500">*</span>
                        </label>
                        <Select
                          id={`user-role-${user.id}`}
                          value={user.roleNames}
                          onChange={(e) => {
                            console.log(
                              `Updating user ${user.id} roleNames to: ${e.target.value}`
                            );
                            const newUsers = [...users];
                            newUsers[index] = {
                              ...newUsers[index],
                              roleNames: e.target.value,
                            };
                            setUsers(newUsers);
                          }}
                          placeholder="Sélectionner un rôle"
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setShowDeleteModal(user.id);
                        setDeleteType("user");
                      }}
                      aria-label="Supprimer l'utilisateur"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      apiEndpoint: "/users/register",
      validate: () => {
        if (users.length === 0) return false;
        return users.every(
          (u) =>
            u.NomUser.trim() &&
            u.PrenomUser.trim() &&
            validateEmail(u.Email) === "" &&
            validatePassword(u.tempPassword || "") === "" &&
            validatePhone(u.Telephone) === "" &&
            u.roleNames.trim()
        );
      },
      formatData: () =>
        users.map((user) => ({
          NomUser: user.NomUser,
          PrenomUser: user.PrenomUser,
          Email: user.Email,
          Password: user.tempPassword,
          Telephone: user.Telephone,
          IsActive: user.IsActive,
          roleNames: user.roleNames,
        })),
    },
  ];

  const handleNext = async () => {
    setLoading(true);
    setGeneralError("");
    try {
      const step = steps[currentStep];
      if (!step.validate()) {
        setGeneralError(
          "Veuillez remplir tous les champs requis correctement."
        );
        return;
      }
      const dataToSave = step.formatData();
      await api.post(step.apiEndpoint, dataToSave);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => firstInputRef.current?.focus(), 0);
      } else {
        clearProgress(); // Nettoyer localStorage à la fin
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setGeneralError(
        (error as any)?.response?.data?.message ||
          "Une erreur est survenue lors de la sauvegarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  };

  const handlePermissionChange = (roleId: string, permission: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter((perm) => perm !== permission)
                : [...role.permissions, permission],
            }
          : role
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex-1 flex items-center justify-center md:justify-start"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center justify-center">
              {React.createElement(steps[currentStep].icon, {
                className: "w-6 h-6 text-blue-600 mr-2",
              })}
              {steps[currentStep].title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
            {generalError && (
              <p className="text-red-500 text-sm mt-4 text-center">
                {generalError}
              </p>
            )}
            <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
                aria-label="Étape précédente"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Précédent
              </Button>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={handleSaveAndExit}
                  aria-label="Enregistrer et quitter"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Enregistrer et quitter
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={loading}
                  aria-label={
                    currentStep === steps.length - 1
                      ? "Terminer"
                      : "Étape suivante"
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                      </svg>
                      Chargement...
                    </span>
                  ) : currentStep === steps.length - 1 ? (
                    "Terminer"
                  ) : (
                    "Suivant"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {showDeleteModal && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => {
            setShowDeleteModal(null);
            setDeleteType(null);
          }}
          onConfirm={() => handleDelete(showDeleteModal)}
        >
          Voulez-vous vraiment supprimer cet élément ?
        </Modal>
      )}
    </div>
  );
};

export default SetupWizard;
