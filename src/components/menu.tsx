import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Avatar, MenuItem, MenuList } from "@mui/material";
import AppBar from "./app-bar";
import Drawer from "./bar-drawer";
import DrawerHeader from "./bar-drawer-header";
import InvoiceGrid from "./Invoices/grid";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupsIcon from "@mui/icons-material/Groups";
import { ClientsGrid } from "./Clients/grid";
import { useAuth } from "react-oidc-context";
import { InvoiceView } from "./Invoices/View/invoiceView";
import { getRedirectUriFromLogin } from "../utils/envProvider";
import Menu from "@mui/material/Menu";
import { AccountCircle, Logout, Settings } from "@mui/icons-material";
import { ViewProfile } from "./User/viewProfile";
import { ResponseToast } from "./responseToast";
import { QueryResponse } from "../types/queryResponse";

type NavButton = {
  url: string;
  text: string;
  icon: JSX.Element;
};

export const AppMenu = () => {
  const user = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [popperOpen, setPopperOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    user.removeUser();
    user.signoutRedirect({
      post_logout_redirect_uri: getRedirectUriFromLogin(),
    });
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const onPopperClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setPopperOpen(!popperOpen);
  };

  const onPopperClose = () => {
    setAnchorEl(null);
    setPopperOpen(false);
  };

  const navigateToMenuItem = (menuItem: string) => {
    navigate(menuItem);
  };

  const id = popperOpen ? "simple-popper" : undefined;

  const [open, setOpen] = React.useState(false);
  const routes: NavButton[] = [
    {
      url: "/invoices",
      text: "Invoices",
      icon: <PaymentsIcon />,
    },
    {
      url: "/clients",
      text: "Clients",
      icon: <GroupsIcon />,
    },
  ];
  const location = useLocation();
  return (
    <Box sx={{ display: "flex" }}>
      <ResponseToast response={response} />
      <CssBaseline />
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        position="fixed"
        open={open}
      >
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={popperOpen}
          onClose={onPopperClose}
          onClick={onPopperClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuList>
            <MenuItem>
              <Avatar /> Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={navigateToProfile}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        <Toolbar>
          <IconButton
            aria-describedby={id}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Document Management
          </Typography>
        </Toolbar>
        <Avatar sx={{ marginRight: "1rem" }}>
          <IconButton onClick={onPopperClick}>
            <AccountCircle></AccountCircle>
          </IconButton>
        </Avatar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map((route) => (
            <ListItem key={route.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                selected={route.url === "/" + location.pathname.split("/")[1]}
                onClick={() => navigateToMenuItem(route.url)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {route.icon}
                </ListItemIcon>
                <ListItemText
                  primary={route.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route
            path="/invoices"
            element={<InvoiceGrid setResponse={setResponse} />}
          />
          <Route path="/invoices/:id" element={<InvoiceView />} />
          <Route path="/clients" element={<ClientsGrid />} />
          <Route
            path="/profile"
            element={<ViewProfile setResponse={setResponse}></ViewProfile>}
          />
          <Route path="*" element={<Navigate to="/invoices" />} />
        </Routes>
      </Box>
    </Box>
  );
};
