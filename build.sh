#!/bin/sh
set -e

echo node version:
node --version
echo npm version
npm --version

# 启用安装
yarn
yarn lerna bootstrap

if [ $? -eq 0 ]; then
  echo install SUCCESS

  # npm run build
  yarn run build

  if [ $? -eq 0 ]; then
    echo build SUCCESS
    
    # copy 文件
    rm -rf ./packages/server/public
    cp -R ./packages/ui/dist ./packages/server/public
  else
    echo build FAILED
    exit 1
  fi
else
  echo install FAILED
  exit 1
fi