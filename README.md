# Kaguya

A automated currency exchange system with machine learning

# Packages

| Packages                       | Description  |
| :-                             | :-           |
| **[kaguya](./kaguya_nn)**      | ML           |
| **[@kaguya/core](./core)**     | Domain       |
| **[@kaguya/web](./web)**       | Web frontend |
| **[@kaguya/server](./server)** | Backend      |
| **[@kaguya/api](./api)**       | Client       |

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
