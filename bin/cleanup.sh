#!/usr/bin/env bash

clientPkg="client/node_modules/"
serverPkg="server/node_modules/"
db="server/geekychat"

while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -a|--all)
        echo "Deleting database and node_modules..."
        rm -rf "$db"
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
        rm -rf "$db"
        shift # past argument
        ;;
        *)    # unknown option
        shift # past argument
        ;;
    esac
done

echo
echo "All done !"
