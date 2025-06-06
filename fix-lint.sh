#!/bin/bash

# Script de correction automatique des erreurs de linting

echo "🔧 Correction des erreurs de linting..."

# Supprimer les imports non utilisés et les variables non utilisées
find src -name "*.tsx" -o -name "*.ts" | while read file; do
    # Commenter les variables non utilisées
    sed -i 's/const stats = /\/\/ const stats = /' "$file"
    sed -i 's/const \([^=]*\) = .*;\s*\/\/ unused/\/\/ const \1 = ...;/' "$file"
    
    # Supprimer les imports non utilisés (exemples courants)
    sed -i '/import.*Building.*from/s/Building, //' "$file"
    sed -i '/import.*Building.*from/s/, Building//' "$file"
    sed -i '/import.*FileText.*from/s/FileText, //' "$file"
    sed -i '/import.*Save.*from/s/Save, //' "$file"
    sed -i '/import.*SettingsIcon.*from/s/SettingsIcon, //' "$file"
done

echo "✅ Correction terminée!"
