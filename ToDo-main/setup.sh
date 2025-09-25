#!/bin/bash

# Script de configuration et lancement automatique du projet ToDo API
# Généré par BLACKBOXAI

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage des messages
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction de vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."

    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
        exit 1
    fi

    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé. Veuillez l'installer avec Node.js."
        exit 1
    fi

    # Vérifier la version de Node.js (minimum 16)
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        log_error "Node.js version 16 ou supérieure est requise. Version actuelle: $(node -v)"
        exit 1
    fi

    log_success "Prérequis vérifiés avec succès"
}

# Fonction d'installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances npm..."

    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi

    log_success "Dépendances installées"
}

# Fonction de configuration de la base de données
setup_database() {
    log_info "Configuration de la base de données..."

    # Générer le client Prisma
    log_info "Génération du client Prisma..."
    npx prisma generate

    # Appliquer les migrations
    log_info "Application des migrations Prisma..."
    npx prisma db push

    log_success "Base de données configurée"
}

# Fonction de peuplement des données de test
seed_database() {
    log_info "Peuplement de la base avec les données de test..."

    if [ -f "test_data_seed.js" ]; then
        npx tsx test_data_seed.js
        log_success "Données de test insérées"
    else
        log_warning "Fichier test_data_seed.js non trouvé, passage du peuplement"
    fi
}

# Fonction de démarrage du serveur
start_server() {
    log_info "Démarrage du serveur..."

    # Vérifier si le port 3000 est disponible
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "Le port 3000 est déjà utilisé. Arrêt du processus existant..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi

    log_success "Serveur prêt à démarrer"
    log_info "Lancement de l'application..."
    log_info "L'API sera accessible sur: http://localhost:3000"
    log_info ""
    log_info "Comptes de test disponibles:"
    log_info "  - alice.dupont@example.com / password123"
    log_info "  - jean.martin@example.com / password123 (ADMIN)"
    log_info "  - marie.leroy@example.com / password123"
    log_info "  - pierre.durand@example.com / password123"
    log_info "  - sophie.moreau@example.com / password123"
    log_info ""
    log_info "Appuyez sur Ctrl+C pour arrêter le serveur"
    log_info ""

    # Démarrer le serveur
    npm run dev
}

# Fonction d'affichage de l'aide
show_help() {
    echo "Script de configuration automatique du projet ToDo API"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Afficher cette aide"
    echo "  -s, --skip-seed    Passer le peuplement des données de test"
    echo "  -d, --dev      Démarrer en mode développement (défaut)"
    echo "  -p, --prod     Démarrer en mode production"
    echo ""
    echo "Exemples:"
    echo "  $0              # Configuration complète et démarrage"
    echo "  $0 --skip-seed  # Configuration sans données de test"
    echo "  $0 --help       # Afficher cette aide"
}

# Fonction principale
main() {
    local SKIP_SEED=false
    local MODE="dev"

    # Parser les arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -s|--skip-seed)
                SKIP_SEED=true
                shift
                ;;
            -d|--dev)
                MODE="dev"
                shift
                ;;
            -p|--prod)
                MODE="prod"
                shift
                ;;
            *)
                log_error "Option inconnue: $1"
                show_help
                exit 1
                ;;
        esac
    done

    echo ""
    echo "=========================================="
    echo "  🚀 Configuration du projet ToDo API"
    echo "=========================================="
    echo ""

    # Vérifier les prérequis
    check_prerequisites

    # Installer les dépendances
    install_dependencies

    # Configurer la base de données
    setup_database

    # Peupler la base (optionnel)
    if [ "$SKIP_SEED" = false ]; then
        seed_database
    else
        log_info "Peuplement des données de test ignoré (--skip-seed)"
    fi

    echo ""
    echo "=========================================="
    echo "  ✅ Configuration terminée avec succès!"
    echo "=========================================="
    echo ""

    # Démarrer le serveur
    start_server
}

# Gestion des signaux pour un arrêt propre
trap 'echo -e "\n${YELLOW}Arrêt du script...${NC}"; exit 0' INT TERM

# Lancer le script principal
main "$@"
