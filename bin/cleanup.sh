#!/usr/bin/env bash

clientPkg="client/node_modules/"
serverPkg="server/node_modules/"

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--all)
        echo "Deleting database and node_modules..."
        rm -rf geekychat/
        rm -rf "$clientPkg"
        rm -rf "$serverPkg"
        shift # past argument
        ;;
        -p|--packages)
        echo "Deleting node_modules..."
        rm -rf "$clientPkg"
        rm -rf "$serverPkg"
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

echo
echo "All done !"
