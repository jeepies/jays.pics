type ErrorType = {
    payload: { [k: string]: FormDataEntryValue };
    formErrors: string[];
    fieldErrors: {
        username?: string[] | undefined;
        password?: string[] | undefined;
    };
}

export default ErrorType