import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { 
  queryOptions 
} from '@tanstack/react-query';

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  patchUser,
  putUser,
  type CreateUser,
  type UpdateUser,
} from "@src/api/profile";

import type {User} from '@src/fields/type';


/* QUERY KEYS */

export const userKeys = {
  all: ["users"] as const,

  detail: (identifier: {
    id?: string;
    username?: string;
  }) => ["users", identifier] as const,
};


/* GET ALL USERS */
export const useGetUsers = () => {
  return useQuery(usersQuery());
};

export const usersQuery = () =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: getUsers,
  });


/* GET INDIVIDUAL USER */

// export const useGetUser = (
//   username?: string
// ) => {
//   return useQuery({
//     queryKey: userKeys.detail(username ?? ""),
//     queryFn: () => getUser(username!),

//     enabled: Boolean(username),
//   });
// };

export const useGetUser = ({
  id,
  username,
}: {
  id?: string;
  username?: string;
}) => {
  return useQuery({
    queryKey: userKeys.detail({
      id,
      username,
    }),
    queryFn: () => getUser({ id, username }),
    enabled: Boolean(id || username),
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
        userKeys.detail({
          id: newUser.id,
          username: newUser.username,
        }),
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
      id,
      user,
    }: {
      id: string;
      user: User;
    }) => putUser(id, user),

    onSuccess: (updatedUser, variables) => {
      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      // Update individual user cache
      queryClient.setQueryData(
        userKeys.detail({id: variables.id}),
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
      id,
      user,
    }: {
      id: string;
      user: UpdateUser;
    }) => patchUser(id, user),

    onSuccess: (updatedUser, variables) => {
      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });

      // Update individual user cache
      queryClient.setQueryData(
        userKeys.detail({id: variables.id}),
        updatedUser
      );
    },
  });
};


/*  DELETE USER */

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteUser(id),

    onSuccess: (_, id) => {
      // Remove individual user from cache
      queryClient.removeQueries({
        queryKey: userKeys.detail({id: id}),
      });

      // Refresh users list
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
};
