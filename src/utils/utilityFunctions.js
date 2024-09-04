import {notification} from "antd";

export function copyToClipboard(value) {
  navigator.clipboard.writeText(value);
  notification.success({
    message: "Payment ID copied to clipboard",
    placement: "topRight",
  });
}
