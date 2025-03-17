import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { keyframes } from '@mui/system';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
}

interface RecipeDetailProps {
  handleClose: () => void;
  open: boolean;
  recipe: Recipe;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const colorPalette = [
  '#FF6B6B',  // 红色
  '#4ECDC4',  // 青色
  '#45B7D1',  // 蓝色
  '#96CEB4',  // 绿色
  '#FFBE0B',  // 黄色
];

export default function RecipeDetail({ handleClose, open, recipe }: RecipeDetailProps) {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1)'
          }
        }
      }}
    >
      <DialogContent>
        <Box
          sx={{
            position: 'relative',
            animation: `${fadeIn} 0.4s ease-out`,
            p: 2
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box 
            sx={{ 
              textAlign: 'center',
              mb: 4,
              pt: 2,
              position: 'relative',
              '&::after': {
                content: '"\u{1F389}"',  // 庆祝表情
                position: 'absolute',
                top: -10,
                right: -10,
                fontSize: '2rem',
                transform: 'rotate(15deg)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2,
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              恭喜您摇到了
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: '10%',
                  width: '80%',
                  height: 4,
                  background: 'linear-gradient(90deg, transparent, #4ECDC4, transparent)',
                  borderRadius: 2
                }
              }}
            >
              {recipe.name}
            </Typography>
            {recipe.description && (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                {recipe.description}
              </Typography>
            )}
          </Box>

          <Box 
            sx={{ 
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              mb: 3,
              flexWrap: 'wrap'
            }}
          >
            <Chip
              label={recipe.category}
              sx={{ 
                minWidth: 80,
                borderColor: colorPalette[0],
                color: colorPalette[0],
                fontWeight: 'bold'
              }}
              variant="outlined"
            />
            {recipe.tags?.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="medium"
                variant="outlined"
                sx={{ 
                  minWidth: 80,
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
