import { IconName } from "@fortawesome/fontawesome-svg-core";
import * as React from "react";

export type PopupType = "alert" | "confirm" | "prompt" | "remove";
export type PopupConfirm = (value?: string) => void;
export interface Popup {
  title: string;
  text: string;
  icon: IconName;
  onConfirm: PopupConfirm;
  onAbort?: PopupConfirm;
}
export type PopupState = {
  [key in keyof Popup]?: Popup[key];
} & {
  open: boolean;
  type?: PopupType;
};
export type PopupAlert = Omit<Popup, "onConfirm">;
export type PopupPrompt = Popup & { defaultValue?: string };

export interface PopupFunc {
  alert: (options: PopupAlert) => void;
  confirm: (options: Popup) => void;
  prompt: (options: PopupPrompt) => void;
  remove: (options: Popup) => void;
}

export type PopupCallbackData = {
  alert?: PopupAlert;
  confirm?: Popup;
  prompt?: PopupPrompt;
  remove?: Popup;
};

export const PopupContext = React.createContext<{
  Popup: PopupFunc;
  PopupCallback: (type: PopupType) => (data: PopupCallbackData) => void;
}>({
  Popup: {
    alert: () => {},
    confirm: () => {},
    prompt: () => {},
    remove: () => {},
  },
  PopupCallback: () => () => {},
});

export const usePopup = () => React.useContext(PopupContext);
