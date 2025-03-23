import * as React from 'react'
import { LuckyWheel } from '@lucky-canvas/react';
import { ShakeApi, Block, Prize, Button } from '../api/ShakeApi';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { Application } from '../api/Modules';
import { getApplicationById, getApplicationDataset } from '../api/ApplicationApi';
import ShakeDataDetail from './ShakeDataDetail';

export default function ApplicationShake() {
    const { appId } = useParams<{ appId?: string }>();
    const [currentApp, setCurrentApp] = React.useState<Application | null>(null);
    const [loading, setLoading] = React.useState<boolean>(!!appId);
    const [error, setError] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState<any>(null);
    // 数据集存储，用于查询获取详细信息
    const [datasetItems, setDatasetItems] = React.useState<any[]>([]);

    const [blocks, setBlocks] = React.useState<Block[]>([
        { padding: '10px', background: '#869cfa' }
    ]);
    const [prizes, setPrizes] = React.useState<Prize[]>([
        { background: '#e9e8fe', fonts: [{ text: '标签1', top: '40%' }] },
        { background: '#b8c5f2', fonts: [{ text: '标签2', top: '40%' }] },
        { background: '#e9e8fe', fonts: [{ text: '标签3', top: '40%' }] },
        { background: '#b8c5f2', fonts: [{ text: '标签4', top: '40%' }] },
        { background: '#e9e8fe', fonts: [{ text: '标签5', top: '40%' }] },
        { background: '#b8c5f2', fonts: [{ text: '标签6', top: '40%' }] }
    ]);
    const [buttons, setButtons] = React.useState<Button[]>([
        { radius: '40%', background: '#617df2' },
        { radius: '35%', background: '#afc4f8' },
        {
            radius: '30%',
            background: '#869cfa',
            pointer: true,
            fonts: [{ text: '摇一摇', top: '50%' }]
        }
    ]);

    // 更新浏览器标题
    React.useEffect(() => {
        if (currentApp) {
            // 设置浏览器标题为应用名称
            document.title = currentApp.name;

            // 组件卸载时恢复原标题
            return () => {
                document.title = '庄周吃鱼';
            };
        }
    }, [currentApp]);

    // 加载应用数据
    React.useEffect(() => {
        if (appId) {
            setLoading(true);
            setError(null);

            Promise.all([
                getApplicationById(appId),
                getApplicationDataset(appId)
            ])
                .then(([app, dataset]) => {
                    setCurrentApp(app);
                    setDatasetItems(dataset || []);

                    // 如果有应用数据，根据应用标签自定义轮盘选项
                    if (app && app.tags && app.tags.length > 0) {
                        // 使用应用标签作为轮盘选项
                        const customPrizes = app.tags.map((tag, index) => ({
                            background: index % 2 === 0 ? '#e9e8fe' : '#b8c5f2',
                            fonts: [{ text: tag, top: '40%' }]
                        }));
                        if (customPrizes.length > 0) {
                            setPrizes(customPrizes);
                        }
                    }
                })
                .catch(error => {
                    console.error('加载应用数据失败:', error);
                    setError('无法加载应用数据，请稍后再试');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [appId]);

    React.useEffect(() => {
        ShakeApi.getConfig().then(config => {
            // 使用默认配置
            const defaultConfig = {
                blocks,
                prizes,
                buttons
            };
            // 合并配置
            const mergedConfig = {
                ...defaultConfig,
                ...config
            };
            // 更新状态
            if (mergedConfig.blocks) setBlocks(mergedConfig.blocks);
            if (mergedConfig.prizes) setPrizes(mergedConfig.prizes);
            if (mergedConfig.buttons) setButtons(mergedConfig.buttons);
        });
    }, [blocks, prizes, buttons]);

    const handleDetailOpen = async (selectedPrize: Prize, prizeIndex: number) => {
        try {
            const tagName = selectedPrize.fonts?.[0]?.text;

            if (!tagName || !appId) {
                // 无标签或应用ID时使用默认数据
                setSelectedData({
                    id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                    name: tagName || '未知标签',
                    category: currentApp?.name || '应用',
                    description: `应用 "${currentApp?.name || ''}" 的标签内容`,
                    tags: currentApp?.tags || []
                });
                setOpen(true);
                return;
            }

            // 首先尝试从已加载的数据集中查找匹配标签的数据
            const matchingItems = datasetItems.filter(item =>
                item.tags && Array.isArray(item.tags) && item.tags.includes(tagName)
            );

            if (matchingItems.length > 0) {
                // 如果找到匹配的数据项，随机选择一个
                const randomItem = matchingItems[Math.floor(Math.random() * matchingItems.length)];
                setSelectedData(randomItem);
                setOpen(true);
                return;
            }

            // 如果本地没有找到匹配的数据，则尝试重新获取全部数据集并过滤
            if (datasetItems.length === 0) {
                const allDataItems = await getApplicationDataset(appId);
                setDatasetItems(allDataItems);

                // 过滤包含所选标签的数据项
                const filteredItems = allDataItems.filter(item =>
                    item.tags && Array.isArray(item.tags) && item.tags.includes(tagName)
                );

                if (filteredItems.length > 0) {
                    const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
                    setSelectedData(randomItem);
                    setOpen(true);
                    return;
                }
            }

            // 无匹配数据时使用默认数据
            setSelectedData({
                id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                name: tagName || '未知标签',
                category: currentApp?.name || '应用',
                description: `暂无数据: "${tagName}" 标签下没有数据项`,
                tags: [tagName].filter(Boolean)
            });

            setOpen(true);
        } catch (error) {
            console.error('获取数据集失败:', error);
            // 错误时使用默认数据
            setSelectedData({
                id: `${currentApp?.id || 'app'}_${prizeIndex}`,
                name: selectedPrize.fonts?.[0]?.text || '未知标签',
                category: currentApp?.name || '应用',
                description: '获取数据失败，请稍后再试',
                tags: currentApp?.tags || []
            });
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const myLucky = React.useRef<any>(null);

    const handleStart = () => {
        // 开始旋转
        return new Promise<number>((resolve) => {
            const index = Math.floor(Math.random() * prizes.length);
            myLucky.current.play();
            setTimeout(() => {
                myLucky.current.stop(index);
                // 记录选中的奖品
                const selectedPrize = prizes[index];
                setTimeout(() => handleDetailOpen(selectedPrize, index), 2500);
            }, 2500);
            resolve(index);
        });
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Skeleton variant="rectangular" sx={{ height: 380, width: 380, mx: 'auto', borderRadius: 2 }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div className="LuckyWheel">
                <LuckyWheel
                    ref={myLucky}
                    width="380px"
                    height="380px"
                    blocks={blocks}
                    prizes={prizes}
                    buttons={buttons}
                    onStart={handleStart}
                    defaultStyle={{
                        fontSize: '18px',
                        fontWeight: 600,
                    }}
                    defaultConfig={{
                        stopRange: 0.8,
                        accelerationTime: 2500,
                        decelerationTime: 2500,
                        speed: 8
                    }}
                />
                {selectedData && (
                    <ShakeDataDetail
                        handleClose={handleClose}
                        open={open}
                        data={selectedData}
                        title={`${currentApp?.name || '应用'}`}
                    />
                )}
            </div>
        </Box>
    );
} 