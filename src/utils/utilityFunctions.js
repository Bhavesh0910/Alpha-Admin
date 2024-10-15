import {notification} from "antd";

export function copyToClipboard(value, message) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        notification.success({
          message: message ? message + " Copied" : "Information copied to clipboard",
          placement: "topRight",
        });
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        fallbackCopy(value);
      });
  } else {
    fallbackCopy(value);
  }
}

function fallbackCopy(value, message) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  notification.success({
    message: message ? message + " copied" : "Information copied to clipboard using fallback",
    placement: "topRight",
  });
}
