#!/usr/bin/env bash
pwd

echo -e "\033[32m \n> clearing dist directory. \033[0m"
rm -rf ./dist
mkdir ./dist

echo -e "\033[32m \n> copying dist directory. \033[0m"
cp ./app/index.js ./dist/index.js

cp ./package.json ./dist/package.json

cp -r ./app/ ./dist/

mkdir ./dist/node_modules
cp -r ./node_modules/sqlite3 ./dist/node_modules/sqlite3

rm -rf ./dist/render

echo -e "\033[32m \n> installing dependencies. \033[0m"
cd dist/
npm install --production

echo -e "\033[32m \n> compiling .... \033[0m"
cd ..
node ./build/build.js

echo -e "\033[32m \n> build success. \033[0m"