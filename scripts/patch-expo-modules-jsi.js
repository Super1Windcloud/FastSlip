#!/usr/bin/env node

const { existsSync, readFileSync, readdirSync, statSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const sourcesDir = join(
  process.cwd(),
  "node_modules",
  "expo-modules-jsi",
  "apple",
  "Sources",
  "ExpoModulesJSI",
);
const packageManifest = join(process.cwd(), "node_modules", "expo-modules-jsi", "apple", "Package.swift");

if (!existsSync(sourcesDir) || !existsSync(packageManifest)) {
  process.exit(0);
}

function swiftFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      return swiftFiles(path);
    }
    return path.endsWith(".swift") ? [path] : [];
  });
}

let patched = 0;

const manifestSource = readFileSync(packageManifest, "utf8");
const manifestNext = manifestSource.replace("swiftLanguageModes: [.v5]", "swiftLanguageModes: [.v6]");
if (manifestNext !== manifestSource) {
  writeFileSync(packageManifest, manifestNext);
  patched += 1;
}

for (const file of swiftFiles(sourcesDir)) {
  const source = readFileSync(file, "utf8");
  const next = source
    .replace(/\bweak let runtime:/g, "weak var runtime:")
    .replace("internal final class HostFunctionContext: Sendable {", "internal final class HostFunctionContext: @unchecked Sendable {")
    .replace("internal final class HostObjectContext: Sendable {", "internal final class HostObjectContext: @unchecked Sendable {")
    .replace("public final class JavaScriptPropNameID: JavaScriptType {", "public final class JavaScriptPropNameID: JavaScriptType, @unchecked Sendable {")
    .replace(
      "public final class JavaScriptValue: JavaScriptType, Equatable, Escapable, Error {",
      "public final class JavaScriptValue: JavaScriptType, Equatable, Escapable, Error, @unchecked Sendable {",
    );

  if (next !== source) {
    writeFileSync(file, next);
    patched += 1;
  }
}

if (patched > 0) {
  console.log(`Patched expo-modules-jsi Swift weak runtime declarations in ${patched} files.`);
}
