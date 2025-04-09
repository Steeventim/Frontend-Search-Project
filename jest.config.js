module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Simule un DOM pour les tests
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"], // Fichier de configuration pour Jest
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Gérer les imports CSS
  },
};
