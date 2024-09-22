#!/bin/bash

cd "$(dirname "$0")"

mv ../../package/README.md ../../package/README-original.md
cp -f ../../README.md ../../package/README.md