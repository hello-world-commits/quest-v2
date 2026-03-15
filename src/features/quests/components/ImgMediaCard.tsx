import React from "react";

import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

import {
  QuestStatus,
  QuestSubmission,
  QuestSubmissionContentType,
} from "@/types/types";
import { formatDate } from "@/utils/human-readable-date";

interface ImgMediaCardProps {
  submission: QuestSubmission;
}
function ImgMediaCard({ submission }: ImgMediaCardProps) {
  const { status, content, uploadTime } = submission;

  const extraCount =
    content.type !== QuestSubmissionContentType.TEXT &&
    (content.totalCount ?? 1) > 1
      ? content.totalCount! - 1
      : 0;

  return (
    <Card
      sx={{
        width: 345,
        height: 300,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 2px 3px",
        cursor: "pointer",
        color:
          status === QuestStatus.CORRECT
            ? "green"
            : status === QuestStatus.WRONG
              ? "red"
              : undefined,
      }}
    >
      {content.type === QuestSubmissionContentType.IMAGE ? (
        <Box sx={{ position: "relative", height: "195px", flexShrink: 0 }}>
          <CardMedia
            component="img"
            height="195"
            image={content.url}
            alt="submission image"
            onClick={() => window.open(content.url, "_blank")}
          />
          {extraCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 6,
                right: 8,
                bgcolor: "rgba(0,0,0,0.55)",
                color: "#fff",
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                lineHeight: 1.4,
                pointerEvents: "none",
              }}
            >
              +{extraCount} more
            </Typography>
          )}
        </Box>
      ) : content.type === QuestSubmissionContentType.VIDEO ? (
        <Box sx={{ position: "relative", height: "195px", flexShrink: 0 }}>
          <CardMedia
            component="video"
            image={content.url}
            controls
            onClick={() => window.open(content.url, "_blank")}
            style={{ height: "195px" }}
          />
          {extraCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                bottom: 6,
                right: 8,
                bgcolor: "rgba(0,0,0,0.55)",
                color: "#fff",
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                lineHeight: 1.4,
                pointerEvents: "none",
              }}
            >
              +{extraCount} more
            </Typography>
          )}
        </Box>
      ) : (
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="span"
            sx={{ display: "block", textOverflow: "ellipsis", height: "150px" }}
          >
            {content.text}
          </Typography>
        </CardContent>
      )}
      <CardContent sx={{ p: 0, pl: 1 }}>
        <Typography
          variant="h6"
          component="span"
          sx={{ display: "block", fontSize: 14, mb: 0.5 }}
        >
          {formatDate(uploadTime, {
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </Typography>
        <Typography
          gutterBottom
          variant="h5"
          component="span"
          sx={{ display: "block" }}
        >
          {status}
        </Typography>
      </CardContent>
    </Card>
  );
}
export default ImgMediaCard;
