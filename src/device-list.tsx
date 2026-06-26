// src/device-list.tsx
import {
  List,
  ActionPanel,
  Action,
  Icon,
  showToast,
  Toast,
  closeMainWindow,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { Device, DeviceType, getDevices, setDevice } from "./audio";

const NOUN: Record<DeviceType, string> = {
  input: "Input Device",
  output: "Output Device",
};

export default function DeviceList(props: { type: DeviceType }) {
  const { type } = props;
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function load() {
    setIsLoading(true);
    try {
      setDevices(await getDevices(type));
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Failed to load ${NOUN[type].toLowerCase()}s`,
        message: error instanceof Error ? error.message : String(error),
      });
      setDevices([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function select(device: Device) {
    if (device.isCurrent) {
      await closeMainWindow();
      return;
    }
    try {
      await setDevice(type, device.id);
      await showToast({
        style: Toast.Style.Success,
        title: `Now using: ${device.name}`,
      });
      await closeMainWindow();
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: `Could not switch ${NOUN[type].toLowerCase()}`,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder={`Switch ${NOUN[type].toLowerCase()}…`}
    >
      {devices.map((device) => (
        <List.Item
          key={device.id}
          title={device.name}
          icon={device.isCurrent ? Icon.CheckCircle : Icon.Circle}
          accessories={device.isCurrent ? [{ tag: "Current" }] : []}
          actions={
            <ActionPanel>
              <Action
                title={`Switch to ${device.name}`}
                onAction={() => select(device)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
