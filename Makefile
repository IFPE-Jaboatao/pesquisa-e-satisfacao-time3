.PHONY: help build up down logs stop restart health backup shell seed build-prod logs-backend logs-frontend logs-mysql

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

help:
	@echo "$(BLUE)================================$(NC)"
	@echo "$(BLUE)Pesquisa e Satisfação - Docker$(NC)"
	@echo "$(BLUE)================================$(NC)"
	@echo ""
	@echo "$(GREEN)Build & Deploy:$(NC)"
	@echo "  make build              - Build images and start services (full setup)"
	@echo "  make up                 - Start services"
	@echo "  make down               - Stop and remove services"
	@echo "  make restart            - Restart all services"
	@echo ""
	@echo "$(GREEN)Logs & Monitoring:$(NC)"
	@echo "  make logs               - Show all service logs"
	@echo "  make logs-backend       - Show backend logs"
	@echo "  make logs-frontend      - Show frontend logs"
	@echo "  make logs-mysql         - Show MySQL logs"
	@echo "  make health             - Check service health"
	@echo ""
	@echo "$(GREEN)Database:$(NC)"
	@echo "  make backup             - Backup database"
	@echo "  make seed               - Run database seed"
	@echo ""
	@echo "$(GREEN)Shell Access:$(NC)"
	@echo "  make shell-backend      - Access backend shell"
	@echo "  make shell-mysql        - Access MySQL shell"
	@echo ""
	@echo "$(GREEN)Development:$(NC)"
	@echo "  make build-prod         - Build images for production"
	@echo ""

build: check-env
	@echo "$(BLUE)Building images and starting services...$(NC)"
	docker-compose -f docker-compose.prod.yml build --no-cache
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Services started!$(NC)"
	@echo "$(YELLOW)Waiting for services to be ready...$(NC)"
	@sleep 10
	@make health

up: check-env
	@echo "$(BLUE)Starting services...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Services started!$(NC)"

down:
	@echo "$(BLUE)Stopping services...$(NC)"
	docker-compose -f docker-compose.prod.yml down
	@echo "$(GREEN)✓ Services stopped!$(NC)"

stop: down

restart: check-env
	@echo "$(BLUE)Restarting services...$(NC)"
	docker-compose -f docker-compose.prod.yml restart
	@echo "$(GREEN)✓ Services restarted!$(NC)"

logs:
	docker-compose -f docker-compose.prod.yml logs -f

logs-backend:
	docker-compose -f docker-compose.prod.yml logs -f backend

logs-frontend:
	docker-compose -f docker-compose.prod.yml logs -f frontend

logs-mysql:
	docker-compose -f docker-compose.prod.yml logs -f mysql

health:
	@echo "$(BLUE)Checking service health...$(NC)"
	@docker-compose -f docker-compose.prod.yml ps
	@echo ""
	@echo "$(GREEN)Services status above$(NC)"

backup:
	@echo "$(BLUE)Backing up database...$(NC)"
	@docker-compose -f docker-compose.prod.yml exec -T mysql mysqladmin ping -h 127.0.0.1 -uroot || exit 1
	@docker-compose -f docker-compose.prod.yml exec -T mysql mysqldump -u pesquisa -p$$(grep MYSQL_PASSWORD .env | cut -d '=' -f2) pesquisa_satisfacao > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Database backed up!$(NC)"

seed: check-env
	@echo "$(BLUE)Running database seed...$(NC)"
	docker-compose -f docker-compose.prod.yml exec backend npm run seed
	@echo "$(GREEN)✓ Seed completed!$(NC)"

shell-backend: check-env
	docker-compose -f docker-compose.prod.yml exec backend sh

shell-mysql: check-env
	docker-compose -f docker-compose.prod.yml exec mysql bash

build-prod: check-env
	@echo "$(BLUE)Building production images...$(NC)"
	docker-compose -f docker-compose.prod.yml build --no-cache
	@echo "$(GREEN)✓ Images built!$(NC)"

check-env:
	@if [ ! -f .env ]; then \
		echo "$(RED)Error: .env file not found!$(NC)"; \
		echo "$(YELLOW)Creating .env from .env.example...$(NC)"; \
		cp .env.example .env; \
		echo "$(YELLOW)Please edit .env with your configuration:$(NC)"; \
		echo "  - Database passwords"; \
		echo "  - JWT_SECRET"; \
		echo "  - Frontend/Backend URLs"; \
		exit 1; \
	fi

check-docker:
	@if ! command -v docker &> /dev/null; then \
		echo "$(RED)Error: Docker is not installed$(NC)"; \
		exit 1; \
	fi
	@if ! command -v docker-compose &> /dev/null; then \
		echo "$(RED)Error: Docker Compose is not installed$(NC)"; \
		exit 1; \
	fi

ps:
	docker-compose -f docker-compose.prod.yml ps

clean: down
	@echo "$(BLUE)Cleaning up volumes...$(NC)"
	docker-compose -f docker-compose.prod.yml down -v
	@echo "$(GREEN)✓ Cleanup complete!$(NC)"

status: ps

version:
	@echo "Docker version:"
	@docker --version
	@echo ""
	@echo "Docker Compose version:"
	@docker-compose --version
