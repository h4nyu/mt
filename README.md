# Kaguya

A automated currency exchange system with machine learning

# Packages

| Packages                  | Description |
| :------------------------ | :---------- |
| **[@kgy/core](./core)**   | Domain      |
| **[@kgy/infra](./infra)** | Backend     |
| **[@kgy/api](./api)**     | Client      |
| **[@kgy/cli](./cli)**     | CLI         |

# Setup

1. Manually setup .env.

```
COMPOSE_FILE=docker-compose.yaml
COMPOSE_PROFILE=development

# see x-env section in docker-compose.yaml
```

2. Build local environment image

```
docker-compose build app
```

3. Install node dependecies

```
docker compose run --rm app yarn install
```

# Contributors

- soltia48
- tkgstrator
- h4nyu
