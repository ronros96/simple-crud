import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  patchUser,
  putUser,
  type CreateUser,
  type UpdateUser,
  type User,
} from "@src/api/profile";


/* QUERY KEYS */

export const userKeys = {
  all: ["users"] as const,

  detail: (username: string) =>
    ["users", username] as const,
};


/* GET ALL USERS */

export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });
};


/* GET INDIVIDUAL USER */

export const useGetUser = (
  username?: string
) => {
  return useQuery({
    queryKey: userKeys.detail(username ?? ""),
    queryFn: () => getUser(username!),

    enabled: Boolean(username),
  });
};


/*  POST USER */

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUser) =>
      createUser(user),

    onSuccess: (newUser) => {
      // Refresh the users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      // Add the new user to cache
      queryClient.setQueryData(
        userKeys.detail(newUser.username),
        newUser
      );
    },
  });
};


/* PUT USER */

export const usePutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      username,
      user,
    }: {
      username: string;
      user: User;
    }) => putUser(username, user),

    onSuccess: (updatedUser, variables) => {
      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      // Update individual user cache
      queryClient.setQueryData(
        userKeys.detail(variables.username),
        updatedUser
      );
    },
  });
};


/* PATCH USER */

export const usePatchUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      username,
      user,
    }: {
      username: string;
      user: UpdateUser;
    }) => patchUser(username, user),

    onSuccess: (updatedUser, variables) => {
      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      // Update individual user cache
      queryClient.setQueryData(
        userKeys.detail(variables.username),
        updatedUser
      );
    },
  });
};


/*  DELETE USER */

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) =>
      deleteUser(username),

    onSuccess: (_, username) => {
      // Remove individual user from cache
      queryClient.removeQueries({
        queryKey: userKeys.detail(username),
      });

      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
};
