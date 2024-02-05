import React from "react";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import { useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AppBar from "./components/app-bar";
import Drawer from "./components/bar-drawer";
import DrawerHeader from "./components/bar-drawer-header";
import { BrowserRouter, Link as ReactLink, Route, Routes } from "react-router-dom";
import { InvoiceGrid } from "./components/grid";
import { Link } from "@mui/material";

function App() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const oidConfig : AuthProviderProps = {
    authority:"https://localhost:8443/realms/DocsManagement",
    client_id: "DocsManagementReact",
    redirect_uri: "http://localhost:5173", 
    onSigninCallback: () => {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      )
    }
  }
const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (

    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['component used to render a link when the href prop is provided.Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <Link component={ReactLink} to={"/docs"}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader/>
            <Routes>
              <Route path="/" element={<div>Hello World!</div>} />
              <Route path="/docs" element={<InvoiceGrid/>}/>
            </Routes>
      </Box>
    </Box>

  );/*
    <div>
      <AuthProvider {...oidConfig}>
        <React.StrictMode>
          <BrowserRouter>
            <Routes>
              <Route path="/docs" element={<DocumentForm />} />
            </Routes>
          </BrowserRouter>
        </React.StrictMode>
      </AuthProvider>
    </div>
  );
  */
}

export default App;
