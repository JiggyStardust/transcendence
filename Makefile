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

run-detach: env-check
	docker-compose -f docker-compose.yml up --build --detach
	docker ps

run: env-check
	docker-compose -f docker-compose.yml up --build
	docker ps

down:
	docker-compose -f docker-compose.yml down --remove-orphans

clean: down
	docker volume prune -f

fclean: clean
	docker system prune -f
	rm -rf .env backend/database/data/database.db

re: clean all

logs:
	docker-compose -f docker-compose.yml logs

.PHONY: all env-check run-detach run down clean fclean re logs
