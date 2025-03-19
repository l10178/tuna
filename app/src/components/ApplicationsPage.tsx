import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// Import interesting icons
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CakeIcon from '@mui/icons-material/Cake';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CasinoIcon from '@mui/icons-material/Casino';
import FestivalIcon from '@mui/icons-material/Festival';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

import { Application } from '../api/ApplicationApi';

interface ApplicationsPageProps {
    applications: Application[];
    onNavigateToShake: () => void;
}

const getCategoryIcon = (category?: string, appName?: string) => {
    // Define color palette for icons
    const colors = {
        primary: '#3f51b5',
        secondary: '#f50057',
        food: '#ff9800',
        drink: '#4caf50',
        game: '#9c27b0',
        travel: '#03a9f4',
        baby: '#e91e63',
        sport: '#8bc34a'
    };

    // Select icon based on category and/or app name
    if (appName?.includes('吃什么')) {
        return <RestaurantIcon sx={{ fontSize: 36, color: colors.food }} />;
    }

    switch (category) {
        case '早餐':
            return <CoffeeIcon sx={{ fontSize: 36, color: colors.drink }} />;
        case '甜点':
            return <CakeIcon sx={{ fontSize: 36, color: colors.food }} />;
        case '主食':
            return <FastfoodIcon sx={{ fontSize: 36, color: colors.food }} />;
        case '点心':
            return <LocalBarIcon sx={{ fontSize: 36, color: colors.drink }} />;
        case '游戏':
            return <SportsEsportsIcon sx={{ fontSize: 36, color: colors.game }} />;
        case '抽奖':
            return <CasinoIcon sx={{ fontSize: 36, color: colors.game }} />;
        case '周末':
            return <FestivalIcon sx={{ fontSize: 36, color: colors.travel }} />;
        case '旅行':
            return <TravelExploreIcon sx={{ fontSize: 36, color: colors.travel }} />;
        case '宝宝':
            return <ChildCareIcon sx={{ fontSize: 36, color: colors.baby }} />;
        case '宠物':
            return <PetsIcon sx={{ fontSize: 36, color: colors.primary }} />;
        case '运动':
            return <DirectionsRunIcon sx={{ fontSize: 36, color: colors.sport }} />;
        default:
            // Randomly select an icon for variety when category is undefined
            const randomIcons = [
                <RestaurantIcon sx={{ fontSize: 36, color: colors.food }} />,
                <CasinoIcon sx={{ fontSize: 36, color: colors.game }} />,
                <TravelExploreIcon sx={{ fontSize: 36, color: colors.travel }} />,
                <SportsEsportsIcon sx={{ fontSize: 36, color: colors.game }} />
            ];
            // Use app id or name to consistently get the same icon for the same app
            const index = appName ? appName.length % randomIcons.length : 0;
            return randomIcons[index];
    }
};

const getIconBackground = (category?: string) => {
    // Define background colors based on category
    switch (category) {
        case '早餐':
        case '饮品':
        case '点心':
            return 'rgba(76, 175, 80, 0.1)'; // Light green
        case '甜点':
        case '主食':
            return 'rgba(255, 152, 0, 0.1)'; // Light orange
        case '游戏':
        case '抽奖':
            return 'rgba(156, 39, 176, 0.1)'; // Light purple
        case '周末':
        case '旅行':
            return 'rgba(3, 169, 244, 0.1)'; // Light blue
        case '宝宝':
            return 'rgba(233, 30, 99, 0.1)'; // Light pink
        case '宠物':
            return 'rgba(63, 81, 181, 0.1)'; // Light indigo
        case '运动':
            return 'rgba(139, 195, 74, 0.1)'; // Light light green
        default:
            return 'rgba(0, 0, 0, 0.05)'; // Light gray
    }
};

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ applications, onNavigateToShake }) => {
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredApps = applications.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Box sx={{ p: { xs: 3, md: 5 }, maxWidth: 1400, mx: 'auto' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                mb: 4
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 400,
                        color: 'text.primary',
                        letterSpacing: '-0.5px',
                        mb: { xs: 2, sm: 0 }
                    }}
                >
                    我的应用
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' },
                }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: '0px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 280 },
                            height: 44,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            '&:hover': {
                                borderColor: 'action.hover',
                            }
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        <InputBase
                            sx={{ flex: 1 }}
                            placeholder="搜索应用"
                            inputProps={{ 'aria-label': '搜索应用' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Paper>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        sx={{
                            borderRadius: 2,
                            height: 44,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: { xs: 'initial', sm: 120 }
                        }}
                    >
                        创建
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 3,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'visible',
                                    position: 'relative',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <CardActionArea
                                    sx={{
                                        flexGrow: 1,
                                        p: 2,
                                        borderRadius: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start'
                                    }}
                                    onClick={onNavigateToShake}
                                >
                                    <Box sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        mb: 2
                                    }}>
                                        <Box sx={{
                                            width: 60,
                                            height: 60,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 2,
                                            bgcolor: getIconBackground(app.category),
                                            mb: 2
                                        }}>
                                            {getCategoryIcon(app.category, app.name)}
                                        </Box>

                                        <IconButton
                                            aria-label="more options"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                console.log('More options for:', app.id);
                                            }}
                                            sx={{
                                                color: 'action.disabled',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    color: 'text.secondary'
                                                }
                                            }}
                                        >
                                            <MoreHorizIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 500,
                                            mb: 1,
                                            color: 'text.primary'
                                        }}
                                    >
                                        {app.name}
                                    </Typography>

                                    {app.description && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 2,
                                                flex: '1 0 auto',
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {app.description}
                                        </Typography>
                                    )}

                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 0.75,
                                        mt: 'auto'
                                    }}>
                                        {app.category && (
                                            <Chip
                                                label={app.category}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    bgcolor: 'background.default',
                                                    color: 'text.secondary',
                                                    border: 'none'
                                                }}
                                            />
                                        )}
                                        {app.creator && (
                                            <Chip
                                                label={`创建者: ${app.creator}`}
                                                size="small"
                                                sx={{
                                                    height: 24,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    bgcolor: 'background.default',
                                                    color: 'text.secondary',
                                                    border: 'none'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                borderRadius: 3,
                                border: '1px dashed',
                                borderColor: 'divider',
                                bgcolor: 'background.default'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                没有找到匹配的应用，请尝试其他搜索词
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ApplicationsPage; 