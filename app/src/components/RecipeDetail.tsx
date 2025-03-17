import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import './RecipeDetail.css';

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



const colorPalette = [
  '#FF6B6B',  // 红色
  '#4ECDC4',  // 青色
  '#45B7D1',  // 蓝色
  '#96CEB4',  // 绿色
  '#FFBE0B',  // 黄色
];

const rpsEmojis = ['✊', '✋', '✌'];  // 拳头、手掌、剪刀

export default function RecipeDetail({ handleClose, open, recipe }: RecipeDetailProps) {
  const randomEmoji = React.useMemo(() => (
    rpsEmojis[Math.floor(Math.random() * rpsEmojis.length)]
  ), []);

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
              恭喜您摇到了
            </Typography>
            <Typography 
              variant="h3" 
              className="recipe-detail-name"
            >
              {recipe.name}
            </Typography>
            {recipe.description && (
              <Typography 
                variant="body1" 
                className="recipe-detail-description"
              >
                {recipe.description}
              </Typography>
            )}
          </Box>

          <Box className="recipe-detail-tags">
            <Chip
              label={recipe.category}
              variant="outlined"
              className="recipe-detail-tag"
              style={{ 
                borderColor: colorPalette[0],
                color: colorPalette[0]
              }}
            />
            {recipe.tags?.map((tag, index) => (
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
