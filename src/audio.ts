// src/audio.ts
import {
  getInputDevices,
  getOutputDevices,
  getDefaultInputDevice,
  getDefaultOutputDevice,
  setDefaultInputDevice,
  setDefaultOutputDevice,
} from "macos-audio-devices";

export type DeviceType = "input" | "output";

export interface Device {
  id: number;
  name: string;
  isCurrent: boolean;
}

interface RawDevice {
  id: number;
  name: string;
}

const api = {
  input: {
    list: getInputDevices,
    current: getDefaultInputDevice,
    set: setDefaultInputDevice,
  },
  output: {
    list: getOutputDevices,
    current: getDefaultOutputDevice,
    set: setDefaultOutputDevice,
  },
} as const;

export async function getDevices(type: DeviceType): Promise<Device[]> {
  const [devices, current] = await Promise.all([
    api[type].list() as Promise<RawDevice[]>,
    api[type].current() as Promise<RawDevice>,
  ]);
  return devices.map((d) => ({
    id: d.id,
    name: d.name,
    isCurrent: d.id === current.id,
  }));
}

export async function getCurrent(type: DeviceType): Promise<Device> {
  const current = (await api[type].current()) as RawDevice;
  return { id: current.id, name: current.name, isCurrent: true };
}

export async function setDevice(type: DeviceType, id: number): Promise<void> {
  await api[type].set(id);
}
