// src/audio.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("macos-audio-devices", () => ({
  getInputDevices: vi.fn(),
  getOutputDevices: vi.fn(),
  getDefaultInputDevice: vi.fn(),
  getDefaultOutputDevice: vi.fn(),
  setDefaultInputDevice: vi.fn(),
  setDefaultOutputDevice: vi.fn(),
}));

import * as raw from "macos-audio-devices";
import { getDevices, getCurrent, setDevice } from "./audio";

const mock = raw as unknown as Record<string, ReturnType<typeof vi.fn>>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getDevices", () => {
  it("returns input devices with isCurrent flag set from the default", async () => {
    mock.getInputDevices.mockResolvedValue([
      { id: 1, name: "MacBook Mic", isInput: true, isOutput: false },
      { id: 2, name: "Shure MV7", isInput: true, isOutput: false },
    ]);
    mock.getDefaultInputDevice.mockResolvedValue({ id: 2, name: "Shure MV7" });

    const devices = await getDevices("input");

    expect(devices).toEqual([
      { id: 1, name: "MacBook Mic", isCurrent: false },
      { id: 2, name: "Shure MV7", isCurrent: true },
    ]);
  });

  it("uses output package functions for output type", async () => {
    mock.getOutputDevices.mockResolvedValue([
      { id: 5, name: "Studio Display", isInput: false, isOutput: true },
    ]);
    mock.getDefaultOutputDevice.mockResolvedValue({
      id: 5,
      name: "Studio Display",
    });

    const devices = await getDevices("output");

    expect(mock.getOutputDevices).toHaveBeenCalledOnce();
    expect(mock.getInputDevices).not.toHaveBeenCalled();
    expect(devices).toEqual([
      { id: 5, name: "Studio Display", isCurrent: true },
    ]);
  });

  it("propagates errors from the underlying package", async () => {
    mock.getInputDevices.mockRejectedValue(new Error("hardware unavailable"));
    await expect(getDevices("input")).rejects.toThrow("hardware unavailable");
  });
});

describe("getCurrent", () => {
  it("returns the default device for the type with isCurrent true", async () => {
    mock.getDefaultInputDevice.mockResolvedValue({ id: 2, name: "Shure MV7" });
    const current = await getCurrent("input");
    expect(current).toEqual({ id: 2, name: "Shure MV7", isCurrent: true });
  });

  it("routes to output package function for output type", async () => {
    mock.getDefaultOutputDevice.mockResolvedValue({
      id: 5,
      name: "Studio Display",
    });
    const current = await getCurrent("output");
    expect(current).toEqual({ id: 5, name: "Studio Display", isCurrent: true });
    expect(mock.getDefaultInputDevice).not.toHaveBeenCalled();
  });

  it("propagates errors from the underlying package", async () => {
    mock.getDefaultInputDevice.mockRejectedValue(
      new Error("no default device"),
    );
    await expect(getCurrent("input")).rejects.toThrow("no default device");
  });
});

describe("setDevice", () => {
  it("calls setDefaultInputDevice for input", async () => {
    mock.setDefaultInputDevice.mockResolvedValue(undefined);
    await setDevice("input", 2);
    expect(mock.setDefaultInputDevice).toHaveBeenCalledWith(2);
  });

  it("calls setDefaultOutputDevice for output", async () => {
    mock.setDefaultOutputDevice.mockResolvedValue(undefined);
    await setDevice("output", 5);
    expect(mock.setDefaultOutputDevice).toHaveBeenCalledWith(5);
  });

  it("propagates errors from the underlying package", async () => {
    mock.setDefaultInputDevice.mockRejectedValue(new Error("device gone"));
    await expect(setDevice("input", 99)).rejects.toThrow("device gone");
  });
});
