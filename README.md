# Kaguya

A automated currency exchange system with machine learning

# Packages

| Packages                   | Description |
| :------------------------- | :---------- |
| **[@kgy/core](./core)**    | Domain      |
| **[@kgy/infra](./server)** | Backend     |
| **[@kgy/api](./api)**      | Client      |
| **[@kgy/cli](./cli)**      | CLI         |

# Setup

1. Manually setup .env.

```
# gpu
COMPOSE_FILE=docker-compose.yaml:docker-compose.gpu.yaml

# cpu
COMPOSE_FILE=docker-compose.yaml

# keys

# https://coin.z.com/jp/member/api
GMO_COIN_API_KEY=
GMO_COIN_SECRET_KEY=
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
