"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer, { DrawerHeader } from "@/components/Drawer";
import Header from "@/components/Header";

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header open={open} onOpen={handleDrawerOpen} />
      <Drawer open={open} onClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
