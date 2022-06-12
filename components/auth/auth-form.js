import { useState, useRef } from "react";
import classes from "./auth-form.module.css";

/**
 * It sends a POST request to the /api/auth/signup endpoint with the email and password as the body of
 * the request. If the response is not ok, it throws an error. Otherwise, it returns the data from the
 * response
 * @param email - The email address of the user.
 * @param password - "12345678"
 * @returns The data object is being returned.
 */
async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.message || "Something went wrong!");
  }

  const data = await response.json();

  return data;
}

function AuthForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);

  /**
   * The function switchAuthModeHandler() is a function that takes no arguments and returns a function
   * that takes one argument, prevState, and returns the opposite of prevState.
   */
  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  /**
   * The function is called when the user clicks the submit button. It prevents the default action of
   * the submit button, which is to reload the page. It then gets the values of the email and password
   * inputs and passes them to the createUser function. It then logs the result of the createUser
   * function to the console.
   * @param event - The event object that is passed to the event handler.
   */
  async function onSubmitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const result = await createUser(enteredEmail, enteredPassword);

    console.log(result);
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
