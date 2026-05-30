#!/bin/bash

# Build and Deploy Script for Pesquisa e Satisfação

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env file not found!"
        print_warning "Creating .env from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env with your configuration before running the script again."
        exit 1
    fi
    print_success ".env file found"
}

# Check Docker and Docker Compose installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    docker-compose -f docker-compose.prod.yml build --no-cache
    print_success "Images built successfully"
}

# Start services
start_services() {
    print_header "Starting Services"
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Services started"
}

# Check service health
check_health() {
    print_header "Checking Service Health"
    
    echo "Waiting for MySQL to be healthy..."
    docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h 127.0.0.1 -uroot -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) || sleep 10
    print_success "MySQL is healthy"
    
    echo "Waiting for Backend to be healthy..."
    for i in {1..30}; do
        if docker-compose -f docker-compose.prod.yml exec -T backend wget -q -O- http://127.0.0.1:3001/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
            break
        fi
        echo "Waiting... ($i/30)"
        sleep 2
    done
    
    echo "Waiting for Frontend to be healthy..."
    docker-compose -f docker-compose.prod.yml exec -T frontend wget -q --spider http://127.0.0.1:80/ || true
    print_success "Frontend is ready"
}

# Show URLs
show_urls() {
    print_header "Application URLs"
    echo -e "Frontend:  ${GREEN}http://localhost${NC}"
    echo -e "API:       ${GREEN}http://localhost/api${NC}"
    echo -e "Swagger:   ${GREEN}http://localhost/api/docs${NC} (if configured)"
}

# Show logs
show_logs() {
    print_header "Service Logs (last 20 lines)"
    docker-compose -f docker-compose.prod.yml logs --tail=20
}

# Cleanup function
cleanup() {
    print_warning "Cleaning up..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Cleanup complete"
}

# Main menu
show_menu() {
    echo ""
    echo "1. Build and Start (Full Setup)"
    echo "2. Start Services"
    echo "3. Stop Services"
    echo "4. View Logs"
    echo "5. Health Check"
    echo "6. Restart Services"
    echo "7. Database Backup"
    echo "8. Exit"
    echo ""
}

# Database backup function
backup_database() {
    print_header "Backup Database"
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u pesquisa -p$(grep MYSQL_PASSWORD .env | cut -d '=' -f2) pesquisa_satisfacao > "$backup_file"
    print_success "Database backed up to $backup_file"
}

# Main script logic
main() {
    check_env_file
    check_docker

    if [ $# -eq 0 ]; then
        # Interactive mode
        while true; do
            show_menu
            read -p "Choose an option (1-8): " choice
            
            case $choice in
                1)
                    build_images
                    start_services
                    check_health
                    show_urls
                    ;;
                2)
                    start_services
                    show_urls
                    ;;
                3)
                    cleanup
                    ;;
                4)
                    show_logs
                    ;;
                5)
                    check_health
                    ;;
                6)
                    print_header "Restarting Services"
                    docker-compose -f docker-compose.prod.yml restart
                    print_success "Services restarted"
                    ;;
                7)
                    backup_database
                    ;;
                8)
                    print_success "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option"
                    ;;
            esac
        done
    else
        # Command mode
        case $1 in
            build)
                build_images
                start_services
                check_health
                show_urls
                ;;
            start)
                start_services
                show_urls
                ;;
            stop)
                cleanup
                ;;
            logs)
                show_logs
                ;;
            health)
                check_health
                ;;
            restart)
                docker-compose -f docker-compose.prod.yml restart
                ;;
            backup)
                backup_database
                ;;
            *)
                echo "Usage: $0 {build|start|stop|logs|health|restart|backup}"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"
