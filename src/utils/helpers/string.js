import moment from "moment";

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


export function formatValue(value) {
  // Check for null, undefined, or empty string and return '-'
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  // Return 0 if the value is 0
  if (value === 0) {
    return 0;
  }
  // Return the value as is
  return value;
}


// USD Formatter




export const formatCurrency = (value) => {
  if (value === undefined || value === null) {
      return "$0.00";
  }
  

  const numberValue = parseFloat(value);
  
  const formatted = numberValue.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  });
  
  return formatted.replace('$-', '-$');
};


export const FormatUSD = (data) => {
  return Number(data)?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const dateParser = (date_str) => {
  const [date, time] = date_str.split(" ");
  const [year, month, day] = date.split("-");
  const [hour, minute, seconds] = time.split(":");
  return new Date(Date.UTC(year, Number(month) - 1, day, hour, minute, seconds));
};

export const utc_to_eet = (_date) => {
  const tzString = "EET";
  let date = _date;
  if (typeof date === "string") date = dateParser(date);
  return date.toLocaleString("en-US", {timeZone: tzString});
};

export const formatDate = (date) => {
  if (date === null) return "";
  const DateObj = new Date(date);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${DateObj.getDate()} ${months[DateObj.getMonth()]} ${DateObj.getFullYear()}`;
};

export const formatDateTime = (dateTime) => {
  if (dateTime === null) return "";
  const DateTimeObj = new Date(dateTime);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${DateTimeObj.getDate()} ${months[DateTimeObj.getMonth()]} ${DateTimeObj.getFullYear()} ${DateTimeObj.getHours()}:${DateTimeObj.getMinutes()}:${DateTimeObj.getSeconds()}`;
};

export const formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const dollarUS = (number, maximumSignificantDigits = 10) => {
  if (isNaN(number)) return "$0";
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits,
    minimumFractionDigits: 2,
  }).format(number);
};

export const formatDateTimeNew = (dateTime) => {
  if (!dateTime) return "";

  const formattedDateTime = moment(dateTime).format("D MMM YYYY");
  const formattedTime = moment(dateTime).format("HH:mm:ss");

  return `${formattedDateTime} ${formattedTime}`;
};
