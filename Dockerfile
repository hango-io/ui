FROM harbor.cloud.netease.com/qztest/pm2:10-alpin
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn

# Bundle APP files
RUN mkdir -p /home/project
COPY . /home/project

WORKDIR /home/project

ENTRYPOINT [ "pm2-runtime", "start", "apps.config.js"]
