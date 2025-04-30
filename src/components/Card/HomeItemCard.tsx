import { Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { Card } from ".";

type HomeItemCardProps = {
  url: string;
  emoji: string;
  title: string;
  desc: string;
};
export function HomeItemCard({ title, desc, url, emoji }: HomeItemCardProps) {
  return (
    <Link href={url} passHref style={{ textDecoration: "none", width: "100%" }}>
      <Card
        sx={{
          height: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(3, 3, 3, 0.12)",
          transition: "all 0.3s",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          },
        }}
      >
        <Typography variant="h2" mb={1}>
          {emoji}
        </Typography>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" px={2}>
          {desc}
        </Typography>
      </Card>
    </Link>
  );
}
