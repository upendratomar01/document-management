import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

type DrawerItemProps = {
  open: boolean;
  selected: boolean;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export function DrawerItem({
  open,
  text,
  selected,
  icon,
  onClick,
}: DrawerItemProps) {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        selected={selected}
        sx={{
          minHeight: 48,
          px: 2.5,
          justifyContent: open ? "initial" : "center",
        }}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            mr: open ? 3 : "auto",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
