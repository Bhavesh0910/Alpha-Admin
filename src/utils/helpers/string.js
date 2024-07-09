export function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
}

export function convertToMillions(num) {
  const str = num.toString().split("").reverse().join("");
  const parts = str.match(/.{1,3}/g);
  const result = parts.join(",").split("").reverse().join("");
  return result;
}

export function validateLetters(key) {
  const validRegex = /^[a-zA-Z\s]$/;
  return validRegex.test(key) || key === "Backspace";
}

export function validateContact(key) {
  const validRegex = /^[0-9+]+$/;
  return validRegex.test(key) || key === "Backspace";
}

export function validateEmail(email) {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return validRegex.test(email);
}

export function validatePassword(password) {
  return password.length >= 8;
}
export function TruncateString(string, length) {
  if (string?.length <= length) {
    return string;
  } else {
    return string?.slice(0, length) + "..";
  }
}
export const getOrdinalSuffix = (rank) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = rank % 100;
  return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

// USD Formatter

export function formatCurrency(amount) {
  return amount?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export const FormatUSD = (data) => {
  return Number(data)?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};