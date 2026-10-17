
import { describe, it, expect } from "vitest";
import sampleData from '../../sample-data.json';
import { filterUsers } from "./userUtils";

const users = sampleData;

describe("filterUsers", () => {
  it("returns all users when search is empty", () => {
    expect(filterUsers(users, "")).toHaveLength(
      users.length
    );
  });

  it("finds a user by first name", () => {
    const user = users[0];

    const result = filterUsers(
      users,
      user.firstname,
      "name"
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result).toContainEqual(
      expect.objectContaining({ id: user.id })
    );
  });

  it("returns an empty array for a nonexistent user", () => {
    const result = filterUsers(
      users,
      "nonexistent-user-12345",
      "all"
    );

    expect(result).toEqual([]);
  });

  it("finds a user by email", () => {
    const user = users[0];

    const result = filterUsers(
      users,
      user.email,
      "email"
    );

    expect(result).toContainEqual(
      expect.objectContaining({ id: user.id })
    );
  });

  it("does not modify the original sample data", () => {
    const original = structuredClone(users);

    filterUsers(users, "test", "all");

    expect(users).toEqual(original);
  });
});
