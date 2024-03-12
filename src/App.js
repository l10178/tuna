import './App.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GitHubIcon from '@mui/icons-material/GitHub';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import RecipeShake from './RecipeShake';

import { getCatalogs } from './RecipeApi';

function App() {

  const [catalogs] = React.useState(getCatalogs());

  const [openMenu, setOpenMenu] = React.useState(false);

  const handleOpenSelect = () => {
    setOpenMenu(true);
  };

  const handleCloseSelect = () => {
    setOpenMenu(false);
  };


  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              onClick={handleOpenSelect}
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>
            <Link color="inherit" href="https://github.com/l10178/tuna" target="_blank">
              <GitHubIcon />
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer open={openMenu} onClose={handleCloseSelect}>
        <Box sx={{ width: 360 }} role="presentation" onClick={handleCloseSelect}>
          <Divider />
          <List>
            {catalogs.map((catalog, index) => (
              <ListItem key={catalog.id} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <RestaurantMenuIcon/>
                  </ListItemIcon>
                  <ListItemText primary={catalog.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <RecipeShake></RecipeShake>
    </div>
  );
}

export default App;
