import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Book as BookIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  ShoppingCart as ShoppingCartIcon,
  Storefront as StorefrontIcon,
  Inventory2 as InventoryIcon,
  Build as BuildIcon,
  Group as GroupIcon,
  Work as WorkIcon,

} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// Tipos TypeScript
interface PageInfo {
  title: string;
  description: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
}

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [desktopOpen, setDesktopOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 detectar la ruta actual
  const drawerWidth = 280;
  const collapsedWidth = 73;

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/' },
    { id: 'pedidos', label: 'Pedidos', icon: AssignmentIcon, path: '/pedidos-lista' },
    { id: 'compras', label: 'Compras', icon: ShoppingCartIcon, path: '/compras-lista' },
    { id: 'vendedores', label: 'Usuarios', icon: StorefrontIcon, path: '/vendedores-lista' },
    { id: 'productos', label: 'Productos', icon: InventoryIcon, path: '/productos-lista' },
    { id: 'servicios', label: 'Servicios', icon: BuildIcon, path: '/servicios-lista' },
    { id: 'clientes', label: 'Clientes', icon: GroupIcon, path: '/clientes-lista' },
    { id: 'proyectos', label: 'Proyectos', icon: WorkIcon, path: '/proyectos-lista' },
  ];

  const handleDrawerToggle = (): void => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const getPageInfo = (): PageInfo => {
    const pageMap: Record<string, PageInfo> = {
      '/': { title: 'Dashboard', description: 'Resumen general del sistema' },
      '/pedidos-lista': { title: 'Gestión de Pedidos', description: 'Administra todos los pedidos disponibles' },
      '/compras-lista': { title: 'Gestión de Compras', description: 'Administra todas las compras disponibles' },
      '/vendedores-lista': { title: 'Usuarios', description: 'Administra usuarios registrados' },
      '/productos-lista': { title: 'Productos', description: 'Administra productos disponibles' },
      '/servicios-lista': { title: 'Servicios', description: 'Administra servicios disponibles' },
      '/clientes-lista': { title: 'Clientes', description: 'Administra clientes registrados' },
      '/proyectos-lista': { title: 'Proyectos', description: 'Administra proyectos disponibles' },
      '/compras-crear': { title: 'Compras', description: 'Registra una orden de compra' },
      '/pedidos-crear': { title: 'Pedidos', description: 'Registra una orden de pedido' },
    };
    return pageMap[location.pathname] || { title: 'Panel de Administración', description: 'Gestiona el flujo de suministro' };
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {(desktopOpen || isMobile) && (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Corsusa
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sistema de suministro
            </Typography>
          </Box>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider />
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'inherit' : 'text.secondary',
                    minWidth: desktopOpen || isMobile ? 56 : 40,
                  }}
                >
                  <Icon />
                </ListItemIcon>
                {(desktopOpen || isMobile) && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: desktopOpen || isMobile ? 'flex-start' : 'center',
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            A
          </Avatar>
          {(desktopOpen || isMobile) && (
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {'admin@ejemplo.com'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  const currentWidth = desktopOpen ? drawerWidth : collapsedWidth;
  const pageInfo = getPageInfo();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${isMobile ? 0 : currentWidth}px)` },
          ml: { lg: `${isMobile ? 0 : currentWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {pageInfo.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pageInfo.description}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: currentWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          open={desktopOpen}
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentWidth,
              bgcolor: 'background.paper',
              borderRight: 1,
              borderColor: 'divider',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${currentWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
