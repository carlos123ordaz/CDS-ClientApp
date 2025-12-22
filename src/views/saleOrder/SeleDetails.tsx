import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Breadcrumbs,
  Link,
  Skeleton,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Avatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon,
  Send as SendIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

// Interfaces
interface OrdenPedidoDetallada {
  correlativoOPCI: string;
  fecRecep: string;
  fecInicio: string;
  fecProcVi: string;
  numOp: string;
  moneda: string;
  totalSinIgv: number;
  numRefCliente: string;
  formaPago: string;
  ubrutaCoti: string;
  comisionCompartida: boolean;
  status: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  cantidadItems: number;
  fechaCreacion: string;
  ultimaModificacion: string;
  cliente: {
    idClt: string;
    razonSocial: string;
    numDocumento: string;
    tipoDocumento: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    industria?: string;
    sector?: string;
  };
  clienteFinal: {
    idClt: string;
    razonSocial: string;
    numDocumento: string;
  };
  clienteProveedor: {
    idClt: string;
    razonSocial: string;
    numDocumento: string;
  };
  vendedorPrincipal: {
    idVdr: string;
    nombre: string;
    apellido: string;
    email?: string;
    telefono?: string;
    esLider: boolean;
  };
  vendedorSecundario?: {
    idVdr: string;
    nombre: string;
    apellido: string;
    esLider: boolean;
  };
  lider: {
    idVdr: string;
    nombre: string;
    apellido: string;
  };
  detalles: DetalleOrdenPedido[];
}

