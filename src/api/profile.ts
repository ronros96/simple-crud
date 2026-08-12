const API_URL = import.meta.env.VITE_APP_API_PROFILE;

export type User = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
};



export type CreateUser = Omit<User, "username"> & {
  username: string;
};

export type UpdateUser = Partial<User>;

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  console.log(response,url);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();

      if (typeof error === "string") {
        message = error;
      } else if (error?.message) {
        message = error.message;
      }
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message);
  }

  // DELETE may return an empty response
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : (undefined as T);
}

/* GET ALL */

export const getUsers = async (): Promise<User[]> => {
  return request<User[]>(API_URL);
};

/* 
   GET INDIVIDUAL
 */

export const getUser = async (
  username: string
): Promise<User> => {
  return request<User>(
    `${API_URL}/${encodeURIComponent(username)}`
  );
};

/* 
   POST
 */

export const createUser = async (
  user: CreateUser
): Promise<User> => {
  return request<User>(API_URL, {
    method: "POST",
    body: JSON.stringify(user),
  });
};

/* 
   PUT
 */

export const putUser = async (
  username: string,
  user: User
): Promise<User> => {
  return request<User>(
    `${API_URL}/${encodeURIComponent(username)}`,
    {
      method: "PUT",
      body: JSON.stringify(user),
    }
  );
};

/* 
   PATCH
 */

export const patchUser = async (
  username: string,
  user: UpdateUser
): Promise<User> => {
  return request<User>(
    `${API_URL}/${encodeURIComponent(username)}`,
    {
      method: "PATCH",
      body: JSON.stringify(user),
    }
  );
};

/* 
   DELETE
 */

export const deleteUser = async (
  username: string
): Promise<void> => {
  return request<void>(
    `${API_URL}/${encodeURIComponent(username)}`,
    {
      method: "DELETE",
    }
  );
};
