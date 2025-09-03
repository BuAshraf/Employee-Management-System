import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Avatar, IconButton, Stack, Tooltip, CircularProgress, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useI18n } from '../../i18n';
import NotificationService from '../../services/NotificationService';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const typeIcon = (type) => {
  const t = String(type || 'INFO').toUpperCase();
  switch (t) {
    case 'SUCCESS':
      return <CheckCircleIcon color="success" />;
    case 'WARNING':
      return <WarningIcon color="warning" />;
    case 'ERROR':
      return <ErrorIcon color="error" />;
    default:
      return <InfoIcon color="primary" />;
  }
};

export default function NotificationPage() {
  const { t } = useI18n();

  const [page, setPage] = React.useState(0);
  const [size] = React.useState(20);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState({ content: [], totalElements: 0, totalPages: 0, number: 0 });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await NotificationService.getUserNotifications({ page, size });
      setData(res);
    } catch (e) {
      setError(e?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  React.useEffect(() => { load(); }, [load]);

  const markAll = async () => {
    await NotificationService.markAllAsRead();
    load();
  };

  const markOne = async (id) => {
    await NotificationService.markAsRead(id);
    load();
  };

  const removeOne = async (id) => {
    await NotificationService.remove(id);
    load();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, sm: 2 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <NotificationsIcon />
        <Typography variant="h5">{t('notifications') || 'Notifications'}</Typography>
        <Chip size="small" label={data.totalElements} sx={{ ml: 1 }} />
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button onClick={markAll} size="small" startIcon={<MarkEmailReadIcon />}>{t('markAllAsRead') || 'Mark all as read'}</Button>
        </Stack>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'error.main' }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      ) : data.content.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <NotificationsIcon sx={{ fontSize: 40, mb: 1, opacity: 0.6 }} />
          <Typography variant="body1">{t('noNotifications') || 'You’re all caught up.'}</Typography>
        </Box>
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
          {data.content.map((n, idx) => (
            <React.Fragment key={n.id}>
              <ListItem alignItems="flex-start">
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    {typeIcon(n.type)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: n.isRead ? 400 : 600 }}>{n.title}</Typography>
                      <Typography variant="caption" color="text.secondary">• {new Date(n.createdAt).toLocaleString()}</Typography>
                    </Box>
                  }
                  secondary={<Typography variant="body2" color="text.secondary">{n.message}</Typography>}
                />
                <Stack direction="row" spacing={1}>
                  {!n.isRead && (
                    <Tooltip title={t('markAsRead') || 'Mark as read'}>
                      <IconButton size="small" onClick={() => markOne(n.id)}>
                        <MarkEmailReadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t('delete') || 'Delete'}>
                    <IconButton size="small" color="error" onClick={() => removeOne(n.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
              {idx < data.content.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}
