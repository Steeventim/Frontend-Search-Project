#!/bin/bash
echo "=== Vérification du linting ==="
echo "Exécution de npm run lint..."
timeout 30 npm run lint 2>&1 | head -50
echo "=== Fin de la vérification ==="
