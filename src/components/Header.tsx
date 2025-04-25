"use client";

import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(features)/auth/context/AuthContext";
import { ROUTES } from "@/constants/routes";

// List of paths where header should be hidden
const hideHeaderRoutes = [ROUTES.SIGNIN, ROUTES.SIGNUP];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
  };

  if (hideHeaderRoutes.includes(pathname)) return null;

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          onClick={() => router.push(ROUTES.HOME)}
          sx={{ cursor: "pointer", fontWeight: "bold" }}
        >
          Document Management
        </Typography>

        {user && (
          <Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar>{user.email[0]?.toUpperCase()}</Avatar>
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