interface DetalleOrdenPedido {
  id: string;
  statusOP: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
  tipoNegocio: 'COMPRAS' | 'VENTAS';
  subTipoNegocio1: 'NACIONAL' | 'INTERNACIONAL';
  subTipoNegocio2: 'PRODUCTO' | 'SERVICIO';
  itemOP: string;
  codigoComercial: string;
  cantidad: number;
  unidadMedida: string;
  moneda: string;
  pvu: number;
  tcUsd: number;
  fechaRequeridaCliente?: string;
  teSemanasEntrega: number;
  numCotizacion: string;
  requiereArmado: boolean;
  codigoCliente?: string;
  numeroDeal?: string;
  numeroServicio?: string;
  numeroProyecto?: string;
  ccs?: string;
  ccss?: string;
  ccn?: string;
  nota1?: string;
  nota2?: string;
  nota3?: string;
  nota4?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const OrdenPedidoDetalle = () => {
  const [ordenPedido, setOrdenPedido] = useState<OrdenPedidoDetallada | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    cargarOrdenPedido();
  }, [id]);

  const cargarOrdenPedido = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockData: OrdenPedidoDetallada = {
        correlativoOPCI: 'OP-2025-001',
        fecRecep: '2025-01-15T10:30:00Z',
        fecInicio: '2025-01-16T08:00:00Z',
        fecProcVi: '2025-01-20T14:00:00Z',
        numOp: 'OP-789456',
        moneda: 'PEN',
        totalSinIgv: 25430.50,
        numRefCliente: 'REF-2025-001',
        formaPago: 'CREDITO 30 DIAS',
        ubrutaCoti: 'COT-2024-456',
        comisionCompartida: true,
        status: 'EN_PROCESO',
        cantidadItems: 2,
        fechaCreacion: '2025-01-15T10:30:00Z',
        ultimaModificacion: '2025-01-18T16:45:00Z',

        cliente: {
          idClt: 'CLT-001',
          razonSocial: 'EMPRESA CONSTRUCTORA ABC S.A.C.',
          numDocumento: '20123456789',
          tipoDocumento: 'RUC',
          direccion: 'Av. Construcción 123, Lima',
          telefono: '+51-1-234-5678',
          email: 'contacto@constructoraabc.com',
          industria: 'Construcción',
          sector: 'Privado'
        },

        clienteFinal: {
          idClt: 'CLT-002',
          razonSocial: 'CONSTRUCTORA XYZ',
          numDocumento: '20987654321'
        },

        clienteProveedor: {
          idClt: 'CLT-003',
          razonSocial: 'PROVEEDOR DELTA',
          numDocumento: '20456789123'
        },

        vendedorPrincipal: {
          idVdr: 'VDR-001',
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@empresa.com',
          telefono: '+51-987-654-321',
          esLider: false
        },

        vendedorSecundario: {
          idVdr: 'VDR-002',
          nombre: 'María',
          apellido: 'García',
          esLider: false
        },

        lider: {
          idVdr: 'VDR-003',
          nombre: 'Carlos',
          apellido: 'López'
        },

        detalles: [
          {
            id: '1',
            statusOP: 'EN_PROCESO',
            tipoNegocio: 'VENTAS',
            subTipoNegocio1: 'NACIONAL',
            subTipoNegocio2: 'PRODUCTO',
            itemOP: 'ITEM-001',
            codigoComercial: 'CC-12345',
            cantidad: 10,
            unidadMedida: 'UND',
            moneda: 'PEN',
            pvu: 2543.05,
            tcUsd: 3.75,
            fechaRequeridaCliente: '2025-02-15T00:00:00Z',
            teSemanasEntrega: 2,
            numCotizacion: 'COT-2024-001',
            requiereArmado: true,
            codigoCliente: 'CLI-ABC-001',
            numeroDeal: 'DEAL-2025-001',
            numeroProyecto: 'PROJ-2025-001',
            ccs: 'CC-VENTAS',
            nota1: 'Producto requiere instalación especializada',
            nota2: 'Cliente solicita entrega directa en obra'
          },
          {
            id: '2',
            statusOP: 'PENDIENTE',
            tipoNegocio: 'VENTAS',
            subTipoNegocio1: 'NACIONAL',
            subTipoNegocio2: 'SERVICIO',
            itemOP: 'ITEM-002',
            codigoComercial: 'CC-67890',
            cantidad: 5,
            unidadMedida: 'HRS',
            moneda: 'PEN',
            pvu: 450.00,
            tcUsd: 3.75,
            teSemanasEntrega: 1,
            numCotizacion: 'COT-2024-002',
            requiereArmado: false,
            nota1: 'Servicio de mantenimiento preventivo'
          }
        ]
      };

      setOrdenPedido(mockData);
    } catch (error) {
      console.error("Error al cargar orden:", error);
      setError('Error al cargar los detalles de la orden de pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      console.log('Nueva nota:', noteText);
      setNoteText('');
      setDialogOpen(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return moment(fecha).format('DD/MM/YYYY HH:mm');
  };

  const formatearMoneda = (monto: number, moneda: string = 'PEN') => {
    const simbolos: Record<string, string> = {
      'PEN': 'S/',
      'USD': '$',
      'EUR': '€'
    };
    const simbolo = simbolos[moneda] || moneda;
    return `${simbolo} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status: string) => {
    const colores: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
      'PENDIENTE': 'warning',
      'EN_PROCESO': 'info',
      'COMPLETADO': 'success',
      'CANCELADO': 'error'
    };
    return colores[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const iconos: Record<string, React.ReactElement> = {
      'PENDIENTE': <ScheduleIcon />,
      'EN_PROCESO': <InfoIcon />,
      'COMPLETADO': <CheckCircleIcon />,
      'CANCELADO': <ErrorIcon />
    };
    return iconos[status] || <InfoIcon />;
  };

  const getTipoNegocioColor = (tipo: string) => {
    return tipo === 'VENTAS' ? 'success' : 'info';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" width="100%" height={60} />
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={cargarOrdenPedido}>
            Reintentar
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!ordenPedido) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          No se encontraron datos para esta orden de pedido.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent={'space-between'} spacing={2} mb={2}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} color="primary">
            Orden de Pedido {ordenPedido.correlativoOPCI}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Creada el {formatearFecha(ordenPedido.fechaCreacion)} •
            Última modificación: {formatearFecha(ordenPedido.ultimaModificacion)}
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Imprimir orden">
              <IconButton color="primary" size="large">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar PDF">
              <IconButton color="primary" size="large">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/pedidos-editar/${ordenPedido.correlativoOPCI}`)}
              size="large"
            >
              Editar Orden
            </Button>
          </Stack>
        </Box>
      </Stack>

      {/* Información principal */}
      <Card elevation={3} sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}>
                  {getStatusIcon(ordenPedido.status)}
                </Avatar>
                <Chip
                  label={ordenPedido.status.replace('_', ' ')}
                  color={getStatusColor(ordenPedido.status)}
                  sx={{ mb: 2, fontWeight: 'bold', fontSize: '1rem' }}
                />
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {formatearMoneda(ordenPedido.totalSinIgv, ordenPedido.moneda)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Total sin IGV
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Fecha Recepción
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {moment(ordenPedido.fecRecep).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <BusinessIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Cliente
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" sx={{ fontSize: '0.9rem' }}>
                      {ordenPedido.cliente.razonSocial.substring(0, 20)}
                      {ordenPedido.cliente.razonSocial.length > 20 ? '...' : ''}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Vendedor Principal
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {ordenPedido.vendedorPrincipal.nombre} {ordenPedido.vendedorPrincipal.apellido}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 3, sm: 6 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <InventoryIcon sx={{ fontSize: 40, mb: 1, opacity: 0.8 }} />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Items
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {ordenPedido.cantidadItems}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      productos/servicios
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.100' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="orden pedido tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2 }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InventoryIcon fontSize="small" />
                  <span>Detalles de Items</span>
                  <Badge badgeContent={ordenPedido.detalles?.length || 0} color="primary" />
                </Box>
              }
              id="tab-0"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon fontSize="small" />
                  <span>Información del Cliente</span>
                </Box>
              }
              id="tab-1"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" />
                  <span>Equipo de Ventas</span>
                </Box>
              }
              id="tab-2"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon fontSize="small" />
                  <span>Timeline y Seguimiento</span>
                </Box>
              }
              id="tab-3"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon fontSize="small" />
                  <span>Notas y Documentos</span>
                </Box>
              }
              id="tab-4"
            />
          </Tabs>
        </Box>

        {/* Tab Panel 0 - Detalles de Items */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item / Código</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Negocio</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>PVU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fecha Requerida</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ordenPedido.detalles?.map((detalle, index) => (
                  <TableRow key={detalle.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: 'grey.50' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {detalle.codigoComercial}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Item: {detalle.itemOP}
                        </Typography>
                        {detalle.numCotizacion && (
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label={`COT: ${detalle.numCotizacion}`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          label={detalle.tipoNegocio}
                          color={getTipoNegocioColor(detalle.tipoNegocio)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {detalle.subTipoNegocio1} - {detalle.subTipoNegocio2}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {detalle.cantidad}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {detalle.unidadMedida}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {formatearMoneda(detalle.pvu, detalle.moneda)}
                      </Typography>
                      {detalle.tcUsd !== 1 && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          TC: {detalle.tcUsd.toFixed(3)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="success.main">
                        {formatearMoneda(detalle.cantidad * detalle.pvu, detalle.moneda)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={detalle.statusOP.replace('_', ' ')}
                        color={getStatusColor(detalle.statusOP)}
                        size="small"
                        icon={getStatusIcon(detalle.statusOP)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {detalle.fechaRequeridaCliente ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {moment(detalle.fechaRequeridaCliente).format('DD/MM/YYYY')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {detalle.teSemanasEntrega} semanas
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No definida
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles completos">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Fila de totales */}
                <TableRow sx={{ bgcolor: 'primary.50', '& td': { fontWeight: 'bold' } }}>
                  <TableCell colSpan={4} align="right">
                    <Typography variant="h6" fontWeight="bold">
                      TOTAL ORDEN:
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatearMoneda(ordenPedido.totalSinIgv, ordenPedido.moneda)}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Tab Panel 1 - Información del Cliente */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" elevation={1}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <BusinessIcon />
                    Información del Cliente Principal
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                          <BusinessIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {ordenPedido.cliente.razonSocial}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ordenPedido.cliente.tipoDocumento}: {ordenPedido.cliente.numDocumento}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Dirección
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenPedido.cliente.direccion || 'No registrada'}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Industria
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenPedido.cliente.industria || 'No especificada'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Teléfono
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenPedido.cliente.telefono || 'No registrado'}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {ordenPedido.cliente.email || 'No registrado'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Clientes relacionados */}
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Clientes Relacionados
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="info.main">
                          Cliente Final
                        </Typography>
                        <Typography variant="body2">
                          {ordenPedido.clienteFinal.razonSocial}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ordenPedido.clienteFinal.numDocumento}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="warning.main">
                          Cliente Proveedor
                        </Typography>
                        <Typography variant="body2">
                          {ordenPedido.clienteProveedor.razonSocial}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ordenPedido.clienteProveedor.numDocumento}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Información de la Orden
                    </Typography>

                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Número de Referencia del Cliente
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenPedido.numRefCliente}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Forma de Pago
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenPedido.formaPago}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Utilidad Bruta Cotización
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ordenPedido.ubrutaCoti}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Comisión Compartida
                        </Typography>
                        <Chip
                          label={ordenPedido.comisionCompartida ? "Sí" : "No"}
                          color={ordenPedido.comisionCompartida ? "success" : "default"}
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Acciones Rápidas
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Enviar Email"
                          secondary="Contactar al cliente"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Llamar"
                          secondary="Contacto telefónico"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Ver Historial"
                          secondary="Órdenes anteriores"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel 2 - Equipo de Ventas */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                    <StarIcon />
                    Vendedor Principal
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      {ordenPedido.vendedorPrincipal.nombre[0]}{ordenPedido.vendedorPrincipal.apellido[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {ordenPedido.vendedorPrincipal.nombre} {ordenPedido.vendedorPrincipal.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {ordenPedido.vendedorPrincipal.idVdr}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack spacing={1}>
                    {ordenPedido.vendedorPrincipal.email && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {ordenPedido.vendedorPrincipal.email}
                        </Typography>
                      </Box>
                    )}
                    {ordenPedido.vendedorPrincipal.telefono && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {ordenPedido.vendedorPrincipal.telefono}
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small" startIcon={<EmailIcon />}>
                      Contactar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {ordenPedido.vendedorSecundario && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: 'fit-content' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
                      <PersonIcon />
                      Vendedor Secundario
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48 }}>
                        {ordenPedido.vendedorSecundario.nombre[0]}{ordenPedido.vendedorSecundario.apellido[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {ordenPedido.vendedorSecundario.nombre} {ordenPedido.vendedorSecundario.apellido}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {ordenPedido.vendedorSecundario.idVdr}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small" color="secondary" startIcon={<EmailIcon />}>
                        Contactar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
                    <StarIcon />
                    Líder del Equipo
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                      {ordenPedido.lider.nombre[0]}{ordenPedido.lider.apellido[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {ordenPedido.lider.nombre} {ordenPedido.lider.apellido}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {ordenPedido.lider.idVdr}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small" sx={{ color: 'warning.main', borderColor: 'warning.main' }} startIcon={<EmailIcon />}>
                      Contactar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Estadísticas del equipo */}
          <Card sx={{ mt: 3 }} variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Estadísticas del Equipo de Ventas
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      15
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Órdenes este mes
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      S/ 125,430
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ventas acumuladas
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      92%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tasa de conversión
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      4.2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Días promedio respuesta
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Tab Panel 3 - Timeline */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon />
            Seguimiento de la Orden
          </Typography>

          <Stack spacing={2}>
            {[
              {
                fecha: ordenPedido.fechaCreacion,
                titulo: 'Orden Creada',
                descripcion: 'La orden fue registrada en el sistema',
                status: 'completado',
                usuario: 'Sistema'
              },
              {
                fecha: ordenPedido.fecRecep,
                titulo: 'Orden Recibida',
                descripcion: 'La orden fue recibida y asignada al equipo de ventas',
                status: 'completado',
                usuario: ordenPedido.vendedorPrincipal.nombre
              },
              {
                fecha: ordenPedido.fecInicio,
                titulo: 'Procesamiento Iniciado',
                descripcion: 'Se inició el procesamiento de los items solicitados',
                status: ordenPedido.status === 'EN_PROCESO' ? 'actual' : 'completado',
                usuario: ordenPedido.lider.nombre
              },
              {
                fecha: ordenPedido.fecProcVi,
                titulo: 'Procesamiento VI',
                descripcion: 'Proceso de validación interna completado',
                status: ordenPedido.status === 'COMPLETADO' ? 'completado' : 'pendiente',
                usuario: 'Equipo VI'
              }
            ].map((evento, index) => (
              <Card key={index} variant="outlined" sx={{
                bgcolor: evento.status === 'actual' ? 'info.50' :
                  evento.status === 'completado' ? 'success.50' : 'grey.100'
              }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 'auto' }}>
                      <Avatar sx={{
                        bgcolor: evento.status === 'actual' ? 'info.main' :
                          evento.status === 'completado' ? 'success.main' : 'grey.400'
                      }}>
                        {evento.status === 'completado' && <CheckCircleIcon />}
                        {evento.status === 'actual' && <InfoIcon />}
                        {evento.status === 'pendiente' && <ScheduleIcon />}
                      </Avatar>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {evento.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {evento.descripcion}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatearFecha(evento.fecha)} • {evento.usuario}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </TabPanel>

        {/* Tab Panel 4 - Notas y Documentos */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon />
                Notas por Item
              </Typography>

              <Stack spacing={2}>
                {ordenPedido.detalles?.map((detalle, index) => (
                  <Accordion key={detalle.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {detalle.codigoComercial} - Item {index + 1}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {detalle.nota1 && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                              <Typography variant="subtitle2" color="info.main" fontWeight="bold">
                                Nota 1:
                              </Typography>
                              <Typography variant="body2">
                                {detalle.nota1}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {detalle.nota2 && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                              <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
                                Nota 2:
                              </Typography>
                              <Typography variant="body2">
                                {detalle.nota2}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                        {!detalle.nota1 && !detalle.nota2 && (
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary" style={{ fontStyle: 'italic' }}>
                              No hay notas registradas para este item
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Agregar Nota General
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setDialogOpen(true)}
                    >
                      Nueva Nota
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      Documentos
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <DescriptionIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Orden Original"
                          secondary="PDF generado automáticamente"
                        />
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <DescriptionIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Cotización"
                          secondary={ordenPedido.ubrutaCoti}
                        />
                        <IconButton size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Dialog para agregar notas */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Agregar Nota a la Orden</Typography>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nota"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Escriba su nota aquí..."
            helperText="Esta nota será visible para todos los usuarios con acceso a la orden"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!noteText.trim()}
            startIcon={<AddIcon />}
          >
            Guardar Nota
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Buttons */}
      <Box sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Tooltip title="Imprimir orden completa">
          <Fab
            color="primary"
            size="medium"
          >
            <PrintIcon />
          </Fab>
        </Tooltip>

        <Tooltip title="Descargar PDF">
          <Fab
            color="secondary"
            size="medium"
          >
            <DownloadIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default OrdenPedidoDetalle;