import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

interface RecipeDetailProps {
  handleClose: () => void;
  open: boolean;
  recipe: Recipe;
}

export default function RecipeDetail({ handleClose, open, recipe }: RecipeDetailProps) {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {recipe.name}
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        {recipe.description && (
          <Typography gutterBottom>
            {recipe.description}
          </Typography>
        )}
        {recipe.ingredients && (
          <>
            <Typography variant="h6" gutterBottom>
              食材
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        {recipe.steps && (
          <>
            <Typography variant="h6" gutterBottom>
              步骤
            </Typography>
            <List>
              {recipe.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${step}`} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
