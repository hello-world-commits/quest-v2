import { Collections } from "@/types/pocketbase-types";
import { getCurrentUserId, getUserInfo } from "@/utils/auth";
import pb from "@/utils/pocketbase";

export type TaskSubmission = { text: string; files?: File[] };

function getCurrentUserName() {
  return pb.authStore.record?.name || "undefinedUser";
}

function prefixedFile(questId: string, file: File): File {
  const newName = `${questId}_${getCurrentUserName()}_${file.name}`;
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

export const submitTask = async (
  questId: string,
  submission: TaskSubmission,
): Promise<true | string> => {
  const userInfo = getUserInfo();
  if (!userInfo) {
    return "submitTask error: not authenticated";
  }
  if (!userInfo.canSubmit) {
    return "submitTask error: your account is not enabled for task submissions";
  }

  try {
    // Build FormData explicitly so every file is a separate part named
    // "attachment".  Relying on the SDK to auto-detect File[] inside a
    // plain object is fragile; explicit FormData is what PocketBase
    // expects for multi-file fields (maxSelect > 1).
    const formData = new FormData();
    formData.append("quest", questId);
    formData.append("submitter", getCurrentUserId() ?? "");
    formData.append("text", submission.text);
    for (const file of submission.files ?? []) {
      formData.append("attachment", prefixedFile(questId, file));
    }

    await pb.collection(Collections.Submissions).create(formData);
    return true;
  } catch (error) {
    // Surface the real PocketBase validation message so failures are
    // immediately diagnosable in both the console and the UI.
    const pbError = error as {
      status?: number;
      response?: { message?: string; data?: Record<string, { message?: string }> };
    };

    let detail = "Unknown error";
    if (pbError?.response?.message) {
      detail = pbError.response.message;
    }
    if (pbError?.response?.data) {
      const fieldErrors = Object.entries(pbError.response.data)
        .map(([field, err]) => `${field}: ${err?.message ?? "invalid"}`)
        .join("; ");
      if (fieldErrors) detail += ` (${fieldErrors})`;
    }

    const statusLabel = pbError?.status ? ` [HTTP ${pbError.status}]` : "";
    const message = `submitTask error${statusLabel}: ${detail}`;
    console.error(message, error);
    return message;
  }
};
