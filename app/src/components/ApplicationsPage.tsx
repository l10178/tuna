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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WorkIcon from '@mui/icons-material/Work';

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
        sport: '#8bc34a',
        work: '#607d8b'
    };

    // Select icon based on app name first (for special cases)
    if (appName) {
        if (appName.includes('吃什么')) {
            return <RestaurantIcon sx={{ fontSize: 40, color: colors.food }} />;
        }
        if (appName.includes('Dify') || appName.includes('dify')) {
            return <SmartToyIcon sx={{ fontSize: 40, color: colors.primary }} />;
        }
        if (appName.includes('聚群') || appName.includes('粉丝')) {
            return <WorkIcon sx={{ fontSize: 40, color: colors.work }} />;
        }
    }

    // Then check category
    switch (category) {
        case '早餐':
            return <CoffeeIcon sx={{ fontSize: 40, color: colors.drink }} />;
        case '甜点':
            return <CakeIcon sx={{ fontSize: 40, color: colors.food }} />;
        case '主食':
            return <FastfoodIcon sx={{ fontSize: 40, color: colors.food }} />;
        case '点心':
            return <LocalBarIcon sx={{ fontSize: 40, color: colors.drink }} />;
        case '游戏':
            return <SportsEsportsIcon sx={{ fontSize: 40, color: colors.game }} />;
        case '抽奖':
            return <CasinoIcon sx={{ fontSize: 40, color: colors.game }} />;
        case '周末':
            return <FestivalIcon sx={{ fontSize: 40, color: colors.travel }} />;
        case '旅行':
            return <TravelExploreIcon sx={{ fontSize: 40, color: colors.travel }} />;
        case '宝宝':
            return <ChildCareIcon sx={{ fontSize: 40, color: colors.baby }} />;
        case '宠物':
            return <PetsIcon sx={{ fontSize: 40, color: colors.primary }} />;
        case '运动':
            return <DirectionsRunIcon sx={{ fontSize: 40, color: colors.sport }} />;
        case '工作流':
            return <EngineeringIcon sx={{ fontSize: 40, color: colors.work }} />;
        default:
            // Randomly select an icon for variety when category is undefined
            const randomIcons = [
                <RestaurantIcon sx={{ fontSize: 40, color: colors.food }} />,
                <CasinoIcon sx={{ fontSize: 40, color: colors.game }} />,
                <TravelExploreIcon sx={{ fontSize: 40, color: colors.travel }} />,
                <SportsEsportsIcon sx={{ fontSize: 40, color: colors.game }} />
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
        case '工作流':
            return 'rgba(96, 125, 139, 0.1)'; // Light blue grey
        default:
            return 'rgba(0, 0, 0, 0.05)'; // Light gray
    }
};

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ applications, onNavigateToShake }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedApp, setSelectedApp] = React.useState<string | null>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appId: string) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedApp(appId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedApp(null);
    };

    // Add sample applications from image if no applications exist
    const sampleApps: Application[] = [
        ...applications
    ];

    const filteredApps = sampleApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.description && app.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
            {/* Header section with search and create button */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
            }}>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        display: { xs: 'none', sm: 'block' }
                    }}
                >
                    我的应用
                </Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    width: { xs: '100%', sm: 'auto' },
                }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: '0px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            width: { xs: '100%', sm: 220 },
                            height: 36,
                            borderRadius: '20px',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
                        <InputBase
                            sx={{ flex: 1, fontSize: '0.875rem' }}
                            placeholder="搜索"
                            inputProps={{ 'aria-label': '搜索' }}
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </Paper>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        sx={{
                            borderRadius: '20px',
                            height: 36,
                            px: 2,
                            textTransform: 'none',
                            fontWeight: 'normal',
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        创建应用
                    </Button>
                </Box>
            </Box>

            {/* Application grid */}
            {filteredApps.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredApps.map((app) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    '&:hover': {
                                        borderColor: 'primary.light',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <CardActionArea
                                    onClick={onNavigateToShake}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        {/* App Icon and Type Tag */}
                                        <Box sx={{ display: 'flex', mb: 1.5 }}>
                                            <Box sx={{ 
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: getIconBackground(app.category),
                                                mr: 1.5,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}>
                                                {getCategoryIcon(app.category, app.name)}
                                                {app.type === 'internal' && (
                                                    <Box
                                                        sx={{ 
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            bgcolor: 'rgba(63, 81, 181, 0.9)',
                                                            borderRadius: '6px 0 0 0',
                                                            p: 0.3,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <WorkIcon sx={{ fontSize: 14, color: 'white' }} />
                                                    </Box>
                                                )}
                                            </Box>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography 
                                                    variant="caption"
                                                    sx={{ 
                                                        color: app.category === '工作流' ? 'primary.main' : 'text.primary',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.7rem',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor: app.category === '工作流' ? 'rgba(63, 81, 181, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {app.category || 'AGENT'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* App Title */}
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                                            {app.name}
                                        </Typography>

                                        {/* App Description */}
                                        <Typography variant="body2" color="text.secondary" sx={{
                                            fontSize: '0.8rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            lineHeight: 1.5
                                        }}>
                                            {app.description}
                                        </Typography>
                                    </Box>

                                    {/* Footer with tag and action buttons */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            mt: 'auto',
                                            pt: 2
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <LocalOfferIcon sx={{ color: 'text.secondary', fontSize: 16, mr: 0.5 }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                                {app.type === 'internal' ? '内部工具' : app.creator ? `创建者: ${app.creator}` : '内部工具'}
                                            </Typography>
                                        </Box>

                                        {/* Action Buttons */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, app.id)}
                                            sx={{ 
                                                padding: 0.5,
                                                color: 'text.secondary',
                                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)', color: 'text.primary' }
                                            }}
                                        >
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider',
                            bgcolor: 'background.default',
                            mt: 2
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            没有找到匹配的应用
                        </Typography>
                    </Paper>
            )}

            {/* Menu for card options */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        elevation: 2,
                        sx: {
                            minWidth: 180,
                            borderRadius: 1,
                            mt: 0.5
                        }
                    }
                }}
            >
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>编辑信息</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>复制</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>导出</MenuItem>
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main', fontSize: '0.875rem' }}>删除</MenuItem>
            </Menu>
        </Box>
    );
};

export default ApplicationsPage; 