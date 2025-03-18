import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import { User } from '../api/UserApi';

interface UserSettingsProps {
    user: User | null;
    onBack: () => void;
    onSave: (user: User) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user, onBack, onSave }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            onSave({
                ...user,
                name,
                email
            });
        }
    };

    if (!user) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5">No user selected</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mt: 2 }}>
                    Back
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <IconButton onClick={onBack} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5">用户设置</Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="用户名"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        type="email"
                    />
                    <TextField
                        fullWidth
                        label="用户ID"
                        value={user.id}
                        margin="normal"
                        disabled
                    />

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={onBack} sx={{ mr: 1 }}>
                            取消
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            保存
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default UserSettings; 