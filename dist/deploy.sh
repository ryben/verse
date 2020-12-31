#!/usr/bin/env sh
# abort on errors
set -e

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:ryben/verse.git master:gh-pages