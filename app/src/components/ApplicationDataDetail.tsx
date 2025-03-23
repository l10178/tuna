import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

interface ApplicationDataDetailProps {
    open: boolean;
    handleClose: () => void;
    data: {
        id: string;
        name: string;
        category?: string;
        tags?: string[];
        [key: string]: any;
    };
    title?: string;
}

export default function ApplicationDataDetail({
    open,
    handleClose,
    data,
    title = '数据'
}: ApplicationDataDetailProps) {

    if (!data) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {data.name}
                    </Typography>

                    {data.description && (
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {data.description}
                        </Typography>
                    )}

                    {data.tags && data.tags.length > 0 && (
                        <Box sx={{ mt: 2, mb: 3 }}>
                            {data.tags.map((tag: string, index: number) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    size="small"
                                    sx={{ mr: 1, mb: 1, borderRadius: 1 }}
                                />
                            ))}
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        {Object.entries(data).map(([key, value]) => {
                            // 跳过已显示的基本属性和复杂对象
                            if (['id', 'name', 'description', 'tags'].includes(key) || typeof value === 'object') {
                                return null;
                            }

                            return (
                                <Grid item xs={6} key={key}>
                                    <Typography variant="caption" color="text.secondary" component="div">
                                        {key}
                                    </Typography>
                                    <Typography variant="body2">
                                        {String(value)}
                                    </Typography>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
} 