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
	@if [ ! -d "./gateway/certs" ]; then \
		echo "Creating self-signed HTTPS certificates for '${DOMAIN_NAME}'"; \
		mkdir -p ./gateway/certs || exit 1; \
		openssl req -x509 -newkey rsa:2048 -nodes \
            -keyout ./gateway/certs/localhost-key.pem \
            -out ./gateway/certs/localhost.pem \
            -days 365 -subj "/CN=${DOMAIN_NAME}"; \
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

.PHONY: all env-check certs-check run-detach run down clean fclean re logs
