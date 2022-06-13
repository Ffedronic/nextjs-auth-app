import { useRef } from "react";
import classes from "./profile-form.module.css";

function ProfileForm() {
  const enteredNewPassword = useRef();
  const enteredOldPassword = useRef();

  async function createNewPassword(oldPassword, newPassword) {
    const response = await fetch("/api/user/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
      "Content-type": "application/json",
    });

    const data = await response.json();

    if (!response.ok) {
      swal({
        title: "Error !",
        text: data.message,
        icon: "error",
        buttons: "Enter valid input",
        dangerMode: true,
      });
    } else {
      swal({
        title: "Good Job !",
        text: data.message,
        icon: "success",
        buttons: "Your profile",
        dangerMode: false,
      }).then(() => (window.location.href = "/"));
      return data;
    }
  }

  async function onSubmitHandler(event) {
    event.preventDefault();

    const newPassword = enteredNewPassword.current.value;
    const oldPassword = enteredOldPassword.current.value;

    const result = await createNewPassword(oldPassword, newPassword);
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
