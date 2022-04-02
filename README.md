# Kaguya

A automated currency exchange system with machine learning

# Packages

| Packages                                  | Description  |
| :-                                        | :-           |
| **[kaguya](./kaguya_nn)**              | ML           |
| **[@kaguya/core](./packages/core)**       | domain       |
| **[@kaguya/web](./packages/web)**         | web frontend |
| **[@kaguya/server](./packages/server)**   | backend      |
| **[@kaguya/api](./packages/api)**         | client       |

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
