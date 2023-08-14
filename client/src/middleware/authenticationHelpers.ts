import { runGetRequest, simpleAddObjectToDatabase } from "./database-actions";
import bcrypt from "bcryptjs-react";

interface User {
  name: string;
  password: string;
  salt: string;
}

export async function fetchUsers(): Promise<User[]> {
  return runGetRequest("users");
}

export async function addUser(name: string, password: string) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please supply a user name." },
    };
  }

  if (!password || password === "") {
    return {
      status: 500,
      data: { message: "Please supply a password." },
    };
  }

  const existingUsers = await fetchUsers();

  if (
    existingUsers.find((user) => {
      return user.name === name;
    })
  ) {
    return {
      status: 500,
      data: { message: "User name already exists." },
    };
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  return simpleAddObjectToDatabase(fetchUsers, "users", {
    name,
    password: hash,
  });
}

export async function validateUserSession(
  name: string,
  suppliedPassword: string
) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { isAuthenticated: false, message: "Please supply a user name." },
    };
  }

  if (!suppliedPassword || suppliedPassword === "") {
    return {
      status: 500,
      data: { isAuthenticated: false, message: "Please supply a password." },
    };
  }

  const users = await fetchUsers();

  const userToValidate = users.find((user) => {
    return user.name === name;
  });

  if (!userToValidate) {
    return {
      status: 500,
      data: { isAuthenticated: false, message: "User could not be found." },
    };
  }

  // Validate the passwords match
  if (bcrypt.compareSync(suppliedPassword, userToValidate.password)) {
    return {
      status: 200,
      data: { isAuthenticated: true, message: "success" },
    };
  }

  return {
    status: 500,
    data: { isAuthenticated: false, message: "Invalid password." },
  };
}
