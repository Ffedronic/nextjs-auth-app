import { useRef } from "react";
import { updatePassword } from "../../lib/auth";
import classes from "./profile-form.module.css";

function ProfileForm() {
  const enteredNewPassword = useRef();
  const enteredOldPassword = useRef();

  async function onSubmitHandler(event) {
    event.preventDefault();

    const newPassword = enteredNewPassword.current.value;
    const oldPassword = enteredOldPassword.current.value;

    const response = await updatePassword(newPassword, oldPassword);

    console.log(response);
  }

  return (
    <form className={classes.form} onSubmit={onSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={enteredNewPassword} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={enteredOldPassword} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
