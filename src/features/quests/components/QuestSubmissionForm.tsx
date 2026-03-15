import React, { useCallback, useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

import { submitTask } from "@/features/quests/utils/submitTask";
import { Quest, QuestStatus, QuestType } from "@/types/types";
import { getUserInfo } from "@/utils/auth";

// TODO: Rewrite this completely to use React Hook Form for better form handling
interface QuestSubmissionFormProps {
  quest: Quest;
  onSubmit: () => void;
}
function QuestSubmissionForm({ quest, onSubmit }: QuestSubmissionFormProps) {
  const isMobile = window?.innerWidth <= 500;
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitTaskStatus, setSubmitTaskStatus] = useState("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    [],
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(event.target.files ?? []);
      if (!selected.length) return;

      if (selected.length > 10) {
        setSubmitTaskStatus("You can upload at most 10 files");
        event.target.value = "";
        return;
      }

      const expectedCategory =
        quest.type === QuestType.VIDEO ? "video" : "image";
      const unsupported = selected.find(
        (f) => f.type.split("/")[0] !== expectedCategory,
      );
      if (unsupported) {
        setSubmitTaskStatus("File type not supported");
        event.target.value = "";
        return;
      }

      setSubmitTaskStatus("");
      setFiles(selected);
    },
    [quest.type],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitTaskStatus("Submitting task…");
      const result = await submitTask(quest.id, { text, files });
      if (result === true) {
        setSubmitTaskStatus("Task submitted successfully");
        alert("Task submitted successfully");
        onSubmit();
      } else {
        setSubmitTaskStatus(result);
        alert(result);
      }
    },
    [quest.id, text, files, onSubmit],
  );

  const canSubmit = getUserInfo()?.canSubmit ?? false;

  if (quest.status === QuestStatus.CORRECT) {
    return null;
  }

  if (!canSubmit) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="text.secondary" variant="body2">
          Your account is not enabled for task submissions. Contact an
          administrator to request access.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{
          m: 0,
          fontFamily:
            '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
          fontSize: "1rem",
          lineHeight: "22px",
        }}
      >
        Submit Task {quest.type === QuestType.VIDEO ? "Video" : ""}{" "}
        {quest.type === QuestType.IMAGE ? "Image" : ""}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <TextField
          margin="normal"
          required
          label={quest.type === QuestType.TEXT ? "Enter the answer here" : ""}
          type={quest.type === QuestType.TEXT ? "text" : "file"}
          onChange={
            quest.type === QuestType.TEXT ? handleInputChange : handleFileChange
          }
          inputProps={
            quest.type !== QuestType.TEXT ? { multiple: true } : undefined
          }
          sx={{
            width: isMobile ? "90%" : "400px",
            backgroundColor: "white",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
            borderRadius: "5px",
            ":hover": { boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 2px" },
          }}
          multiline={quest.type === QuestType.TEXT}
          maxRows={5}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            width: isMobile ? "90%" : "400px",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
          }}
          disabled={
            submitTaskStatus === "Submitting task…" ||
            (quest.type === QuestType.TEXT ? text === "" : files.length === 0)
          }
        >
          Submit
        </Button>
      </Box>
      <div
        style={{
          color:
            submitTaskStatus.startsWith("File type") ||
            submitTaskStatus.startsWith("submitTask error") ||
            submitTaskStatus.startsWith("You can upload") ||
            submitTaskStatus === "Unknown error"
              ? "red"
              : "black",
        }}
      >
        {submitTaskStatus}
      </div>
    </Box>
  );
}
export default QuestSubmissionForm;
