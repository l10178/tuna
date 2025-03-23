import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import '../components/RecipeDetail.css';

interface ApplicationDataDetailProps {
    open: boolean;
    handleClose: () => void;
    data: {
        id: string;
        name: string;
        category?: string;
        description?: string;
        tags?: string[];
        [key: string]: any;
    };
    title?: string;
}

const colorPalette = [
    '#FF6B6B',  // 红色
    '#4ECDC4',  // 青色
    '#45B7D1',  // 蓝色
    '#96CEB4',  // 绿色
    '#FFBE0B',  // 黄色
];

const emojis = ['✨', '🎲', '🎯', '🎪', '🎮', '🎭', '🎨'];

export default function ApplicationDataDetail({
    open,
    handleClose,
    data,
    title = '数据'
}: ApplicationDataDetailProps) {
    // 生成随机表情
    const randomEmoji = React.useMemo(() => (
        emojis[Math.floor(Math.random() * emojis.length)]
    ), []);

    // 确保数据存在
    if (!data) {
        return null;
    }

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClick={handleClose}
            BackdropProps={{ className: 'recipe-detail-dialog' }}
            PaperProps={{ className: 'recipe-detail-paper' }}
        >
            <DialogContent>
                <Box className="recipe-detail-content">
                    <Box
                        className="recipe-detail-header"
                        data-emoji={randomEmoji}
                    >
                        <Typography
                            variant="h6"
                            className="recipe-detail-title"
                        >
                            恭喜您获得
                        </Typography>
                        <Typography
                            variant="h3"
                            className="recipe-detail-name"
                        >
                            {data.name}
                        </Typography>
                        {data.description && (
                            <Typography
                                variant="body1"
                                className="recipe-detail-description"
                            >
                                {data.description}
                            </Typography>
                        )}
                    </Box>

                    <Box className="recipe-detail-tags">
                        {data.category && (
                            <Chip
                                label={data.category}
                                variant="outlined"
                                className="recipe-detail-tag"
                                style={{
                                    borderColor: colorPalette[0],
                                    color: colorPalette[0]
                                }}
                            />
                        )}
                        {data.tags?.map((tag: string, index: number) => (
                            <Chip
                                key={index}
                                label={tag}
                                variant="outlined"
                                className="recipe-detail-tag"
                                style={{
                                    borderColor: colorPalette[(index + 1) % colorPalette.length],
                                    color: colorPalette[(index + 1) % colorPalette.length]
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
} 