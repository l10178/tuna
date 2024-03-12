import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import GavelIcon from '@mui/icons-material/Gavel';
import FolderIcon from '@mui/icons-material/Folder';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function RecipeDetail(props) {
    const { handleClose, recipe, open } = props;
    const [fullWidth] = React.useState(true);
    const [maxWidth] = React.useState('md');
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                TransitionComponent={Transition}
            >
                <DialogTitle><GavelIcon color="success" fontSize="large" />{recipe.name}</DialogTitle>
                <DialogContent>
                    {/* <img src={recipe.img}></img> */}
                    {/* 遍历输出所有属性 菜谱名字、分类、时间  描述、图片、用料 地址、Tags */}
                    <List>
                        {Object.keys(recipe).map((key, index) => {
                            return (
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <FolderIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={key} />
                                    <ListItemText primary={recipe[key]} />
                                </ListItem>
                            );
                        })}
                    </List>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}