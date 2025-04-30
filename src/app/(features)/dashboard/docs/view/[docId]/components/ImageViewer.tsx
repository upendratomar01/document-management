import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";

type ImageViewerProps = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
};

export default function ImageViewer({
  url,
  alt,
  width = 800,
  height = 600,
  style,
}: ImageViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Box
      position="relative"
      width="100%"
      maxWidth={width}
      minHeight={loading ? height : undefined}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {loading && (
        <CircularProgress size={40} sx={{ position: "absolute", zIndex: 2 }} />
      )}

      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setLoading(false)}
        style={{
          visibility: loading ? "hidden" : "visible",
          objectFit: "contain",
          ...style,
        }}
      />
    </Box>
  );
}
