"use client";
import { Toolbar, Typography, Box, IconButton, styled } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import MenuIcon from "@mui/icons-material/Menu";
import { drawerWidth } from "../Drawer";
import AvatarDropDown from "./AvatarDropDown";

type HeaderProps = {
  onOpen: () => void;
  open: boolean;
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function Header({ onOpen, open }: HeaderProps) {
  const router = useRouter();

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ justifyContent: "space-between", display: "flex" }}>
        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            onClick={() => router.push(ROUTES.HOME)}
            sx={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Document Management
          </Typography>
        </Box>

        <AvatarDropDown />
      </Toolbar>
    </AppBar>
  );
}
