import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Divider,
  Stack,
  Menu,
  MenuItem,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as OrderIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';


interface DashboardStats {
  totalEmpresas: number;
  empresasActivas: number;
  totalOrdenes: number;
  ordenesEnProceso: number;
  totalFacturacion: number;
  facturacionMes: number;
  itemsEnStock: number;
  alertasInventario: number;
}

interface RecentActivity {
  id: number;
  tipo: 'ORDEN_PEDIDO' | 'ORDEN_COMPRA' | 'FACTURA' | 'ALMACEN';
  descripcion: string;
  estado: string;
  fecha: Date;
  monto?: number;
  empresa?: string;
}

interface ChartData {
  name: string;
  ventas: number;
  compras: number;
  fecha: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmpresas: 0,
    empresasActivas: 0,
    totalOrdenes: 0,
    ordenesEnProceso: 0,
    totalFacturacion: 0,
    facturacionMes: 0,
    itemsEnStock: 0,
    alertasInventario: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStats({
      totalEmpresas: 247,
      empresasActivas: 198,
      totalOrdenes: 1456,
      ordenesEnProceso: 89,
      totalFacturacion: 2847650,
      facturacionMes: 485300,
      itemsEnStock: 3247,
      alertasInventario: 23,
    });

    setRecentActivities([
      {
        id: 1,
        tipo: 'ORDEN_PEDIDO',
        descripcion: 'Nueva orden de pedido #OP-2024-001234',
        estado: 'PENDIENTE',
        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
        monto: 15750,
        empresa: 'Corporación Industrial SAC',
      },
      {
        id: 2,
        tipo: 'FACTURA',
        descripcion: 'Factura #F001-000567 generada',
        estado: 'PAGADA',
        fecha: new Date(Date.now() - 4 * 60 * 60 * 1000),
        monto: 28900,
        empresa: 'Tecnología Avanzada EIRL',
      },
      {
        id: 3,
        tipo: 'ORDEN_COMPRA',
        descripcion: 'Orden de compra #OC-2024-000445',
        estado: 'EN_TRANSITO',
        fecha: new Date(Date.now() - 6 * 60 * 60 * 1000),
        monto: 42300,
        empresa: 'Distribuidora Nacional SA',
      },
      {
        id: 4,
        tipo: 'ALMACEN',
        descripcion: 'Recepción de mercadería en Almacén Central',
        estado: 'RECIBIDO',
        fecha: new Date(Date.now() - 8 * 60 * 60 * 1000),
        empresa: 'Proveedor Internacional',
      },
      {
        id: 5,
        tipo: 'ORDEN_PEDIDO',
        descripcion: 'Orden #OP-2024-001233 completada',
        estado: 'COMPLETADO',
        fecha: new Date(Date.now() - 12 * 60 * 60 * 1000),
        monto: 67800,
        empresa: 'Constructora del Sur EIRL',
      },
    ]);

    setChartData([
      { name: 'Ene', ventas: 125000, compras: 89000, fecha: '2024-01' },
      { name: 'Feb', ventas: 168000, compras: 95000, fecha: '2024-02' },
      { name: 'Mar', ventas: 142000, compras: 102000, fecha: '2024-03' },
      { name: 'Abr', ventas: 198000, compras: 118000, fecha: '2024-04' },
      { name: 'May', ventas: 225000, compras: 134000, fecha: '2024-05' },
      { name: 'Jun', ventas: 287000, compras: 156000, fecha: '2024-06' },
      { name: 'Jul', ventas: 234000, compras: 142000, fecha: '2024-07' },
      { name: 'Ago', ventas: 267000, compras: 178000, fecha: '2024-08' },
      { name: 'Sep', ventas: 301000, compras: 195000, fecha: '2024-09' },
    ]);

