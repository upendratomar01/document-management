"use client";
import { ROUTES } from "@/constants/routes";
import { Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

export default function AvatarDropDown() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    signOut({ redirect: true, callbackUrl: ROUTES.SIGNIN });
  };

  return (
    session && (
      <Box>
        <IconButton onClick={handleMenuOpen} size="small">
          <Avatar
            sx={{
              bgcolor: deepPurple[500],
            }}
          >
            {session.user?.name?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Box>
    )
  );
}
