"use client";

import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { signOut, useSession } from "next-auth/react";

// List of paths where header should be hidden
const hideHeaderRoutes = [ROUTES.SIGNIN, ROUTES.SIGNUP];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
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

  if (hideHeaderRoutes.includes(pathname)) return null;

  return (
    <AppBar position="static" color="info" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          onClick={() => router.push(ROUTES.HOME)}
          sx={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Document Management
        </Typography>

        {session && (
          <Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar>{session.user?.email?.[0]?.toUpperCase()}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={!!anchorEl}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
