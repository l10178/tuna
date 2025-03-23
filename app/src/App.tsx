import './App.css';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExploreIcon from '@mui/icons-material/Explore';
import Button from '@mui/material/Button';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

import ApplicationShake from './components/ApplicationShake';
import ApplicationsPage from './components/ApplicationsPage';
import ExplorePage from './components/ExplorePage';
import ApplicationEditor from './components/ApplicationEditor';
import logoImage from './logo.svg';

function App() {
  const navigate = useNavigate();

  const handleNavigate = (section: 'shake' | 'apps' | 'explore') => {
    switch (section) {
      case 'apps':
        navigate('/');
        break;
      case 'explore':
        navigate('/explore');
        break;
      case 'shake':
        navigate('/shake');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" enableColorOnDark>
          <Toolbar>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => handleNavigate('apps')}
            >
              <img
                src={logoImage}
                alt="Logo"
                style={{
                  height: 32,
                  marginRight: 8
                }}
              />
              <Typography
                variant="h6"
                component="div"
              >
                庄周吃鱼
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Button
                size="large"
                color="inherit"
                startIcon={<SmartToyIcon />}
                onClick={() => handleNavigate('apps')}
                sx={{ mx: 3 }}
              >
                应用
              </Button>
              <Button
                size="large"
                color="inherit"
                startIcon={<ExploreIcon />}
                onClick={() => handleNavigate('explore')}
                sx={{ mx: 3 }}
              >
                探索
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Link color="inherit" href="https://github.com/l10178/tuna" target="_blank">
              <GitHubIcon />
            </Link>
          </Toolbar>
        </AppBar>
      </Box>

      <Routes>
        <Route path="/" element={<ApplicationsPage onNavigateToShake={() => handleNavigate('shake')} />} />
        <Route path="/app/editor/:appId" element={<ApplicationEditor />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/shake" element={<ApplicationShake />} />
        <Route path="/shake/:appId" element={<ApplicationShake />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
