#!/usr/bin/env bash

echo -e "\033[32m \n> clearing build directory. \033[0m"
rm -rf ./build
mkdir build

echo -e "\033[32m \n> compile react. \033[0m"
node ./tasks/build/bootstrap.js

echo -e "\033[32m \n> compile node. \033[0m"
npm run compile_to_es5

echo -e "\033[32m \n> copy resource. \033[0m"
cp -r src/i5sing/main/views build/i5sing/main/views
cp src/package.json build/package.json
cp -r src/resources build/resources

echo -e "\033[32m \n> install dependencies. \033[0m"
cd build
npm install

echo -e "\033[32m \n> build. \033[0m"
cd ../
node ./tasks/release/bootstrap.js

echo -e "\033[32m \n> build success. \033[0m"