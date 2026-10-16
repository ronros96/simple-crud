
import { useMutation, useQuery } from "@tanstack/react-query";
import { sha256 } from "crypto-hash";

const API_URL = import.meta.env.VITE_APP_API;
const COOKIE_NAME = "auth_token";

export interface ILoginSession {
  id: string;
  session_id: string;
  UserId: string;
  username: string;
  date_logged: string;
}

interface ILoginInput {
  UserId: string;
  username: string;
}

const getAuthCookie = (): string | null => {
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith('session'))?.split(',')[0];
  return item ? decodeURIComponent(item.split("=").slice(2).join("=")) : null;
};

const getAuthUser = (): string | null => {
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith('session'))?.split(',')[1];
  return item ? item.split("=").slice(1).join("=") : null;
};

const saveCookie = (
  token:string, 
  userId:string
) => {
  document.cookie =
    `session=${COOKIE_NAME}=${encodeURIComponent(token)},user=${userId}; `+
    "Max-Age=86400; Path=/; SameSite=Lax; Secure";
};

export const removeAuthCookie = () => {
  document.cookie =
    `session=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
};

// Create a session after credentials have been validated.
const createSession = async (
  user: ILoginInput
): Promise<ILoginSession> => {
  const session_id = await sha256(
    `${user.UserId}-${Date.now()}-${crypto.randomUUID()}`
  );

  const session: ILoginSession = {
    id:'',
    session_id,
    UserId: user.UserId,
    username: user.username,
    date_logged: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/Logins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    throw new Error("Unable to create login session.");
  }

  const savedSession: ILoginSession = await response.json();
  saveCookie(savedSession.session_id,savedSession.UserId);
  return savedSession;
};

// Restore the session using the cookie ID.
const restoreSession = async (): Promise<ILoginSession | null> => {
  const session_id = getAuthCookie();
  const userId = getAuthUser();

  if (!session_id) return null;

  const url = new URL(`${API_URL}/Users/${userId}/Logins`);
  const response = await fetch(url);

  if (response.status === 404) {
    // removeAuthCookie();
    // return null;
     throw new Error("Unable to verify login session.");
  }

  if (!response.ok) {
    throw new Error("Unable to verify login session.");
  }
  const session:ILoginSession = await response.json();

  //clean retain 10 remove old session
  if(userId && Object(session).length > 9){
    deleteOldLoginLogs(userId);
  }

  //get valid session base on cookie
  const validSession:ILoginSession = Object(session).find((item:any) => item.session_id === session_id);
  
  // Check that the record matches the requested session.
  if (!validSession) {
    removeAuthCookie();
    return null;
  }else{
    createSession(validSession)
  }

  // Enforce a 24-hour limit even if the API record remains.
  const loggedAt = Date.parse(validSession.date_logged);
  if (
    !Number.isFinite(loggedAt) ||
    loggedAt > Date.now() ||
    Date.now() - loggedAt >= 24 * 60 * 60 * 1000
  ) {
    removeAuthCookie();
    return null;
  }

  return session;
};

export const useCreateAuthSession = () => {
  return useMutation({
    mutationFn: createSession,
  });
  
};

export const useRestoreAuthSession = () => {
  return useQuery({
    queryKey: ["auth-session"],
    queryFn: restoreSession,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

const deleteOldLoginLogs = async (userId:string): Promise<void> => {
  const url = new URL(`${API_URL}/Users/${userId}/Logins`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch login logs.");
  }
  const logs: ILoginSession[] = await response.json();
  const sortedLogs = [...logs].sort((a, b) =>
    Date.parse(b.date_logged) - Date.parse(a.date_logged)
  );
  const oldLogs = sortedLogs.slice(9);

  await Promise.all(
    oldLogs.map(async (log) => {
      const deleteResponse = await fetch(
        `${API_URL}/Users/${userId}/Logins/${log.id}`,
        { method: "DELETE" }
      );

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete login log: ${log.session_id}`);
      }
    })
  );
};
