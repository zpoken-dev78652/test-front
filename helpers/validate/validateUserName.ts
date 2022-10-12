export const validateUserName: any = (values: any) => {
  const errors: any = {};

  // const isForbiddenSymbol = /^(?=.*[#$!(*)@_`,<>=+-])/;

  if (!values.username)
    errors.username = "Display name seems to be invalid, please check..."; //TODO change text

  if (values.username && values.username.length > 30)
    errors.username = "Display name seems to be invalid, please check..."; //TODO change text

  // if (values.username && isForbiddenSymbol.test(values.username))
  //   errors.username = 'Display name seems to be invalid, please check...';
  return errors;
};
