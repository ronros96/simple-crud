
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  contact: string;
  email: string;
  address: string[];
}

export type SearchMode =
  | "all"
  | "name"
  | "contact"
  | "email"
  | "address";

export function filterUsers(
  users: User[],
  search: string,
  mode: SearchMode = "all"
): User[] {
  const query = search.trim().toLowerCase();

  if (!query) return users;

  return users.filter((user) => {
    const fields: Record<SearchMode, string[]> = {
      all: [
        user.firstname,
        user.lastname,
        user.contact,
        user.email,
        ...user.address,
      ],
      name: [user.firstname, user.lastname],
      contact: [user.contact],
      email: [user.email],
      address: user.address,
    };

    return fields[mode].some((field) =>
      field.toLowerCase().includes(query)
    );
  });
}
