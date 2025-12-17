# include environment variables
-include .env
export

all: run

env-check:
	@if [ ! -f ".env" ]; then \
		echo "❌ .env not found!"; \
		echo "Please create .env file first"; \
		exit 1; \
	fi

certs-check:
	@if [ ! -d "backend/certs" ]; then \
	    mkdir -p backend/certs; \
		openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 -nodes \
            -keyout backend/certs/backend-key.pem \
            -out backend/certs/backend.pem \
            -subj "/CN=backend" \
            -addext "subjectAltName=DNS:backend,DNS:localhost,IP:127.0.0.1"; \
    fi

run-detach: env-check certs-check
	docker-compose -f docker-compose.yml up --build --detach
	docker ps

run: env-check certs-check
	docker-compose -f docker-compose.yml up --build
	docker ps

down:
	docker-compose -f docker-compose.yml down --remove-orphans

clean: down
	docker volume prune -f

fclean: clean
	docker system prune -f

re: clean all

logs:
	docker-compose -f docker-compose.yml logs

.PHONY: all env-check run-detach run down clean fclean re logs
