#!/usr/bin/env node

const { execFileSync, spawnSync } = require("node:child_process");

function adb(args, options = {}) {
  return execFileSync("adb", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", options.stderr ?? "pipe"],
  });
}

function readDevices() {
  const output = adb(["devices"]);
  return output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    })
    .filter((device) => device.serial && device.state === "device");
}

function isEmulator(device) {
  return device.serial.startsWith("emulator-");
}

function isWirelessDevice(device) {
  return !isEmulator(device) && /^[\d.]+:\d+$/.test(device.serial);
}

function isWiredDevice(device) {
  return !isEmulator(device) && !isWirelessDevice(device);
}

function deviceName(serial) {
  try {
    const model = adb(["-s", serial, "shell", "getprop", "ro.product.model"], { stderr: "ignore" }).trim();
    return model || serial;
  } catch {
    return serial;
  }
}

function pickDevice(devices) {
  return devices.find(isWirelessDevice) ?? devices.find(isWiredDevice) ?? devices.find(isEmulator);
}

const explicitDevice = process.env.ANDROID_DEVICE;
const forwardedArgs = process.argv.slice(2);
const expoArgs = ["expo", "run:android", ...forwardedArgs];
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

if (explicitDevice) {
  expoArgs.push("--device", explicitDevice);
} else {
  let selectedDevice;

  try {
    selectedDevice = pickDevice(readDevices());
  } catch (error) {
    console.error("Unable to read Android devices with `adb devices`.");
    console.error(error.message);
    process.exit(1);
  }

  if (!selectedDevice) {
    console.error("No available Android device found.");
    console.error("Wireless devices must be paired, connected, awake, and on the same network.");
    console.error("Connect a device by USB as fallback, or start an Android emulator.");
    process.exit(1);
  }

  const connection = isWirelessDevice(selectedDevice) ? "wireless" : isWiredDevice(selectedDevice) ? "wired" : "emulator";
  console.log(`Using ${connection} Android device: ${deviceName(selectedDevice.serial)} (${selectedDevice.serial})`);
  expoArgs.push("--device", selectedDevice.serial);
}

if (process.env.ANDROID_DEVICE_DRY_RUN === "1") {
  console.log([npxCommand, ...expoArgs].join(" "));
  process.exit(0);
}

const result = spawnSync(npxCommand, expoArgs, { stdio: "inherit" });
process.exit(result.status ?? 1);
