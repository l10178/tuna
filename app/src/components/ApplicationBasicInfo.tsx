import * as React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import { getIconBackground } from './ApplicationCard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FestivalIcon from '@mui/icons-material/Festival';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Application } from '../api/Modules';

// 应用图标列表
const APP_ICONS = [
    { icon: <SmartToyIcon />, name: '机器人', color: '#3f51b5' },
    { icon: <RestaurantIcon />, name: '餐饮', color: '#ff9800' },
    { icon: <SportsEsportsIcon />, name: '游戏', color: '#9c27b0' },
    { icon: <TravelExploreIcon />, name: '探索', color: '#03a9f4' },
    { icon: <EngineeringIcon />, name: '工程', color: '#4caf50' },
    { icon: <FestivalIcon />, name: '娱乐', color: '#f50057' }
];

interface ApplicationBasicInfoProps {
    application: Application | null;
    name: string;
    description: string;
    tags: string[];
    selectedIconIndex: number;
    newTag: string;
    saving?: boolean;
    onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onIconSelect: (index: number) => void;
    onAddTag: () => void;
    onDeleteTag: (tag: string) => void;
    onNewTagChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onNewTagKeyDown: (event: React.KeyboardEvent) => void;
    onSave?: () => void;
}

const ApplicationBasicInfo: React.FC<ApplicationBasicInfoProps> = ({
    application,
    name,
    description,
    tags,
    selectedIconIndex,
    newTag,
    saving = false,
    onNameChange,
    onDescriptionChange,
    onIconSelect,
    onAddTag,
    onDeleteTag,
    onNewTagChange,
    onNewTagKeyDown,
    onSave
}) => {
    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {/* 图标选择器 */}
            <Box sx={{ mb: 5, alignContent: 'left' }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, alignContent: 'left' }}>
                    应用图标
                </Typography>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                    {APP_ICONS.map((iconObj, index) => (
                        <Grid key={index}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: getIconBackground(index),
                                    color: iconObj.color,
                                    cursor: 'pointer',
                                    border: index === selectedIconIndex ? `2px solid ${iconObj.color}` : 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.08)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }
                                }}
                                onClick={() => onIconSelect(index)}
                            >
                                {React.cloneElement(iconObj.icon, { sx: { fontSize: 28 } })}
                            </Avatar>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* 名称输入 */}
            <TextField
                fullWidth
                required
                id="app-name"
                label="应用名称"
                variant="outlined"
                value={name}
                onChange={onNameChange}
                sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5
                    }
                }}
            />

            {/* 描述输入 */}
            <TextField
                fullWidth
                id="app-description"
                label="应用描述"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={onDescriptionChange}
                sx={{
                    mb: 5,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5
                    }
                }}
            />

            {/* 标签管理 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    标签
                </Typography>

                {/* 标签列表 */}
                {tags.length > 0 ? (
                    <Box sx={{ mb: 3 }}>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            {tags.map(tag => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => onDeleteTag(tag)}
                                    sx={{
                                        mb: 1,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(0, 0, 0, 0.05)',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.08)'
                                        }
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        暂无标签
                    </Typography>
                )}

                {/* 添加标签 */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="添加标签"
                        value={newTag}
                        onChange={onNewTagChange}
                        onKeyDown={onNewTagKeyDown}
                        sx={{
                            mr: 1,
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5
                            }
                        }}
                    />
                    <Button
                        variant="outlined"
                        onClick={onAddTag}
                        disabled={!newTag.trim()}
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none'
                        }}
                    >
                        添加
                    </Button>
                </Box>
            </Box>

            {/* 保存按钮 */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={onSave}
                    disabled={saving || !onSave}
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        py: 1
                    }}
                >
                    {saving ? '保存中...' : '保存'}
                </Button>
            </Box>
        </Box>
    );
};

export default ApplicationBasicInfo; 