    setLoading(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    handleMenuClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} min`;
    } else if (diffInMinutes < 1440) {
      return `hace ${Math.floor(diffInMinutes / 60)} h`;
    } else {
      return `hace ${Math.floor(diffInMinutes / 1440)} días`;
    }
  };

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'ORDEN_PEDIDO': return <OrderIcon fontSize="small" />;
      case 'ORDEN_COMPRA': return <ShippingIcon fontSize="small" />;
      case 'FACTURA': return <MoneyIcon fontSize="small" />;
      case 'ALMACEN': return <InventoryIcon fontSize="small" />;
      default: return <CheckCircleIcon fontSize="small" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
      case 'PAGADA':
      case 'RECIBIDO': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'EN_TRANSITO': return 'info';
      default: return 'default';
    }
  };

  const pieData = [
    { name: 'Órdenes Completadas', value: 65, color: '#4caf50' },
    { name: 'En Proceso', value: 23, color: '#ff9800' },
    { name: 'Pendientes', value: 12, color: '#f44336' },
  ];

  const KPICardSkeleton = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={40} sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
              <Skeleton variant="text" width="50%" height={16} />
            </Box>
          </Box>
          <Skeleton variant="circular" width={56} height={56} />
        </Box>
      </CardContent>
    </Card>
  );

  const ChartSkeleton = ({ height = 300 }) => (
    <Box sx={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="rectangular" width="100%" height="80%" sx={{ borderRadius: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="text" width="12%" height={20} />
          ))}
        </Box>
      </Box>
    </Box>
  );

  const ActivityTableSkeleton = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Tiempo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
                  <Skeleton variant="text" width={80} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="50%" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 3 }}>
        {loading ? (
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={150} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              endIcon={<MoreVertIcon />}
              onClick={handleMenuClick}
            >
              {selectedPeriod === '7d' ? 'Últimos 7 días' :
                selectedPeriod === '30d' ? 'Últimos 30 días' : 'Último año'}
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadDashboardData}>
              Actualizar
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Exportar
            </Button>
          </Stack>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handlePeriodChange('7d')}>
          <ListItemText primary="Últimos 7 días" />
        </MenuItem>
        <MenuItem onClick={() => handlePeriodChange('30d')}>
          <ListItemText primary="Últimos 30 días" />
        </MenuItem>
        <MenuItem onClick={() => handlePeriodChange('1y')}>
          <ListItemText primary="Último año" />
        </MenuItem>
      </Menu>

      {!loading && stats.alertasInventario > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>¡Atención!</strong> Tienes {stats.alertasInventario} productos con stock bajo en inventario.
            <Button size="small" sx={{ ml: 1 }}>Ver detalles</Button>
          </Typography>
        </Alert>
      )}

      {loading && (
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1, mb: 3 }} />
      )}

      {/* KPIs principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          // Skeleton para KPIs
          [...Array(4)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KPICardSkeleton />
            </Grid>
          ))
        ) : (
          // KPIs reales
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Total Empresas
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalEmpresas}
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {stats.empresasActivas} activas
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <BusinessIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Órdenes Totales
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalOrdenes}
                      </Typography>
                      <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScheduleIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {stats.ordenesEnProceso} en proceso
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <OrderIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Facturación Total
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(stats.totalFacturacion)}
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {formatCurrency(stats.facturacionMes)} este mes
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <MoneyIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Items en Stock
                      </Typography>
                      <Typography variant="h4">
                        {stats.itemsEnStock.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {stats.alertasInventario} alertas
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <InventoryIcon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Gráfico de tendencias */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Tendencia de Ventas vs Compras
                </Typography>
                {!loading && (
                  <Button size="small" startIcon={<VisibilityIcon />}>
                    Ver detalles
                  </Button>
                )}
              </Box>
              {loading ? (
                <ChartSkeleton height={300} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2196f3" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <ChartTooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="ventas"
                      stackId="1"
                      stroke="#4caf50"
                      fillOpacity={1}
                      fill="url(#colorVentas)"
                      name="Ventas"
                    />
                    <Area
                      type="monotone"
                      dataKey="compras"
                      stackId="2"
                      stroke="#2196f3"
                      fillOpacity={1}
                      fill="url(#colorCompras)"
                      name="Compras"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Estado de órdenes */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado de Órdenes
              </Typography>
              {loading ? (
                <ChartSkeleton height={300} />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actividad reciente */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Actividad Reciente
                </Typography>
                {!loading && (
                  <Button size="small" startIcon={<AddIcon />} variant="outlined">
                    Ver todo
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {loading ? (
                <ActivityTableSkeleton />
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell>Empresa</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Monto</TableCell>
                        <TableCell>Tiempo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActivities.map((activity) => (
                        <TableRow key={activity.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                {getActivityIcon(activity.tipo)}
                              </Avatar>
                              {activity.tipo.replace('_', ' ')}
                            </Box>
                          </TableCell>
                          <TableCell>{activity.descripcion}</TableCell>
                          <TableCell>
                            <Typography variant="body2" color="primary">
                              {activity.empresa}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={activity.estado}
                              color={getStatusColor(activity.estado) as any}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {activity.monto ? formatCurrency(activity.monto) : '-'}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="textSecondary">
                              {formatRelativeTime(activity.fecha)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;