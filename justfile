
default:
    just --list

# Dependencies
install:
    npm install

install-online:
    npm install --offline=false

ci:
    npm ci

align:
    npm run align

# Expo development
start:
    npm run start

startc:
    npm run startc

android:
    npm run android

ios:
    npm run ios

web:
    npm run web

prebuild:
    npm run prebuild

prebuild-clean:
    npx expo prebuild --clean

doctor:
    npx expo-doctor

# Quality
typecheck:
    npm run typecheck

lint:
    npm run lint

format:
    npm run format

fix:
    npm run fix

check:
    npm run typecheck
    npm run lint

# UI and dependency helpers
shadcn:
    npm run shadcn

taze:
    npm run taze

# Build and deploy
export:
    npx expo export

serve:
    npx expo serve

static:
    npm run static

apk:
    npm run apk

ipa:
    npm run ipa

deploy:
    npm run deploy

testflight:
    npm run testflight

# Git helpers
status:
    git status --short

clear-git-cache:
    git rm --cached -r .

commit msg="update":
    git add .
    git commit -m "{{msg}}"

push branch="main":
    git push repo {{branch}}

save msg="update" branch="main":
    git add .
    git commit -m "{{msg}}"
    git push repo {{branch}}
