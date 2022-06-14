import { hash, compare } from "bcryptjs";
import swal from "sweetalert"

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export async function modifyPassword(client, collection, user, hashedPassword) {
  const db = client.db();
  const result = db
    .collection(collection)
    .updateOne(user, { $set: { password: hashedPassword } });
  return result;
}

export async function updatePassword(newPassword, oldPassword) {

  const response = await fetch("/api/user/changePassword", {
    method: "PUT",
    body: JSON.stringify({
      newPassword,
      oldPassword,
    }),
    headers: { "Content-type": "application/json" },
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
