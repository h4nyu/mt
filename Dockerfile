FROM debian:bookworm-slim

ENV PATH=$PATH:/app/cli/bin:/app/node_modules/.bin
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nodejs \
        npm \
        python3-minimal \
        python3-pip \
        wget \
        unzip \
        wait-for-it \
     && npm install -g yarn \
     && ln -s /usr/bin/python3.11 /usr/bin/python \
     && rm /usr/lib/python3.11/EXTERNALLY-MANAGED

WORKDIR /script-server
RUN wget https://github.com/bugy/script-server/releases/download/1.17.1/script-server.zip \
    && unzip script-server.zip \
    && rm script-server.zip \
    && pip install -r requirements.txt

COPY notebook/requirements.txt /app/notebook/requirements.txt
COPY ml-board/requirements.txt /app/ml-board/requirements.txt
RUN pip install -r /app/notebook/requirements.txt \
    && pip install -r /app/ml-board/requirements.txt


WORKDIR /app
COPY . .
