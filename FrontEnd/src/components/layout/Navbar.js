import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ComputerIcon from '@mui/icons-material/Computer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { keyframes } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import EMSLogoPattern from './LogoConfig';
import SideNavigation, { DrawerHeader as NavDrawerHeader } from './SideNavigation';
import NotificationService from '../../services/NotificationService';

const drawerWidth = 240;

// spin animation for settings icon
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const spinReverse = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
`;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = NavDrawerHeader;

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang, setLang } = useI18n();
  const { theme: appTheme, setTheme: setAppTheme } = useAppTheme();
  const [open, setOpen] = React.useState(false);
  const [settingsAnchorEl, setSettingsAnchorEl] = React.useState(null);
  const [userAnchorEl, setUserAnchorEl] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [notifCount, setNotifCount] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const summary = await NotificationService.getSummary();
        if (mounted) setNotifCount(summary?.unreadCount || 0);
      } catch {
        // ignore
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { mounted = false; clearInterval(id); };
  }, []);
  const [spinCount, setSpinCount] = React.useState(0);
  const [spinReverseMode, setSpinReverseMode] = React.useState(false);

  const navigationItems = [
  { name: t('dashboard'), href: '/dashboard', icon: <DashboardIcon /> },
    { name: t('employees'), href: '/employees', icon: <PeopleIcon /> },
    { name: t('departments'), href: '/departments', icon: <ApartmentIcon /> },
    { name: t('reports'), href: '/reports', icon: <BarChartIcon /> },
  ];

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const openSettings = Boolean(settingsAnchorEl);
  const openUser = Boolean(userAnchorEl);
  const handleOpenSettings = (e) => setSettingsAnchorEl(e.currentTarget);
  const handleCloseSettings = () => setSettingsAnchorEl(null);
  const handleSettingsIconClick = (e) => {
    // trigger one full spin and toggle the settings menu
    setSpinReverseMode(openSettings);
    setSpinCount((c) => c + 1);
    if (openSettings) {
      handleCloseSettings();
    } else {
      handleOpenSettings(e);
    }
  };
  const handleOpenUser = (e) => setUserAnchorEl(e.currentTarget);
  const handleCloseUser = () => setUserAnchorEl(null);
  const triggerSearch = () => {
    const q = (searchText || '').trim();
    if (q.length > 0) {
      navigate(`/employees?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/employees');
    }
  };

  return (
    <Box sx={{ display: 'flex' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Box onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Box sx={{ width: { xs: 36, sm: 40, md: 44 }, height: { xs: 36, sm: 40, md: 44 }, mr: 1.25, borderRadius: 0.5, overflow: 'hidden' }}>
                <EMSLogoPattern width="100%" height="100%" tile={44} groupOpacity={0.9} diamondFillOpacity={0.4} circle7Opacity={0.5} strokeOpacity={0.3} />
              </Box>
              <Typography variant="h6" noWrap component="div">
                {t('ems')}
              </Typography>
            </Box>
          </div>
          <Box sx={{ flex: 1, maxWidth: 500, display: { xs: 'none', sm: 'block' } }}>
            <TextField
              fullWidth
              size="small"
              placeholder={t('searchPlaceholder') || 'Search employees, departments...'}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') triggerSearch(); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={triggerSearch} aria-label="search">
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={t('notifications') || 'Notifications'}>
              <IconButton color="inherit" size="small" onClick={() => navigate('/notifications')}>
                <Badge badgeContent={notifCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={t('settings') || 'Settings'}>
              <IconButton color="inherit" onClick={handleSettingsIconClick} size="small">
                <SettingsIcon
                  key={spinCount}
                  sx={{
                    animation: `${spinReverseMode ? spinReverse : spin} 0.6s linear`,
                    willChange: 'transform',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('myProfile') || 'Profile'}>
              <IconButton color="inherit" onClick={handleOpenUser} size="small">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={openSettings}
        onClose={handleCloseSettings}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>{t('language') || 'Language'}</MenuItem>
        <MenuItem onClick={() => { setLang('en'); handleCloseSettings(); }}>🇺🇸 English</MenuItem>
        <MenuItem onClick={() => { setLang('ar'); handleCloseSettings(); }}>🇸🇦 العربية</MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem disabled>{t('theme') || 'Theme'}</MenuItem>
        <MenuItem onClick={() => { setAppTheme('light'); handleCloseSettings(); }}>
          <ListItemIcon><LightModeIcon fontSize="small" /></ListItemIcon>
          {t('lightMode') || 'Light'} {appTheme === 'light' ? '✓' : ''}
        </MenuItem>
        <MenuItem onClick={() => { setAppTheme('dark'); handleCloseSettings(); }}>
          <ListItemIcon><DarkModeIcon fontSize="small" /></ListItemIcon>
          {t('darkMode') || 'Dark'} {appTheme === 'dark' ? '✓' : ''}
        </MenuItem>
        <MenuItem onClick={() => { setAppTheme('auto'); handleCloseSettings(); }}>
          <ListItemIcon><ComputerIcon fontSize="small" /></ListItemIcon>
          {t('autoMode') || 'Auto'} {appTheme === 'auto' ? '✓' : ''}
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => { navigate('/settings'); handleCloseSettings(); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          {t('advancedSettings') || 'Advanced Settings'}
        </MenuItem>
      </Menu>
      {/* User Menu */}
      <Menu
        anchorEl={userAnchorEl}
        open={openUser}
        onClose={handleCloseUser}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleCloseUser(); }}>
          <ListItemIcon><Avatar sx={{ width: 24, height: 24 }}>U</Avatar></ListItemIcon>
          {t('myProfile') || 'View Profile'}
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); handleCloseUser(); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          {t('settings') || 'Account Settings'}
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={() => { navigate('/'); handleCloseUser(); }}>
          {t('logout') || 'Sign Out'}
        </MenuItem>
      </Menu>
      <SideNavigation
        open={open}
        onClose={handleDrawerClose}
        navigationItems={navigationItems}
        currentPath={location.pathname}
        onNavigate={(href) => { navigate(href); setOpen(false); }}
        drawerWidth={drawerWidth}
      />
      <Main open={open}>
  <DrawerHeader />
      </Main>
    </Box>
  );
}