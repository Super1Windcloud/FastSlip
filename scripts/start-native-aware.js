#!/usr/bin/env node

const { createHash } = require("node:crypto");
const { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } = require("node:fs");
const { dirname, join, relative, sep } = require("node:path");
const { spawnSync } = require("node:child_process");

const root = process.cwd();
const statePath = join(root, ".expo", "native-fingerprint.json");

const watchedFiles = [
  "app.config.js",
  "app.config.ts",
  "app.config.mjs",
  "app.config.cjs",
  "app.json",
  "eas.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

const watchedDirs = ["android", "ios", "patches"];
const ignoredDirNames = new Set([
  ".cxx",
  ".gradle",
  ".idea",
  "Pods",
  "build",
  "DerivedData",
  "xcuserdata",
]);

function readPackageNativeFields() {
  const packageJsonPath = join(root, "package.json");
  if (!existsSync(packageJsonPath)) {
    return "";
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  return JSON.stringify({
    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
    overrides: packageJson.overrides ?? {},
    resolutions: packageJson.resolutions ?? {},
    expo: packageJson.expo ?? {},
  });
}

function shouldIgnoreDirectory(path) {
  return path
    .split(sep)
    .some((part) => ignoredDirNames.has(part) || part.endsWith(".xcarchive") || part.endsWith(".xcworkspace"));
}

function walkFiles(dir) {
  if (!existsSync(dir) || shouldIgnoreDirectory(relative(root, dir))) {
    return [];
  }

  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      const relativePath = relative(root, path);
      const stat = statSync(path);

      if (stat.isDirectory()) {
        return shouldIgnoreDirectory(relativePath) ? [] : walkFiles(path);
      }

      return stat.isFile() ? [path] : [];
    })
    .sort();
}

function updateHashWithFile(hash, path) {
  hash.update(`file:${relative(root, path)}\0`);
  hash.update(readFileSync(path));
  hash.update("\0");
}

function nativeFingerprint() {
  const hash = createHash("sha256");
  hash.update(`package-native-fields:${readPackageNativeFields()}\0`);

  for (const file of watchedFiles) {
    const path = join(root, file);
    if (existsSync(path)) {
      updateHashWithFile(hash, path);
    }
  }

  for (const dir of watchedDirs) {
    for (const file of walkFiles(join(root, dir))) {
      updateHashWithFile(hash, file);
    }
  }

  return hash.digest("hex");
}

function readPreviousFingerprint() {
  if (!existsSync(statePath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(statePath, "utf8")).fingerprint ?? null;
  } catch {
    return null;
  }
}

function writeFingerprint(fingerprint) {
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(
    statePath,
    `${JSON.stringify(
      {
        fingerprint,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
  );
}

function nodeBin(command) {
  return process.platform === "win32" ? join(dirname(process.execPath), `${command}.cmd`) : command;
}

function runNativeScript(script) {
  const scriptPath = join(root, "scripts", `run-${script}-device.js`);
  return spawnSync(process.execPath, [scriptPath], { stdio: "inherit" });
}

function runExpo(args) {
  return spawnSync(process.execPath, [join(root, "node_modules", "expo", "bin", "cli"), ...args], { stdio: "inherit" });
}

const fingerprint = nativeFingerprint();
const previousFingerprint = readPreviousFingerprint();
const shouldRebuildNative = process.env.FORCE_NATIVE_BUILD === "1" || previousFingerprint !== fingerprint;

if (shouldRebuildNative) {
  const nativeScript = process.env.NATIVE_BUILD_PLATFORM === "android" || process.platform === "win32" ? "android" : "ios";
  const nativeCommand = `node scripts/run-${nativeScript}-device.js`;
  console.log(
    previousFingerprint
      ? `Native inputs changed. Running \`${nativeCommand}\` before starting Metro.`
      : `No native baseline found. Running \`${nativeCommand}\` once before starting Metro.`,
  );

  const result = runNativeScript(nativeScript);
  if (result.status === 0) {
    writeFingerprint(fingerprint);
  }
  process.exit(result.status ?? 1);
}

const result = runExpo(["start", "--dev-client"]);
process.exit(result.status ?? 1);
