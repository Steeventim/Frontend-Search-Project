import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Mail, User, Lock } from 'lucide-react';
import { InputField } from '../common/InputField';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    position: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    navigate('/setup');
  };

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Connexion */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white relative overflow-hidden">
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">Déjà inscrit ?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Connectez-vous pour accéder à votre espace et gérer vos processus d'entreprise.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-48 border-2 border-white text-white py-2 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Se connecter
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800"
            alt="Illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        </div>
      </div>

      {/* Section droite - Inscription */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Commencez à gérer vos processus d'entreprise
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <InputField
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                type="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <InputField
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <InputField
                icon={<Building className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Nom de l'entreprise"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Poste occupé"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Créer mon compte
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                En créant un compte, vous acceptez nos{' '}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  conditions d'utilisation
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};