#!/bin/sh
check=$(cat src/package.json | jq -c '{name: .name , version: .version, org: .author, hubuser: "anujtech46"}')
echo $check
