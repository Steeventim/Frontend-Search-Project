import React, { useState } from "react";
import { Card, CardContent } from "../common/Card";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import { TextArea } from "../common/form/TextArea";
import Select from "../common/form/Select"; // Assurez-vous d'avoir un composant Select
import {
  Plus,
  Trash2,
  Users,
  Settings,
  Building,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SetupWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [projects, setProjects] = useState<
    {
      Libelle: string;
      Description: string;
    }[]
  >([]);
  const [users, setUsers] = useState<
    {
      NomUser: string;
      PrenomUser: string;
      Email: string;
      Password: string;
      Telephone: string;
      IsActive: boolean;
      roleNames: string;
    }[]
  >([]);

  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [processSteps, setProcessSteps] = useState<
    {
      projectId: string;
      stepName: string;
      stepDescription: string;
      validation: string; // Assurez-vous que c'est une chaîne de caractères
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
  >([]); // Pour stocker les rôles

  const steps = [
    {
      title: "Configuration de l'entreprise",
      description: "Informations de base sur votre structure",
      icon: Building,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom de l'entreprise
            </label>
            <InputField
              placeholder="Ex: Ma Société SAS"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors({});
              }}
              onBlur={() =>
                !companyName &&
                setErrors((prev) => ({
                  ...prev,
                  companyName: "Le nom de l'entreprise est requis",
                }))
              }
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <TextArea
              placeholder="Description de votre entreprise"
              rows={4}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>
        </div>
      ),
      apiEndpoint: "/structures",
    },
    {
      title: "Projets",
      description: "Définissez les types de projets à gérer",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Types de projets</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setProjects([...projects, { Libelle: "", Description: "" }])
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Button>
          </div>
          {projects.map((project, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <InputField
                    value={project.Libelle}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].Libelle = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="Nom du projet"
                    required
                  />
                  <TextArea
                    value={project.Description}
                    onChange={(e) => {
                      const newProjects = [...projects];
                      newProjects[index].Description = e.target.value;
                      setProjects(newProjects);
                    }}
                    placeholder="Description du projet"
                    rows={2}
                  />
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  className="text-red-500"
                  onClick={() => {
                    const newProjects = projects.filter((_, i) => i !== index);
                    setProjects(newProjects);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ),
      apiEndpoint: "/projets",
    },
    {
      title: "Configuration des étapes de processus",

      description: "Définissez les étapes pour chaque type de projet",

      icon: Settings,

      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Étapes de processus</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setProcessSteps([
                  ...processSteps,
                  {
                    projectId: "", // Laissez vide pour une nouvelle étape
                    stepName: "",
                    stepDescription: "",
                    validation: "Validation par le chef de projet", // Valeur par défaut pour validation
                    id: Date.now(), // Ajout d'un identifiant unique pour chaque étape
                  },
                ])
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une étape
            </Button>
          </div>

          {projects.map((project, projectIndex) => (
            <div key={projectIndex} className="border rounded-lg p-4">
              <h4 className="font-medium">{project.Libelle}</h4>

              {processSteps
                .filter((step) => step.projectId === project.Libelle) // Lier les étapes au projet
                .map((step) => (
                  <div key={step.id} className="space-y-2">
                    {" "}
                    {/* Utilisation de l'id unique */}
                    <InputField
                      value={step.stepName}
                      onChange={(e) => {
                        const newSteps = processSteps.map((s) => {
                          if (s.id === step.id) {
                            // Vérification par id unique
                            return { ...s, stepName: e.target.value };
                          }
                          return s; // Retourne l'étape inchangée
                        });
                        setProcessSteps(newSteps);
                      }}
                      placeholder="Nom de l'étape"
                    />
                    <TextArea
                      value={step.stepDescription}
                      onChange={(e) => {
                        const newSteps = processSteps.map((s) => {
                          if (s.id === step.id) {
                            // Vérification par id unique
                            return { ...s, stepDescription: e.target.value };
                          }
                          return s; // Retourne l'étape inchangée
                        });
                        setProcessSteps(newSteps);
                      }}
                      placeholder="Description de l'étape"
                      rows={2}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        const newSteps = processSteps.filter(
                          (s) => s.id !== step.id // Suppression par id unique
                        );
                        setProcessSteps(newSteps);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setProcessSteps([
                    ...processSteps,
                    {
                      projectId: project.Libelle,
                      stepName: "",
                      stepDescription: "",
                      validation: "Validation par le chef de projet", // Valeur par défaut pour validation
                      id: Date.now(), // Ajout d'un identifiant unique pour chaque étape
                    },
                  ])
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une étape
              </Button>
            </div>
          ))}
        </div>
      ),

      apiEndpoint: "/etapes",
    },
    {
      title: "Rôles et permissions",
      description: "Définissez les rôles et leurs accès",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Rôles</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setRoles([
                  ...roles,
                  {
                    id: `role-${Date.now()}`,
                    name: "",
                    description: "",
                    isSystemRole: false,
                    etapeName: "",
                    permissions: [], // Initialiser avec un tableau vide
                  },
                ])
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un rôle
            </Button>
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <div className="space-y-4">
              {roles.map((role, index) => (
                <div key={role.id} className="p-4 border rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Nom du rôle
                        </label>
                        <InputField
                          value={role.name}
                          onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[index].name = e.target.value;
                            setRoles(newRoles);
                          }}
                          placeholder="Entrez le nom du rôle"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Description
                        </label>
                        <TextArea
                          value={role.description}
                          onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[index].description = e.target.value;
                            setRoles(newRoles);
                          }}
                          placeholder="Entrez la description du rôle"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">
                          Étape associée
                        </label>
                        <Select
                          value={role.etapeName}
                          onChange={(e) => {
                            const newRoles = [...roles];
                            newRoles[index].etapeName = e.target.value;
                            setRoles(newRoles);
                          }}
                          placeholder="Sélectionner une étape"
                        >
                          {processSteps.map((step) => (
                            <option key={step.stepName} value={step.stepName}>
                              {step.stepName}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        const newRoles = roles.filter((_, i) => i !== index);
                        setRoles(newRoles);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Permissions Section */}
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-2">Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["Valider", "Rechercher", "transferer", "Rejetter"].map(
                        (perm) => (
                          <div
                            key={perm}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={role.permissions.includes(perm)} // Vérifie si la permission est incluse
                              onChange={() => {
                                const newRoles = [...roles];
                                const permissions = newRoles[index].permissions;

                                if (permissions.includes(perm)) {
                                  // Si la permission est déjà incluse, la retirer
                                  newRoles[index].permissions =
                                    permissions.filter((p) => p !== perm);
                                } else {
                                  // Sinon, l'ajouter
                                  newRoles[index].permissions.push(perm);
                                }

                                setRoles(newRoles);
                              }}
                              className="rounded"
                            />
                            <label className="text-sm">{perm}</label>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      apiEndpoint: "/roles",
    },
    {
      title: "Utilisateurs",
      description: "Ajoutez les utilisateurs du système",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Utilisateurs</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setUsers([
                  ...users,
                  {
                    NomUser: "",
                    PrenomUser: "",
                    Email: "",
                    Password: "",
                    Telephone: "",
                    IsActive: true,
                    roleNames: "",
                  },
                ])
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
          {users.map((user, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  value={user.NomUser}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].NomUser = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Nom"
                />
                <InputField
                  value={user.PrenomUser}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].PrenomUser = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Prénom"
                />
                <InputField
                  value={user.Email}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].Email = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Email"
                  className="col-span-2"
                />
                <InputField
                  value={user.Password}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].Password = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Mot de passe"
                  type="password"
                />
                <InputField
                  value={user.Telephone}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].Telephone = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Téléphone"
                />
                <Select
                  value={user.roleNames}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].roleNames = e.target.value;
                    setUsers(newUsers);
                  }}
                  placeholder="Sélectionner un rôle"
                >
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="danger"
                  size="sm"
                  className="text-red-500"
                  onClick={() => {
                    const newUsers = users.filter((_, i) => i !== index);
                    setUsers(newUsers);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      ),
      apiEndpoint: "/users/register",
    },
  ];

  const handleNext = async () => {
    setLoading(true);
    setErrors({});
    try {
      const currentApiEndpoint = steps[currentStep].apiEndpoint;
      let dataToSave = {};

      switch (currentStep) {
        case 0: // Configuration de l'entreprise
          if (!companyName.trim()) {
            setErrors({ companyName: "Le nom de l'entreprise est requis" });
            return;
          }
          setErrors({});
          dataToSave = {
            NomStructure: companyName,
            DescriptionStructure: companyDescription,
          };
          break;

        case 1: // Projets
          if (projects.length === 0) {
            setErrors({ projects: "Au moins un projet doit être défini" });
            return;
          }

          // Vérifiez que chaque projet a un Libelle non vide
          for (const project of projects) {
            if (!project.Libelle.trim()) {
              throw new Error("Le Libelle est requis pour chaque projet");
            }
          }

          // Si le backend attend un seul projet, envoyez le premier projet
          dataToSave = {
            Libelle: projects[0].Libelle,
            Description: projects[0].Description,
          };

          console.log("Données des projets à envoyer:", dataToSave); // Debugging

          break;

        case 2: // étapes de processus
          if (processSteps.length === 0) {
            setErrors({
              processSteps: "Au moins une étape de processus doit être définie",
            });
            return;
          }

          // Validation des étapes de processus
          for (const step of processSteps) {
            if (!step.stepName.trim() || !step.projectId) {
              throw new Error(
                "Chaque étape doit avoir un nom et être associée à un projet."
              );
            }
          }
          // Préparer les données à envoyer
          dataToSave = processSteps.map((step) => ({
            LibelleEtape: step.stepName, // Changer Libelle en LibelleEtape
            Description: step.stepDescription,
            Validation: step.validation, // Assurez-vous que c'est une chaîne de caractères
            typeProjetLibelle: step.projectId, // Utiliser le projectId de l'étape
          }));
          break;

        case 3: {
          // Rôles et permissions

          if (roles.length === 0) {
            setErrors({ roles: "Au moins un rôle doit être défini" });
            return;
          }

          // Validate required fields
          const roleErrors = [];

          for (const [index, role] of roles.entries()) {
            if (!role.name.trim()) {
              roleErrors.push(`Le nom est requis pour le rôle #${index + 1}`);
            }

            if (!role.etapeName) {
              roleErrors.push(`L'étape est requise pour le rôle #${index + 1}`);
            }

            if (role.permissions.length === 0) {
              roleErrors.push(
                `Au moins une permission est requise pour le rôle #${index + 1}`
              );
            }
          }

          if (roleErrors.length > 0) {
            setErrors({ roles: roleErrors.join(", ") });
            return;
          }

          // Préparer les données à envoyer
          dataToSave = roles.map((role) => ({
            name: role.name,
            description: role.description,
            isSystemRole: role.isSystemRole,
            etapeName: role.etapeName,
            permissions: role.permissions,
          }));

          break;
        }

        case 4: {
          // Utilisateurs
          if (users.length === 0) {
            setErrors({ users: "Au moins un utilisateur doit être défini" });
            return;
          }

          // Validate required fields
          const userErrors = [];
          for (const [index, user] of users.entries()) {
            if (!user.NomUser.trim()) {
              userErrors.push(
                `Le nom est requis pour l'utilisateur #${index + 1}`
              );
            }
            if (!user.PrenomUser.trim()) {
              userErrors.push(
                `Le prénom est requis pour l'utilisateur #${index + 1}`
              );
            }
            if (!user.Email.trim()) {
              userErrors.push(
                `L'email est requis pour l'utilisateur #${index + 1}`
              );
            }
            if (!user.Password.trim()) {
              userErrors.push(
                `Le mot de passe est requis pour l'utilisateur #${index + 1}`
              );
            }
            if (!user.roleNames.trim()) {
              userErrors.push(
                `Un rôle doit être sélectionné pour l'utilisateur #${index + 1}`
              );
            }
          }

          if (userErrors.length > 0) {
            setErrors({ users: userErrors.join(", ") });
            return;
          }

          // Send all users instead of just the first one
          dataToSave = users.map((user) => ({
            NomUser: user.NomUser,
            PrenomUser: user.PrenomUser,
            Email: user.Email,
            Password: user.Password,
            Telephone: user.Telephone,
            IsActive: user.IsActive,
            roleNames: user.roleNames,
          }));

          break;
        }

        default:
          dataToSave = {};
      }

      // Envoi des données au backend
      console.log("Données à envoyer:", dataToSave); // Debugging
      const response = await api.post(currentApiEndpoint, dataToSave);
      if (!response.data) {
        throw new Error("No data received from backend");
      }

      if (!response.data) {
        throw new Error("Aucune donnée reçue du backend");
      }
      console.log("Réponse du serveur:", response.data); // Debugging
      console.log("Réponse du serveur:", response); // Debugging

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Send user data first
        // const firstUser = users[0];
        // const userData = {
        //   NomUser: firstUser.NomUser,
        //   PrenomUser: firstUser.PrenomUser,
        //   Email: firstUser.Email,
        //   Password: firstUser.Password,
        //   Telephone: firstUser.Telephone,
        //   IsActive: firstUser.IsActive,
        //   roleNames: firstUser.roleNames,
        // };

        // await api.post("/users/register", userData);

        // Then send complete setup data
        // await api.post("/setup/complete", {
        //   company: {
        //     NomStructure: companyName,
        //     DescriptionStructure: companyDescription,
        //   },
        //   projects,
        //   processSteps,
        //   users,
        // });

        // Redirect after all data is sent
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la configuration:", error);
      setErrors({
        general:
          "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between">
            {steps.map((_, index) => (
              <div key={index} className={`flex-1 ${index > 0 ? "ml-2" : ""}`}>
                <div
                  className={`h-2 rounded-full ${
                    index <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {steps[currentStep].content}

            <div className="mt-8 flex justify-between">
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Précédent
              </Button>
              <Button variant="primary" onClick={handleNext} disabled={loading}>
                {loading
                  ? "Chargement..."
                  : currentStep === steps.length - 1
                  ? "Terminer"
                  : "Suivant"}
              </Button>
            </div>
            <div className="flex justify-center mb-4">
              <Button
                variant="primary"
                onClick={() => navigate("/admin/dashboard")}
              >
                Aller au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
