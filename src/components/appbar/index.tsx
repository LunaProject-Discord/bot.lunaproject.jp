import { AppBar as MuiAppBar, AppBarProps, styled, Toolbar as MuiToolbar } from '@mui/material';

export const AppBar = styled(
    (props: AppBarProps) => <MuiAppBar position="fixed" color="default" elevation={0} {...props} />
)<AppBarProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[800],
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.up('md')]: {
        display: 'none'
    }
}));

export const Toolbar = styled(MuiToolbar)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(0, 1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(0, 1)
    }
}));
