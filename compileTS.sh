#!/bin/sh

if [ ! -d build ]; then
    echo "création du répertoire build"
    mkdir build
fi

if ! npx tsc; then
    echo "quelque chose s'est mal passer sur la compilation"
    exit 1
fi

if ! npx parcel build views/index.html --no-source-maps --dist-dir dist; then
    echo "quelque chose s'est mal passer sur l'assemblage"
    exit 1
fi

if [ ! -d dist/assets ]; then
    echo "création du lien sur assets"
    ln -s $(pwd)/assets $(pwd)/dist/assets
fi

echo "compilation terminer"