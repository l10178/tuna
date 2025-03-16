import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from 'wasp/client/operations'
import { getRandomRecipe } from 'wasp/client/operations'
import './ShakePageStyles.css' // 引入外部CSS文件

type Recipe = {
    id: number
    name: string
    description?: string
    category: string
    tags: string[]
}

type GameChoice = 'rock' | 'scissors' | 'paper';

export function ShakePage() {
    const [isShaking, setIsShaking] = useState(false)
    const [lastShake, setLastShake] = useState(0)
    const [showAnimation, setShowAnimation] = useState(false)
    const [animationStep, setAnimationStep] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [showFlash, setShowFlash] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogStage, setDialogStage] = useState<'spinning' | 'result' | 'closed'>('closed')
    const [gameChoice, setGameChoice] = useState<GameChoice | null>(null)
    const animationTimerRef = useRef<NodeJS.Timeout | null>(null)
    const resultRef = useRef<HTMLDivElement>(null)

    const { data, isLoading, refetch } = useQuery(getRandomRecipe)
    const recipe = data as Recipe | undefined

    // 随机食物选项，用于动画过程中展示
    const foodOptions = [
        '火锅', '烤肉', '寿司', '披萨', '汉堡',
        '意面', '沙拉', '炒饭', '烧烤', '麻辣烫',
        '冒菜', '面条', '盖饭', '便当', '煲仔饭'
    ]

    // 清理动画计时器
    const clearAnimationTimer = () => {
        if (animationTimerRef.current) {
            clearTimeout(animationTimerRef.current)
            animationTimerRef.current = null
        }
    }

    // 开始动画
    const startAnimation = () => {
        clearAnimationTimer()
        setShowDialog(true)
        setDialogStage('spinning')
        setShowResult(false)
        setShowAnimation(true)
        setAnimationStep(0)

        // 生成随机的石头剪刀布结果
        generateRandomGameChoice()

        // 快速切换食物选项的动画
        const animateOptions = (step: number) => {
            if (step < 15) {
                setAnimationStep(step)
                // 速度逐渐变慢
                const delay = 100 + step * 30
                animationTimerRef.current = setTimeout(() => {
                    animateOptions(step + 1)
                }, delay)
            } else {
                // 动画结束，显示结果
                setShowAnimation(false)
                setShowFlash(true)
                setTimeout(() => {
                    setShowFlash(false)
                    setShowResult(true)
                    setDialogStage('result')
                    // 添加结果出现时的动画效果
                    if (resultRef.current) {
                        resultRef.current.classList.add('shake')
                        setTimeout(() => {
                            if (resultRef.current) {
                                resultRef.current.classList.remove('shake')
                            }
                        }, 800)
                    }
                }, 300)
            }
        }

        animateOptions(0)
    }

    // 关闭对话框
    const closeDialog = () => {
        setShowDialog(false)
        setDialogStage('closed')
    }

    // 生成随机的石头剪刀布选择
    const generateRandomGameChoice = () => {
        const choices: GameChoice[] = ['rock', 'scissors', 'paper'];
        const choice = choices[Math.floor(Math.random() * choices.length)];
        setGameChoice(choice);
    }

    useEffect(() => {
        // 检查是否在浏览器环境
        if (typeof window === 'undefined') return

        // 摇动检测的阈值
        const SHAKE_THRESHOLD = 15
        // 上次摇动的时间
        let lastTime = 0
        // 上次的加速度值
        let lastX = 0, lastY = 0, lastZ = 0

        const handleMotion = (event: DeviceMotionEvent) => {
            const acceleration = event.accelerationIncludingGravity
            if (!acceleration) return

            const currentTime = new Date().getTime()
            // 至少间隔100ms才检测
            if ((currentTime - lastTime) > 100) {
                const diffTime = currentTime - lastTime
                lastTime = currentTime

                const x = acceleration.x || 0
                const y = acceleration.y || 0
                const z = acceleration.z || 0

                const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000

                if (speed > SHAKE_THRESHOLD) {
                    const now = Date.now()
                    if (now - lastShake > 2000) { // 防止频繁触发
                        setIsShaking(true)
                        setLastShake(now)
                        handleShake()
                        setTimeout(() => setIsShaking(false), 1000)
                    }
                }

                lastX = x
                lastY = y
                lastZ = z
            }
        }

        window.addEventListener('devicemotion', handleMotion)

        // 添加防止滚动的事件监听
        const preventScroll = (e: Event) => {
            e.preventDefault();
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            window.removeEventListener('devicemotion', handleMotion)
            document.removeEventListener('touchmove', preventScroll);
            document.body.style.overflow = '';
            clearAnimationTimer()
        }
    }, [lastShake])

    // 处理摇一摇事件
    const handleShake = () => {
        if (showAnimation) return // 如果动画正在进行，不要重复触发
        startAnimation()
        refetch()
    }

    // 渲染游戏图标
    const renderGameIcon = (type: GameChoice | null) => {
        if (!type) return null;

        switch (type) {
            case 'rock':
                return (
                    <div className="game-icon-simple" title="石头">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477z" />
                        </svg>
                    </div>
                );
            case 'scissors':
                return (
                    <div className="game-icon-simple" title="剪刀">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M8.128 9.155a3.751 3.751 0 11.713-1.321l1.136.656a.75.75 0 01.222 1.104l-.006.007a.75.75 0 01-1.032.157l-.818-.473a3.751 3.751 0 01-.215-.136zm7.345 0a3.75 3.75 0 11.713-1.321l1.136.656a.75.75 0 01.222 1.104l-.006.007a.75.75 0 01-1.032.157l-.818-.473a3.751 3.751 0 01-.215-.136zM4.875 9.75a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zm10.5 0a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'paper':
                return (
                    <div className="game-icon-simple" title="布">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
                            <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="shake-page">
            <div className="shake-container">
                <div className="shake-header">
                    <h1 className="shake-title">摇一摇吃什么</h1>
                    {gameChoice && (
                        <div className="shake-game-icon">
                            {renderGameIcon(gameChoice)}
                        </div>
                    )}
                </div>

                <div className="shake-content">
                    {!showResult && !showDialog ? (
                        <div className="shake-intro">
                            <div className="shake-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
                                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                </svg>
                            </div>
                            <h2 className="shake-subtitle">今天想吃什么？</h2>
                            <p className="shake-description">
                                不知道吃什么？摇一摇手机或点击下方按钮，让我们为您随机推荐美食！
                            </p>
                        </div>
                    ) : showResult && !showDialog ? (
                        <div
                            ref={resultRef}
                            className="shake-result"
                        >
                            {isLoading ? (
                                <div className="shake-loading">加载中...</div>
                            ) : recipe ? (
                                <div className="shake-recipe animate-fadeIn">
                                    <h2 className="recipe-name">{recipe.name}</h2>
                                    {recipe.description && (
                                        <p className="recipe-description">{recipe.description}</p>
                                    )}
                                    <div className="recipe-tags">
                                        {recipe.tags?.map((tag: string) => (
                                            <span key={tag} className="recipe-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="shake-no-result">
                                    没有找到食谱，请添加一些选项
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                <button
                    onClick={handleShake}
                    disabled={showAnimation}
                    className={`shake-button ${isShaking ? 'shaking' : ''} ${showAnimation ? 'disabled' : ''}`}
                >
                    <div className="shake-button-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clipRule="evenodd" />
                        </svg>
                        {showAnimation ? '选择中...' : '摇一摇'}
                    </div>
                </button>
            </div>

            {/* 全屏对话框 */}
            {showDialog && (
                <div className="shake-dialog">
                    <div className="dialog-content">
                        {/* 关闭按钮 */}
                        {dialogStage === 'result' && (
                            <button
                                onClick={closeDialog}
                                className="dialog-close"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}

                        {/* 动画过程 */}
                        {dialogStage === 'spinning' && (
                            <div className="dialog-spinning">
                                <div className="food-wheel-container">
                                    <div className="food-wheel">
                                        {foodOptions.map((food, index) => (
                                            <div
                                                key={index}
                                                className="food-item"
                                                style={{
                                                    transform: `rotate(${index * (360 / foodOptions.length)}deg) translateY(-120px)`,
                                                    opacity: index === animationStep % foodOptions.length ? 1 : 0.3
                                                }}
                                            >
                                                {food}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="food-wheel-center"></div>
                                    <div className="food-wheel-pointer"></div>
                                </div>
                                <div className="spinning-text">
                                    正在选择美食...
                                </div>
                            </div>
                        )}

                        {/* 闪光效果 */}
                        {showFlash && (
                            <div className="dialog-flash"></div>
                        )}

                        {/* 最终结果 */}
                        {dialogStage === 'result' && recipe && (
                            <div
                                ref={resultRef}
                                className="dialog-result"
                            >
                                <div className="result-card">
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>
                                    <div className="result-confetti"></div>

                                    <div className="result-content">
                                        {/* 石头剪刀布图标 - 全屏对话框版 */}
                                        {gameChoice && (
                                            <div className="game-icon-position">
                                                {renderGameIcon(gameChoice)}
                                            </div>
                                        )}

                                        <h2 className="result-title">今天吃什么？</h2>
                                        <div className="result-name">{recipe.name}</div>
                                        {recipe.description && (
                                            <p className="result-description">{recipe.description}</p>
                                        )}
                                        <div className="result-tags">
                                            {recipe.tags?.map((tag: string) => (
                                                <span key={tag} className="result-tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
} 