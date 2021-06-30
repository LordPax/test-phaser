#!/bin/sh

if [ ! -d build ]; then
    echo "création du répertoire build"
    mkdir build
fi

npx tsc

echo "compilation terminer"