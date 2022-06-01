export const truncateString = (string, chars) => {
  if (string.length > chars) {
    return `${string.slice(0, chars)}...`;
  } else {
    return string;
  }
};
