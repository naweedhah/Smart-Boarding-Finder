import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../../lib/apiRequest";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const FULL_NAME_REGEX = /^[A-Za-z\s'.-]+$/;

const validateRegisterForm = (values) => {
  const nextErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 2) {
    nextErrors.fullName = "Full name must be at least 2 characters.";
  } else if (!FULL_NAME_REGEX.test(values.fullName.trim())) {
    nextErrors.fullName = "Full name can only contain letters and common name symbols.";
  }

  if (!values.username.trim()) {
    nextErrors.username = "Username is required.";
  } else if (!USERNAME_REGEX.test(values.username.trim())) {
    nextErrors.username =
      "Use 3-20 letters, numbers, or underscores only.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!values.phone.trim()) {
    nextErrors.phone = "Phone number is required.";
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    nextErrors.phone = "Use exactly 10 digits.";
  }

  if (!values.gender) {
    nextErrors.gender = "Please select your gender.";
  }

  if (!values.role) {
    nextErrors.role = "Please select your user type.";
  }

  if (!values.password) {
    nextErrors.password = "Password is required.";
  } else if (values.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  }

  if (!values.confirmPassword) {
    nextErrors.confirmPassword = "Please re-enter your password.";
  } else if (values.confirmPassword !== values.password) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  return nextErrors;
};

function Register() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(nextValues);

    if (touchedFields[name]) {
      const nextErrors = validateRegisterForm(nextValues);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name],
      }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const nextTouched = {
      ...touchedFields,
      [name]: true,
    };
    const nextErrors = validateRegisterForm(formValues);

    setTouchedFields(nextTouched);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const values = formValues;

    const nextErrors = validateRegisterForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setTouchedFields({
        fullName: true,
        username: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    try {
      await apiRequest.post("/auth/register", {
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        phone: values.phone,
        gender: values.gender,
        role: values.role,
        password: values.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <label>
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formValues.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.fullName && <small>{fieldErrors.fullName}</small>}
          </label>
          <label>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.username && <small>{fieldErrors.username}</small>}
          </label>
          <label>
            <input
              name="email"
              type="text"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </label>
          <label>
            <input
              name="phone"
              type="text"
              placeholder="Phone Number"
              value={formValues.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.phone && <small>{fieldErrors.phone}</small>}
          </label>
          <label>
            <select
              name="gender"
              value={formValues.gender}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
            {fieldErrors.gender && <small>{fieldErrors.gender}</small>}
          </label>
          <label>
            <select
              name="role"
              value={formValues.role}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>
                User Type
              </option>
              <option value="student">Student</option>
              <option value="boardingOwner">Boarding Owner</option>
            </select>
            {fieldErrors.role && <small>{fieldErrors.role}</small>}
          </label>
          <label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.password && <small>{fieldErrors.password}</small>}
          </label>
          <label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter Password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {fieldErrors.confirmPassword && <small>{fieldErrors.confirmPassword}</small>}
          </label>
          <button disabled={isLoading}>Register</button>
          {error && <span className="formError">{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;
