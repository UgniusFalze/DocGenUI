import React from "react";
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
import { Navigate, Link as ReactLink, Route, Routes, useLocation } from "react-router-dom";
import { Button, Link } from "@mui/material";
import AppBar from "./app-bar";
import Drawer from "./bar-drawer";
import DrawerHeader from "./bar-drawer-header";
import InvoiceGrid from "./Invoices/grid";
import PaymentsIcon from "@mui/icons-material/Payments";
import GroupsIcon from "@mui/icons-material/Groups";
import { ClientsGrid } from "./Clients/grid";
import { useAuth } from "react-oidc-context";
import { InvoiceView } from "./Invoices/View/invoiceView";

type NavButton = {
  url: string;
  text: string;
  icon: JSX.Element;
};

export const Menu = () => {
  const user = useAuth();
  const theme = useTheme();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () =>{
    user.removeUser();
    user.signoutRedirect({
      post_logout_redirect_uri:"http://localhost:5173/"
    });
  }

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
      icon: <GroupsIcon />
    }
  ];
  const location = useLocation();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar sx={{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
      }} position="fixed" open={open}>
        <Toolbar>
          <IconButton
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
        <Button onClick={handleLogout}>Logout</Button>
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
              <Link component={ReactLink} to={route.url}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  selected={route.url === location.pathname}
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
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route path="/invoices" element={<InvoiceGrid />} />
          <Route path="/invoices/:id" element={<InvoiceView/>}/>
          <Route path="/clients" element={<ClientsGrid />} />
          <Route path="*" element={<Navigate to="/invoices" />} />
        </Routes>
      </Box>
    </Box>
  );
};
