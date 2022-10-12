
export const validatePrice: any = (values: any) => {
    const errors: any = {}


    if (!values.price)
        errors.price = 'enter price'//TODO change text

    if (isNaN(Number(values.price)))
        errors.price = 'Must be a number'//TODO change text
    return errors
};
