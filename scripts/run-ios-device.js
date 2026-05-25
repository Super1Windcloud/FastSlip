#!/usr/bin/env node

const { execFileSync, spawnSync } = require("node:child_process");
const { mkdtempSync, readFileSync, rmSync } = require("node:fs");
const { join } = require("node:path");
const { tmpdir } = require("node:os");

function readDevices() {
  const dir = mkdtempSync(join(tmpdir(), "ios-devices-"));
  const jsonPath = join(dir, "devices.json");

  try {
    execFileSync(
      "xcrun",
      [
        "devicectl",
        "list",
        "devices",
        "--timeout",
        "10",
        "--json-output",
        jsonPath,
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    const output = JSON.parse(readFileSync(jsonPath, "utf8"));
    return output.result?.devices ?? [];
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

function deviceName(device) {
  return device.deviceProperties?.name ?? device.identifier ?? "Unknown iOS device";
}

function deviceUdid(device) {
  return device.hardwareProperties?.udid ?? device.identifier;
}

function isPhysicalIosDevice(device) {
  const platform = device.hardwareProperties?.platform;
  const reality = device.hardwareProperties?.reality;
  return platform === "iOS" && reality === "physical";
}

function isAvailableDevice(device) {
  const pairingState = device.connectionProperties?.pairingState;
  const bootState = device.deviceProperties?.bootState;
  const developerModeStatus = device.deviceProperties?.developerModeStatus;
  const isBootedOrPhysical = bootState == null || bootState === "booted";
  return pairingState === "paired" && isBootedOrPhysical && developerModeStatus !== "disabled";
}

function isWirelessDevice(device) {
  const transportType = device.connectionProperties?.transportType;
  return transportType === "localNetwork" || transportType === "network" || transportType === "wireless";
}

function pickDevice(devices) {
  const physicalDevices = devices.filter((device) => isPhysicalIosDevice(device) && isAvailableDevice(device));
  const wireless = physicalDevices.find(isWirelessDevice);
  return wireless ?? physicalDevices[0];
}

const explicitDevice = process.env.IOS_DEVICE;
const forwardedArgs = process.argv.slice(2);
const expoCli = join(process.cwd(), "node_modules", "expo", "bin", "cli");
const expoArgs = [expoCli, "run:ios", ...forwardedArgs];

if (explicitDevice) {
  expoArgs.push("--device", explicitDevice);
} else {
  const selectedDevice = pickDevice(readDevices());

  if (!selectedDevice) {
    console.error("No available physical iOS device found.");
    console.error("Wireless devices must be awake, unlocked, paired, on the same network, and available in Xcode.");
    console.error("Connect a device by USB as fallback, or run `npm run ios:sim` for Simulator.");
    process.exit(1);
  }

  const udid = deviceUdid(selectedDevice);
  const connection = isWirelessDevice(selectedDevice) ? "wireless" : "wired";
  console.log(`Using ${connection} iOS device: ${deviceName(selectedDevice)} (${udid})`);
  expoArgs.push("--device", udid);
}

if (process.env.IOS_DEVICE_DRY_RUN === "1") {
  console.log([process.execPath, ...expoArgs].join(" "));
  process.exit(0);
}

const result = spawnSync(process.execPath, expoArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);
