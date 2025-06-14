FROM node:20

RUN apt-get update && apt-get install -y cron

WORKDIR /app

COPY . .

RUN npm install

COPY crontab /etc/cron.d/jayspics-cron

RUN chmod 0644 /etc/cron.d/jayspics-cron

RUN crontab /etc/cron.d/jayspics-cron

RUN touch /var/log/cron.log

CMD cron && tail -f /var/log/cron.log