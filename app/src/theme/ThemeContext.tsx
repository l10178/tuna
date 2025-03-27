import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode } from '@mui/material';

// 创建主题上下文
export const ColorModeContext = React.createContext({
    toggleColorMode: () => { },
    mode: 'light' as PaletteMode
});

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<PaletteMode>(() => {
        const savedMode = localStorage.getItem('themeMode');
        return (savedMode as PaletteMode) || 'light';
    });

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('themeMode', newMode);
                    return newMode;
                });
            },
            mode,
        }),
        [mode]
    );

    const theme = React.useMemo(
        () => createTheme({
            palette: {
                mode,
            },
        }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

// 自定义Hook用于访问主题上下文
export const useColorMode = () => React.useContext(ColorModeContext);