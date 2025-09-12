import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../common/Card";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import { TextArea } from "../common/form/TextArea";
import Select from "../common/form/Select";
import Tooltip from "../common/Tooltip";
import Modal from "../common/Modal";
import Logo from "../common/Logo";
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
const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
  type K = keyof T;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<K, string>>>({});

  // Strongly typed change handler: the value must match the field's type
  const handleChange = React.useCallback(<P extends K>(field: P, value: T[P]) => {
    setValues((prev) => ({ ...prev, [field]: value } as T));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  // Validators map: each validator receives the typed value for its field
  const validate = React.useCallback((validators: Partial<{ [P in K]: (value: T[P]) => string }>) => {
    const newErrors: Partial<Record<K, string>> = {};
    (Object.keys(validators) as K[]).forEach((field) => {
      const validator = validators[field];
      if (!validator) return;
      const error = validator(values[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  const setFormValues = React.useCallback((newValues: T) => {
    setValues(newValues);
  }, []);

  const setFormErrors = React.useCallback((newErrors: Partial<Record<K, string>>) => {
    setErrors(newErrors);
  }, []);

  return {
    values,
    errors,
    handleChange,
    validate,
    setValues: setFormValues,
    setErrors: setFormErrors,
  };
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
const validateSavedProgress = (data: unknown) => {
  try {
    if (!data || typeof data !== "object") return false;
    const typedData = data as Record<string, unknown>;
    const { currentStep, company, projects, processSteps, roles, users } =
      typedData;
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
    structureId: "", // Add structureId to store the ID returned from the API
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
  const initialized = React.useRef(false);
  const { setValues } = companyForm; // Destructure setValues to use in dependency array

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedProgress = localStorage.getItem("setupWizardProgress");
    if (!savedProgress) return;

    try {
      const parsed = JSON.parse(savedProgress);
      if (!validateSavedProgress(parsed)) {
        console.warn("Données sauvegardées invalides, ignorées.");
        localStorage.removeItem("setupWizardProgress");
        return;
      }

      const { currentStep, company, projects: savedProjects, processSteps: savedSteps, roles: savedRoles, users: savedUsers } = parsed;

      // Update all states in a batch to prevent unnecessary re-renders
      setCurrentStep(currentStep);
      setProjects(savedProjects);
      setProcessSteps(savedSteps);
      setRoles(savedRoles);
      setUsers(savedUsers);
      setValues(company);
    } catch (error) {
      console.error("Erreur lors du chargement des progrès:", error);
      localStorage.removeItem("setupWizardProgress");
    }
  }, [setValues]); // Only depend on the memoized setValues function

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
              className="text-green-600 hover:underline"
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
      formatData: () => {
        const data: { NomStructure: string; DescriptionStructure: string } = {
          NomStructure: companyForm.values.companyName,
          DescriptionStructure: companyForm.values.companyDescription,
        };
        return data;
      },
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
              className="bg-green-100 text-green-700 hover:bg-green-200"
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
        // Ensure we have the structureId from the created structure
        if (!companyForm.values.structureId) {
          // Log for debugging what we have in the form
          console.error('Projects validation failed: missing structureId', {
            companyValues: companyForm.values,
            projects,
          });
          setGeneralError("L'ID de la structure n'est pas disponible. Veuillez revenir à la première étape et créer la structure avant d'ajouter des projets.");
          return false;
        }

        const missing = projects.find((p) => !p.Libelle || !p.Libelle.trim());
        if (missing) {
          setGeneralError("Chaque projet doit avoir un nom (Libellé). Veuillez compléter tous les noms de projet.");
          return false;
        }

        return true;
      },
      formatData: () => {
        // Send an array of projects, each with the structureId
        const data: Array<{ Libelle: string; Description: string; structureId: string }> = 
          projects.map((project) => ({
            Libelle: project.Libelle,
            Description: project.Description,
            structureId: companyForm.values.structureId,
          }));
        return data;
      },
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
                // Do not allow creating a step without an associated project.
                if (!projects || projects.length === 0) {
                  setGeneralError("Ajoutez d'abord au moins un projet avant d'ajouter des étapes.");
                  return;
                }
                const defaultProjectLibelle = projects[0].Libelle || "";
                const newStep = {
                  id: uuidv4(),
                  projectId: defaultProjectLibelle,
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
                              const newValue = e.target.value;
                              console.log(
                                `Updating step ${step.id} stepName to: ${newValue}`
                              );
                              // Remove empty steps when user clears the name
                              if (!newValue.trim()) {
                                setProcessSteps(processSteps.filter(s => s.id !== step.id));
                              } else {
                                setProcessSteps(
                                  processSteps.map((s) =>
                                    s.id === step.id
                                      ? { ...s, stepName: newValue }
                                      : s
                                  )
                                );
                              }
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
        // First, filter out any empty steps to avoid validation errors
        const filledSteps = processSteps.filter((s) => {
          const hasName = !!s.stepName && !!s.stepName.toString().trim();
          const hasProject = !!s.projectId && projects.some((p) => p.Libelle === s.projectId);
          return hasName && hasProject;
        });

        // Update the steps list to remove empty ones
        if (filledSteps.length !== processSteps.length) {
          setProcessSteps(filledSteps);
        }

        if (filledSteps.length === 0) {
          setGeneralError("Ajoutez au moins une étape avec un nom et un projet associé pour continuer.");
          return false;
        }
        return true;
      },
      formatData: () => {
        // Filter out any invalid steps before sending to API
        const validSteps = processSteps.filter(step => 
          step.stepName && 
          step.stepName.trim() && 
          step.projectId && 
          step.projectId.trim() &&
          projects.some(p => p.Libelle === step.projectId)
        );
        
        return validSteps.map((step) => ({
          LibelleEtape: step.stepName.trim(),
          Description: step.stepDescription || "",
          Validation: step.validation,
          typeProjetLibelle: step.projectId,
        }));
      },
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
      formatData: () => {
        const data: Array<{
          name: string;
          description: string;
          isSystemRole: boolean;
          etapeName: string;
          permissions: string[];
          structureId: string;
        }> = roles.map((role) => ({
          name: role.name,
          description: role.description,
          isSystemRole: role.isSystemRole,
          etapeName: role.etapeName,
          permissions: role.permissions,
          structureId: companyForm.values.structureId,
        }));
        return data;
      },
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
        if (users.length === 0) {
          setGeneralError("Veuillez ajouter au moins un utilisateur.");
          return false;
        }

        for (const user of users) {
          if (!user.NomUser?.trim()) {
            setGeneralError("Le nom de l'utilisateur est requis.");
            return false;
          }
          if (!user.PrenomUser?.trim()) {
            setGeneralError("Le prénom de l'utilisateur est requis.");
            return false;
          }
          if (validateEmail(user.Email) !== "") {
            setGeneralError("L'adresse email n'est pas valide.");
            return false;
          }
          if (!user.tempPassword || validatePassword(user.tempPassword) !== "") {
            setGeneralError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return false;
          }
          if (user.Telephone && validatePhone(user.Telephone) !== "") {
            setGeneralError("Le numéro de téléphone n'est pas valide.");
            return false;
          }
          if (!user.roleNames?.trim()) {
            setGeneralError("Veuillez sélectionner un rôle pour l'utilisateur.");
            return false;
          }
        }

        return true;
      },
      formatData: () => {
        // Log the data being sent for debugging
        console.log('Formatting user data for API:', users);
        
        const data = users.map((user) => {
          const formattedUser = {
            NomUser: user.NomUser.trim(),
            PrenomUser: user.PrenomUser.trim(), // Fixed: PrenomUser is the correct field name
            Email: user.Email.trim(),
            Password: user.tempPassword || '',
            Telephone: user.Telephone || '',
            IsActive: true,
            roleNames: [user.roleNames.trim()], // Send as array of role names
          };
          console.log('Formatted user data to send:', {
            ...formattedUser,
            Password: formattedUser.Password ? '****' : '<empty>',
            roleNames: formattedUser.roleNames
          });
          return formattedUser;
        });

        // Debug log entire payload
        console.log('Complete user registration payload:', 
          data.map(u => ({...u, Password: '****'}))
        );

        return data;
      },
    },
  ];

  const handleNext = async () => {
    setLoading(true);
    setGeneralError("");
  // Debug: log current wizard state when attempting to go to next step
  // This helps diagnose why validation reports empty fields
  console.log('handleNext: currentStep=', currentStep, 'title=', steps[currentStep]?.title, {
      companyValues: companyForm.values,
      projects,
      processSteps,
      roles,
      users,
    });
    try {
      const step = steps[currentStep];
      if (!step.validate()) {
        // If the step validator already set a specific error message, keep it.
        // Otherwise fall back to a generic message.
        setGeneralError((prev) =>
          prev && prev.length > 0
            ? prev
            : "Veuillez remplir tous les champs requis correctement."
        );
        setLoading(false);
        return;
      }

      const handleApiCall = async (endpoint: string, data: unknown) => {
        if (Array.isArray(data)) {
          // Handle array of items (like projects, roles, users)
          for (const item of data) {
            await api.post(endpoint, item);
          }
          return null;
        } else {
          // Handle single object (like structure)
          return await api.post(endpoint, data);
        }
      };

      const dataToSave = step.formatData();

      // Special handling for structure creation
      if (step.apiEndpoint === "/structures") {
        const response = await handleApiCall(step.apiEndpoint, dataToSave);
        if (response?.data) {
          const structureId = response.data.idStructure; // Changed from id to idStructure
          console.log("API Response:", response.data);
          if (structureId) {
            companyForm.handleChange("structureId", structureId);
            console.log("Structure ID saved:", structureId);
          } else {
            console.error("Response data:", response.data);
            throw new Error("ID de structure non trouvé dans la réponse");
          }
        } else {
          console.error("Response:", response);
          throw new Error("Réponse API invalide lors de la création de la structure");
        }
      } 
      // Special handling for projects
      else if (step.apiEndpoint === "/projets") {
        if (!companyForm.values.structureId) {
          throw new Error("ID de structure manquant pour la création des projets");
        }
        await handleApiCall(step.apiEndpoint, dataToSave);
      }
      // Default handling for other steps
      else {
        await handleApiCall(step.apiEndpoint, dataToSave);
      }
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => firstInputRef.current?.focus(), 0);
      } else {
        clearProgress(); // Nettoyer localStorage à la fin
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = "Une erreur est survenue lors de la sauvegarde.";
      
      if (error instanceof Error) {
        if ("response" in error && error.response) {
          const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
          errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error ||
                        error.message ||
                        errorMessage;
        } else {
          errorMessage = error.message;
        }
      }

      setGeneralError(errorMessage);
      console.error('Formatted error message:', errorMessage);
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
      prevRoles.map((role) => {
        if (role.id !== roleId) return role;
        const has = role.permissions.includes(permission);
        const newPermissions = has
          ? role.permissions.filter((perm) => perm !== permission)
          : [...role.permissions, permission];
  // Debug logging to trace checkbox events and resulting permissions
  // This helps confirm the handler is called and state is updated
  // (remove or lower verbosity in production)
  console.log(`Toggling permission '${permission}' for role '${roleId}'. before:`, role.permissions, 'after:', newPermissions);
        return {
          ...role,
          permissions: newPermissions,
        };
      })
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header avec Logo */}
        <div className="text-center space-y-4">
          <Logo
            variant="auth"
            size="xl"
            customText="SearchEngine - Configuration"
            noLink={true}
          />
          {/* Visible debug: show structureId if present to confirm creation */}
          {companyForm.values.structureId ? (
            <p className="text-sm text-green-700">ID structure: {companyForm.values.structureId.substring(0, 8)}...</p>
          ) : (
            <p className="text-sm text-gray-500">ID structure: (non créé)</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Assistant de Configuration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configurez votre système de gestion des processus en 5 étapes
            simples. Vous pouvez sauvegarder et reprendre à tout moment.
          </p>
        </div>

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
                      ? "bg-green-600 text-white"
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
                className: "w-6 h-6 text-green-600 mr-2",
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
                  className="bg-green-600 hover:bg-green-700 text-white px-6"
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
