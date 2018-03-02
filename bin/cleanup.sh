#!/usr/bin/env bash

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--all)
        echo "Deleting database and node_modules..."
        rm -rf geekychat/
        rm -rf ../client/node_modules/
        rm -rf ../server/node_modules/
        shift # past argument
        ;;
        -n|--node-modules)
        echo "Deleting node_modules..."
        rm -rf ../client/node_modules/
        rm -rf ../server/node_modules/
        shift # past argument
        ;;
        -d|--database)
        echo "Deleting database..."
        rm -rf geekychat/
        shift # past argument
        ;;
        *)    # unknown option
        shift # past argument
        ;;
    esac
done

echo "All done !"
