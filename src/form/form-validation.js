import * as Yup from 'yup';

function getEmailValidationSchema(values) {
  return Yup.object().shape({
    user_email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    user_firstname: Yup.string().required('Name is required!'),
  });
}

function getErrorsFromValidationError(validationError) {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR]
    };
  }, {});
}

export default function validate(values) {
  const validationSchema = getEmailValidationSchema(values);
  try {
    validationSchema.validateSync(values, { abortEarly: false });
    return {};
  } catch (error) {
    return getErrorsFromValidationError(error);
  }
}