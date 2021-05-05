import * as Yup from 'yup';

function getPasswordValidationSchema(values) {
    return Yup.object().shape({
      user_password: Yup.string().required('Password is required!'),
      user_passwordConfirm: Yup.string()
        .oneOf([values.user_password], 'Passwords are not the same!')
        .required('Password confirmation is required!'),
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
    const validationPasswordSchema = getPasswordValidationSchema(values);
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      return {};
    } catch (error) {
      return getErrorsFromValidationError(error);
    }
  }
  