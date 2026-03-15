/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collections, UsersRecord } from "@/types/pocketbase-types";

import pb from "./pocketbase";

export function checkAuth() {
  return pb.authStore.isValid;
}

export function getCurrentUser() {
  if (!checkAuth()) {
    return null;
  }

  return pb.authStore.record as unknown as UsersRecord;
}

export function getUserInfo() {
  const pbUser = getCurrentUser();

  if (pbUser) {
    return {
      id: pbUser.id,
      email: pbUser.email,
      name: pbUser.name || "",
      token: pb.authStore.token,
      canSubmit: pbUser.can_submit ?? false,
      canValidate: pbUser.can_validate,
      user: {
        firstName: pbUser.name?.split(" ").at(0) || "",
        lastName: pbUser.name?.split(" ").at(1) || "",
        email: pbUser.email,
      },
    };
  }

  return null;
}

export function getCurrentUserId() {
  return pb.authStore.record?.id;
}

export const logout = () => {
  pb.authStore.clear();
};

/**
 * Refresh the auth store record from the server.
 * This keeps user flags like `can_submit` and `can_validate` in sync
 * without requiring a full logout/login cycle.
 * Call this from protected-route loaders.
 */
export const refreshAuth = async () => {
  await pb.collection(Collections.Users).authRefresh();
};

export const login = async (user: any) => {
  try {
    await pb
      .collection(Collections.Users)
      .authWithPassword(user.email, user.password);

    const userInfo = getUserInfo();

    return userInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const loginOIDC = async () => {
  try {
    await pb.collection(Collections.Users).authWithOAuth2({
      provider: "oidc",
      createData: { can_submit: true },
    });

    const userInfo = getUserInfo();

    return userInfo;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
