#!/bin/bash

echo "🚀 Déploiement de NEBULA MINE sur Ubuntu..."

# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker si nécessaire
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Installation de Docker Compose
sudo apt install docker-compose -y

# Cloner le dépôt (si pas déjà fait)
if [ ! -d "nebula-mine" ]; then
    git clone https://github.com/votre-compte/nebula-mine.git
    cd nebula-mine
fi

# Créer le fichier .env
cat > .env << EOF
MONGO_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=votre_clé_stripe
FRONTEND_URL=http://localhost:3000
EOF

# Lancer les conteneurs
docker-compose up -d --build

echo "✅ NEBULA MINE est déployé !"
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
