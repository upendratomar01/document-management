import {
  styled,
  IconButton,
  Divider,
  List,
  CSSObject,
  Theme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useRouter } from "next/navigation";
import Description from "@mui/icons-material/Description";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import People from "@mui/icons-material/People";
import React from "react";
import { ROUTES } from "@/constants/routes";
import { DrawerItem } from "./DrawerItem";
import { useRole } from "@features/auth/hooks/useRole";

export const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

type DrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function Drawer({ open = false, onClose }: DrawerProps) {
  const router = useRouter();
  const { isAdmin } = useRole();

  const handleDrawerClose = () => {
    onClose();
  };

  return (
    <CustomDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {isAdmin && (
          <DrawerItem
            open={open}
            text="Users"
            icon={<People />}
            onClick={() => router.push(ROUTES.DASHBOARD_USERS)}
          />
        )}
        <DrawerItem
          open={open}
          text="Documents"
          icon={<Description />}
          onClick={() => router.push(ROUTES.DASHBOARD_DOCS)}
        />
      </List>
    </CustomDrawer>
  );
}
