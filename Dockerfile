FROM python:3.9-bullseye

ENV NVIDIA_VISIBLE_DEVICES=all \
    PATH=/usr/local/cuda/bin:/usr/local/nvidia/bin:/root/.local/bin:${PATH}:/app/node_modules/.bin \
    NVIDIA_DRIVER_CAPABILITIES=compute,utility \
    NVIDIA_REQUIRE_CUDA="cuda>=11.3" \
    CUDA_VERSION=11.3.0

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        nodejs \
        ca-certificates \
        unzip \
        wait-for-it \

COPY notebook/requirements.txt /app/notebook/requirements.txt
RUN pip install -r /app/notebook/requirements.txt


WORKDIR /app
COPY . .
