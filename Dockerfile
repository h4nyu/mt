FROM python:3.9-bullseye

RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        nodejs \
        python3-minimal \
        python3-pip \
        wait-for-it \
     && npm install -g yarn

COPY notebook/requirements.txt /app/notebook/requirements.txt
RUN pip install -r /app/notebook/requirements.txt


WORKDIR /app
COPY . .
