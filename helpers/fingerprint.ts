import hash from "object-hash";

export const fingerprint = () => {
  if (!process.browser) {
    return "";
  }
  const visitorId = hash({
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    timeZone: new Date().getTimezoneOffset(),
    screen: [screen.height, screen.width],
    colorDepth: screen.colorDepth,
  });

  return visitorId;
};
