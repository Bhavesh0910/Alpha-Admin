export function capitalizeFirstLetter(str) {
 
  return str.slice(0, 1).toUpperCase() + str.slice(1, str.length);
}

export function convertToMillions(num) {
  const str = num.toString().split("").reverse().join("");
  const parts = str.match(/.{1,3}/g);
  const result = parts.join(",").split("").reverse().join("");
  return result;
}

export function validateEmail(str) {
  const validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return validRegex.test(str);
}

export function validateContact(str) {
  const validRegex = /^[0-9+]+$/;

  return validRegex.test(str);
}
// class name mapping
export const statusClassMap = {
  open: "Pending_tag",
  succeeded: "Active_tag",
  expired: "Inactive_tag",
  APPROVED:"Active_tag"

};
// remove underscores and manage first letters captipal
export const formatText = (str) => {
  const stringWithSpaces = str?.replace(/_/g, " ");

  const formattedText = stringWithSpaces?.replace(/\b\w/g, (match) =>
    match.toUpperCase()
  );

  return formattedText;
};

export  const convertTimestamp = (timestamp) => {
  // Convert the string timestamp to a number
  const timestampNumber = Number(timestamp);
  
  // Convert milliseconds to a Date object
  const date = new Date(timestampNumber);

  // Extract date components
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Format to DD-MM-YYYY
  return `${day}-${month}-${year}`;
};