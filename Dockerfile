FROM debian:bookworm-slim

ENV PATH=$PATH:/app/cli/bin
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nodejs \
        npm \
        python3-minimal \
        python3-pip \
        wait-for-it \
     && npm install -g yarn \
     && rm /usr/lib/python3.11/EXTERNALLY-MANAGED

COPY notebook/requirements.txt /app/notebook/requirements.txt
RUN pip install -r /app/notebook/requirements.txt


WORKDIR /app
COPY . .
