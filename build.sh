#!/bin/bash
PROJECT="being"
ICONGROUP="being.icns"

if [ ! $# == 1 ]; then
        echo "Usage: $0 <target>"
        exit
fi

if [[ "$1" != "osx" ]]; then
        echo "$1 is not a valid target"
        exit
fi

rm -rf build/targets/$1/*

echo "Building web app with Grunt..."
grunt $1

if [[ "$1" == "osx" ]]; then
        
        echo "Building OSX app..."
        cp -r build/resources/$1/ build/targets/$1/
        rm build/targets/$1/Info.plist.tpl
        mv build/targets/$1/app.nw build/targets/$1/node-webkit.app/Contents/Resources/app.nw
        mv build/targets/$1/node-webkit.app build/targets/$1/$PROJECT.app
        rm build/targets/$1/$PROJECT.app/Contents/Info.plist
        mv build/targets/$1/Info.plist build/targets/$1/$PROJECT.app/Contents
        mv build/targets/$1/$ICONGROUP build/targets/$1/$PROJECT.app/Contents/Resources

        rm build/targets/$1/package.json

fi

echo "All done!"
exit
