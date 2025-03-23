import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';
import { Application } from '../api/Modules';
import { getDatasetItems } from '../api/DatasetApi';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

interface DataItemDialogProps {
    open: boolean;
    mode: 'add' | 'edit';
    initialData: any;
    availableTags: string[];
    applicationId: string;
    onClose: () => void;
    onSave: (data: any) => void;
}

interface ApplicationDatasetEditorProps {
    application: Application | null;
    loading: boolean;
    onAddItem: (appId: string) => void;
    onEditItem: (item: any) => void;
    onDeleteConfirm: (item: any) => void;
    dataItemDialogState: {
        open: boolean;
        mode: 'add' | 'edit';
        item: any | null;
    };
    deleteDialogState: {
        open: boolean;
        item: any | null;
    };
    handleCloseItemDialog: () => void;
    handleSaveDataItem: (data: any) => void;
    handleCloseDeleteDialog: () => void;
    handleDeleteItem: () => void;
}

// 数据集表格组件
const DatasetTable = ({
    application,
    onEdit,
    onDelete
}: {
    application: Application | null;
    onEdit: (item: any) => void;
    onDelete: (item: any) => void;
}) => {
    const [datasetItems, setDatasetItems] = React.useState<any[]>([]);
    const [loadingItems, setLoadingItems] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
        const fetchDatasetItems = async () => {
            try {
                setLoadingItems(true);
                if (application && application.datasetId) {
                    // 直接使用应用关联的数据集ID
                    const items = await getDatasetItems(application.datasetId);
                    setDatasetItems(items || []);
                } else {
                    setError('应用未关联数据集');
                }
            } catch (err) {
                console.error('Error loading dataset items:', err);
                setError('无法加载数据项');
            } finally {
                setLoadingItems(false);
            }
        };

        fetchDatasetItems();
    }, [application]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(0); // 重置到第一页
    };

    // 过滤和分页数据
    const filteredItems = datasetItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    // 当前页的数据
    const currentItems = filteredItems.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loadingItems) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (datasetItems.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                暂无数据项，请点击"添加数据项"按钮创建
            </Box>
        );
    }

    return (
        <React.Fragment>
            <Box sx={{ p: 2 }}>
                <TextField
                    placeholder="搜索数据项..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <TableContainer component={Paper} sx={{
                boxShadow: 'none',
                borderRadius: 0,
                flexGrow: 1
            }}>
                <Table sx={{ minWidth: 650 }} size="medium" stickyHeader aria-label="数据集表格">
                    <TableHead>
                        <TableRow>
                            <TableCell>名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>标签</TableCell>
                            <TableCell>创建时间</TableCell>
                            <TableCell align="right">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                hover
                            >
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" fontWeight={500}>
                                        {item.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        maxWidth: 250
                                    }}>
                                        {item.description || '暂无描述'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                        {item.tags && item.tags.length > 0 ? (
                                            item.tags.map((tag: string) => (
                                                <Chip
                                                    key={tag}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(0,0,0,0.05)',
                                                        borderRadius: 1,
                                                        height: 24
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">无标签</Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString()
                                        : '未知时间'
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="编辑">
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(item)}
                                            sx={{ ml: 1 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="删除">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(item)}
                                            sx={{ ml: 1 }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredItems.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页行数:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / 共${count}项`}
            />
        </React.Fragment>
    );
};

// 数据项编辑弹窗组件
const DataItemDialog: React.FC<DataItemDialogProps> = ({
    open,
    mode,
    initialData,
    availableTags,
    applicationId,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = React.useState({
        id: '',
        applicationId: '',
        name: '',
        description: '',
        tags: [] as string[],
        createdAt: ''
    });
    const [newTag, setNewTag] = React.useState('');
    const [errors, setErrors] = React.useState<{
        name?: string;
    }>({});

    // 初始化表单数据
    React.useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || '',
                applicationId: initialData.applicationId || applicationId,
                name: initialData.name || '',
                description: initialData.description || '',
                tags: initialData.tags || [],
                createdAt: initialData.createdAt || new Date().toISOString()
            });
        }
    }, [initialData, applicationId]);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // 清除错误
        if (name === 'name' && errors.name) {
            setErrors({ ...errors, name: undefined });
        }
    };

    // 添加标签
    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, newTag.trim()]
            });
            setNewTag('');
        }
    };

    // 删除标签
    const handleDeleteTag = (tagToDelete: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToDelete)
        });
    };

    // 选择现有标签
    const handleSelectExistingTag = (tag: string) => {
        if (!formData.tags.includes(tag)) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tag]
            });
        }
    };

    // 处理保存
    const handleSave = () => {
        // 验证
        const newErrors: { name?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = '名称不能为空';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, fontWeight: 500 }}>
                {mode === 'add' ? '添加数据项' : '编辑数据项'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ p: 1 }}>
                    <TextField
                        fullWidth
                        required
                        label="名称"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        fullWidth
                        label="描述"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        sx={{ mb: 4 }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 2 }}>标签</Typography>

                    {/* 已选标签 */}
                    <Box sx={{ mb: 3 }}>
                        {formData.tags.length > 0 ? (
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                {formData.tags.map((tag) => (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => handleDeleteTag(tag)}
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                未添加标签
                            </Typography>
                        )}
                    </Box>

                    {/* 应用现有标签 */}
                    {availableTags.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>从应用标签中选择:</Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                {availableTags
                                    .filter(tag => !formData.tags.includes(tag))
                                    .map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            variant="outlined"
                                            onClick={() => handleSelectExistingTag(tag)}
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                            </Stack>
                        </Box>
                    )}

                    {/* 添加新标签 */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="添加新标签"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            sx={{ mr: 1, flex: 1 }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleAddTag}
                            disabled={!newTag.trim()}
                        >
                            添加
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} color="inherit">
                    取消
                </Button>
                <Button onClick={handleSave} variant="contained">
                    保存
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ApplicationDatasetEditor: React.FC<ApplicationDatasetEditorProps> = ({
    application,
    loading,
    onAddItem,
    onEditItem,
    onDeleteConfirm,
    dataItemDialogState,
    deleteDialogState,
    handleCloseItemDialog,
    handleSaveDataItem,
    handleCloseDeleteDialog,
    handleDeleteItem
}) => {
    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* 添加按钮 */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => application && application.id && onAddItem(application.id)}
                            sx={{ borderRadius: 2 }}
                        >
                            添加数据项
                        </Button>
                    </Box>

                    {/* 表格容器 */}
                    <Paper sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1
                    }}>
                        {application ? (
                            <DatasetTable
                                application={application}
                                onEdit={onEditItem}
                                onDelete={onDeleteConfirm}
                            />
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                                请先保存应用基本信息
                            </Box>
                        )}
                    </Paper>

                    {/* 数据项编辑弹窗 */}
                    <DataItemDialog
                        open={dataItemDialogState.open}
                        mode={dataItemDialogState.mode}
                        initialData={dataItemDialogState.item}
                        availableTags={application?.tags || []}
                        applicationId={application?.id || ''}
                        onClose={handleCloseItemDialog}
                        onSave={handleSaveDataItem}
                    />

                    {/* 删除确认弹窗 */}
                    <Dialog
                        open={deleteDialogState.open}
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        PaperProps={{
                            sx: { borderRadius: 2 }
                        }}
                    >
                        <DialogTitle id="alert-dialog-title">
                            确认删除
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">
                                确定要删除「{deleteDialogState.item?.name}」数据项吗？此操作不可撤销。
                            </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2 }}>
                            <Button onClick={handleCloseDeleteDialog} color="inherit">取消</Button>
                            <Button onClick={handleDeleteItem} color="error" variant="contained" autoFocus>
                                删除
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            )}
        </>
    );
};

export default ApplicationDatasetEditor; 