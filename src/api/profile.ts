import type {User} from '@src/fields/type';

const API_URL = import.meta.env.VITE_APP_API_PROFILE;

export type CreateUser = Omit<User, "username" | "userID"> & {
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

export const getUser = async ({
  id,
}: {
  id?: string;
}): Promise<User> => {
  const identifier = id;
  return request<User>(
    `${API_URL}/${encodeURIComponent(identifier!)}`
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
  id: string,
  user: User
): Promise<User> => {
  return request<User>(
    `${API_URL}/${encodeURIComponent(id)}`,
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
  id: string,
  user: UpdateUser
): Promise<User> => {
  return request<User>(
    `${API_URL}/${encodeURIComponent(id)}`,
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
  id: string
): Promise<void> => {
  return request<void>(
    `${API_URL}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
};
