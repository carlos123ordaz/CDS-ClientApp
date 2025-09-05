import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Avatar,
    Divider,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    Badge,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Breadcrumbs,
    Link,
    Fab,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Cancel as CancelIcon,
    ExpandMore as ExpandMoreIcon,
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    List as ListIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Settings as SettingsIcon,
    FileCopy as FileCopyIcon,
    History as HistoryIcon,
    Note as NoteIcon,
    Attachment as AttachmentIcon,
    Timeline as TimelineIcon,
    Assessment as AssessmentIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Interfaces
interface OrdenDetalle {
    correlativoOPCI: string;
    fecRecep: string;
    fecInicio: string;
    fecProcVi: string;
    razonSocialCliente: string;
    numOp: string;
    moneda: string;
    totalSinIgv: number;
    numRefCliente: string;
    formaPago: string;
    clienteFinal: string;
    clienteProveedor: string;
    vendedor1: string;
    vendedor2: string;
    lider: string;
    ubrutaCoti: string;
    comisionCompartida: boolean;
    status: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
    cantidadItems: number;
    fechaCreacion: string;
    ultimaModificacion: string;
    progreso: number;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    observaciones: string;
    contactoCliente: {
        nombre: string;
        email: string;
        telefono: string;
    };
}

interface ItemDetalle {
    id: string;
    itemOP: string;
    codigoComercial: string;
    descripcion: string;
    cantidad: number;
    unidadMedida: string;
    pvu: number;
    total: number;
    tipoNegocio: string;
    subTipoNegocio1: string;
    subTipoNegocio2: string;
    statusOP: string;
    fechaRequerida: string;
    semanasEntrega: number;
    numCotizacion: string;
    requiereArmado: boolean;
    codigoCliente: string;
    numeroDeal: string;
    numeroServicio: string;
    numeroProyecto: string;
    progreso: number;
    notas: string[];
}

interface HistorialItem {
    fecha: string;
    accion: string;
    usuario: string;
    descripcion: string;
    tipo: 'CREACION' | 'MODIFICACION' | 'STATUS_CHANGE' | 'COMENTARIO';
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// Componente TabPanel
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

// Datos de ejemplo
const ordenEjemplo: OrdenDetalle = {
    correlativoOPCI: 'OP-2025-001',
    fecRecep: '2025-01-15T10:30:00Z',
    fecInicio: '2025-01-16T08:00:00Z',
    fecProcVi: '2025-01-20T14:00:00Z',
    razonSocialCliente: 'EMPRESA CONSTRUCTORA ABC S.A.C.',
    numOp: 'OP-789456',
    moneda: 'S/',
    totalSinIgv: 25430.50,
    numRefCliente: 'REF-2025-001',
    formaPago: 'CREDITO 30 DIAS',
    clienteFinal: 'CONSTRUCTORA XYZ',
    clienteProveedor: 'PROVEEDOR DELTA',
    vendedor1: 'Juan Pérez',
    vendedor2: 'María García',
    lider: 'Carlos López',
    ubrutaCoti: 'COT-2024-456',
    comisionCompartida: true,
    status: 'EN_PROCESO',
    cantidadItems: 3,
    fechaCreacion: '2025-01-15T10:30:00Z',
    ultimaModificacion: '2025-01-18T16:45:00Z',
    progreso: 65,
    prioridad: 'ALTA',
    observaciones: 'Orden prioritaria para cliente estratégico. Revisar disponibilidad de stock antes del 20 de enero.',
    contactoCliente: {
        nombre: 'Roberto Silva',
        email: 'roberto.silva@constructoraabc.com',
        telefono: '+51 999 888 777',
    },
};

const itemsEjemplo: ItemDetalle[] = [
    {
        id: '1',
        itemOP: 'ITEM-001',
        codigoComercial: 'CC-12345',
        descripcion: 'Válvula de control industrial DN100 PN16',
        cantidad: 5,
        unidadMedida: 'UND',
        pvu: 2543.05,
        total: 12715.25,
        tipoNegocio: 'PRODUCTO',
        subTipoNegocio1: 'VENTA',
        subTipoNegocio2: 'INDUSTRIAL',
        statusOP: 'EN_PROCESO',
        fechaRequerida: '2025-02-15T00:00:00Z',
        semanasEntrega: 4,
        numCotizacion: 'COT-2024-456-001',
        requiereArmado: true,
        codigoCliente: 'CLI-VAL-001',
        numeroDeal: 'DEAL-2024-789',
        numeroServicio: 'SRV-001',
        numeroProyecto: 'PROJ-CONST-2025',
        progreso: 75,
        notas: ['Confirmar especificaciones técnicas', 'Pendiente aprobación del cliente'],
    },
    {
        id: '2',
        itemOP: 'ITEM-002',
        codigoComercial: 'CC-67890',
        descripcion: 'Servicio de instalación y puesta en marcha',
        cantidad: 1,
        unidadMedida: 'SRV',
        pvu: 8500.00,
        total: 8500.00,
        tipoNegocio: 'SERVICIO',
        subTipoNegocio1: 'INSTALACION',
        subTipoNegocio2: 'TECNICO',
        statusOP: 'PENDIENTE',
        fechaRequerida: '2025-02-20T00:00:00Z',
        semanasEntrega: 2,
        numCotizacion: 'COT-2024-456-002',
        requiereArmado: false,
        codigoCliente: 'CLI-SRV-001',
        numeroDeal: 'DEAL-2024-789',
        numeroServicio: 'SRV-002',
        numeroProyecto: 'PROJ-CONST-2025',
        progreso: 25,
        notas: ['Coordinar con equipo técnico', 'Verificar disponibilidad de técnicos'],
    },
    {
        id: '3',
        itemOP: 'ITEM-003',
        codigoComercial: 'CC-11111',
        descripcion: 'Repuestos y accesorios complementarios',
        cantidad: 10,
        unidadMedida: 'SET',
        pvu: 421.525,
        total: 4215.25,
        tipoNegocio: 'PRODUCTO',
        subTipoNegocio1: 'VENTA',
        subTipoNegocio2: 'REPUESTOS',
        statusOP: 'COMPLETADO',
        fechaRequerida: '2025-02-10T00:00:00Z',
        semanasEntrega: 1,
        numCotizacion: 'COT-2024-456-003',
        requiereArmado: false,
        codigoCliente: 'CLI-REP-001',
        numeroDeal: 'DEAL-2024-789',
        numeroServicio: 'SRV-003',
        numeroProyecto: 'PROJ-CONST-2025',
        progreso: 100,
        notas: ['Entregado según cronograma'],
    },
];

const historialEjemplo: HistorialItem[] = [
    {
        fecha: '2025-01-18T16:45:00Z',
        accion: 'STATUS_CHANGE',
        usuario: 'Carlos López',
        descripcion: 'Cambió el status de PENDIENTE a EN_PROCESO',
        tipo: 'STATUS_CHANGE',
    },
    {
        fecha: '2025-01-17T09:30:00Z',
        accion: 'MODIFICACION',
        usuario: 'Juan Pérez',
        descripcion: 'Actualizó las fechas de entrega del Item-001',
        tipo: 'MODIFICACION',
    },
    {
        fecha: '2025-01-16T14:20:00Z',
        accion: 'COMENTARIO',
        usuario: 'María García',
        descripcion: 'Agregó comentario: "Cliente confirma especificaciones técnicas"',
        tipo: 'COMENTARIO',
    },
    {
        fecha: '2025-01-15T10:30:00Z',
        accion: 'CREACION',
        usuario: 'Juan Pérez',
        descripcion: 'Creó la orden de pedido OP-2025-001',
        tipo: 'CREACION',
    },
];

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados
    const [orden, setOrden] = React.useState<OrdenDetalle>(ordenEjemplo);
    const [items, setItems] = React.useState<ItemDetalle[]>(itemsEjemplo);
    const [historial, setHistorial] = React.useState<HistorialItem[]>(historialEjemplo);
    const [loading, setLoading] = React.useState(false);
    const [tabValue, setTabValue] = React.useState(0);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openNoteDialog, setOpenNoteDialog] = React.useState(false);
    const [newNote, setNewNote] = React.useState('');

    // Funciones utilitarias
    const formatearFecha = (fecha: string) => {
        return dayjs(fecha).format('DD/MM/YYYY HH:mm');
    };

    const formatearMoneda = (monto: number, moneda: string) => {
        return `${moneda} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return 'warning';
            case 'EN_PROCESO': return 'info';
            case 'COMPLETADO': return 'success';
            case 'CANCELADO': return 'error';
            default: return 'default';
        }
    };

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'ALTA': return 'error';
            case 'MEDIA': return 'warning';
            case 'BAJA': return 'success';
            default: return 'default';
        }
    };

    const getHistorialIcon = (tipo: string) => {
        switch (tipo) {
            case 'CREACION': return <CheckCircleIcon />;
            case 'MODIFICACION': return <EditIcon />;
            case 'STATUS_CHANGE': return <TrendingUpIcon />;
            case 'COMENTARIO': return <NoteIcon />;
            default: return <InfoIcon />;
        }
    };

    // Acciones
    const actions = [
        { icon: <EditIcon />, name: 'Editar', action: () => setOpenEditDialog(true) },
        { icon: <PrintIcon />, name: 'Imprimir', action: () => window.print() },
        { icon: <DownloadIcon />, name: 'Exportar PDF', action: () => console.log('Exportar PDF') },
        { icon: <ShareIcon />, name: 'Compartir', action: () => console.log('Compartir') },
        { icon: <EmailIcon />, name: 'Enviar Email', action: () => console.log('Enviar Email') },
        { icon: <FileCopyIcon />, name: 'Duplicar', action: () => console.log('Duplicar') },
    ];

    return (
        <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                sx={{ mb: 3 }}
            >
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/')}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    onClick={() => navigate('/ordenes')}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <ListIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Órdenes de Pedido
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <VisibilityIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    {orden.correlativoOPCI}
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent sx={{ color: 'white', pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                📋 {orden.correlativoOPCI}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                {orden.razonSocialCliente}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Chip
                                label={orden.status}
                                color={getStatusColor(orden.status) as any}
                                sx={{ mb: 1, fontWeight: 'bold' }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                {formatearMoneda(orden.totalSinIgv, orden.moneda)}
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CalendarIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Fecha Recepción
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {formatearFecha(orden.fecRecep)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AssignmentIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    N° Operación
                                </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {orden.numOp}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Progreso
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={orden.progreso}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        flexGrow: 1,
                                        mr: 1,
                                        bgcolor: 'rgba(255,255,255,0.3)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: 'white',
                                        },
                                    }}
                                />
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {orden.progreso}%
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WarningIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Prioridad
                                </Typography>
                            </Box>
                            <Chip
                                label={orden.prioridad}
                                color={getPrioridadColor(orden.prioridad) as any}
                                variant="filled"
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Contenido principal con tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab
                            label="Información General"
                            icon={<InfoIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Detalle de Items"
                            icon={<AssignmentIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Historial"
                            icon={<HistoryIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Timeline"
                            icon={<TimelineIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="Documentos"
                            icon={<AttachmentIcon />}
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                {/* Tab 1: Información General */}
                <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                        {/* Información Principal */}
                        <Grid item xs={12} lg={6}>
                            <Card variant="outlined" sx={{ height: 'fit-content' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                        <InfoIcon sx={{ mr: 1 }} />
                                        Información Principal
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Correlativo OPCI
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {orden.correlativoOPCI}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                N° Operación
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {orden.numOp}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Fecha Recepción
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatearFecha(orden.fecRecep)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Fecha Inicio
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatearFecha(orden.fecInicio)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Fecha Proc. VI
                                            </Typography>
                                            <Typography variant="body1">
                                                {formatearFecha(orden.fecProcVi)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                N° Ref. Cliente
                                            </Typography>
                                            <Typography variant="body1">
                                                {orden.numRefCliente}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">
                                                Observaciones
                                            </Typography>
                                            <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                                                <Typography variant="body2">
                                                    {orden.observaciones}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Información del Cliente */}
                        <Grid item xs={12} lg={6}>
                            <Card variant="outlined" sx={{ height: 'fit-content' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                                        <BusinessIcon sx={{ mr: 1 }} />
                                        Información del Cliente
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">
                                                Razón Social
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                {orden.razonSocialCliente}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">
                                                Cliente Final
                                            </Typography>
                                            <Typography variant="body1">
                                                {orden.clienteFinal}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">
                                                Cliente Proveedor
                                            </Typography>
                                            <Typography variant="body1">
                                                {orden.clienteProveedor}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                Contacto Principal
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <PersonIcon sx={{ mr: 1 }} />
                                        Equipo de Ventas
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={orden.vendedor1}
                                                secondary="Vendedor Principal"
                                            />
                                            <ListItemSecondaryAction>
                                                <Chip label="Principal" color="primary" size="small" />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {orden.vendedor2 && (
                                            <ListItem>
                                                <ListItemIcon>
                                                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={orden.vendedor2}
                                                    secondary="Vendedor Secundario"
                                                />
                                                <ListItemSecondaryAction>
                                                    <Chip label="Secundario" color="secondary" size="small" />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )}
                                        <ListItem>
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                    <PersonIcon />
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={orden.lider}
                                                secondary="Líder de Equipo"
                                            />
                                            <ListItemSecondaryAction>
                                                <Chip label="Líder" color="warning" size="small" />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Tab 2: Detalle de Items */}
                <TabPanel value={tabValue} index={1}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            📦 Items de la Orden ({items.length})
                        </Typography>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Total de items: {items.length} | Progreso general: {orden.progreso}%
                        </Alert>
                    </Box>

                    <Grid container spacing={2}>
                        {items.map((item, index) => (
                            <Grid item xs={12} key={item.id}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={8}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2, mt: 0.5 }}>
                                                        {index + 1}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                            {item.descripcion}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                                            <Chip
                                                                label={item.itemOP}
                                                                size="small"
                                                                variant="outlined"
                                                                color="primary"
                                                            />
                                                            <Chip
                                                                label={item.codigoComercial}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                            <Chip
                                                                label={item.tipoNegocio}
                                                                size="small"
                                                                color="secondary"
                                                            />
                                                            <Chip
                                                                label={item.statusOP}
                                                                size="small"
                                                                color={getStatusColor(item.statusOP) as any}
                                                            />
                                                        </Box>
                                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                                            <Grid item xs={6} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Cantidad
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {item.cantidad} {item.unidadMedida}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    PVU
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {formatearMoneda(item.pvu, orden.moneda)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Total
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                                    {formatearMoneda(item.total, orden.moneda)}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6} sm={3}>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Fecha Requerida
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    {formatearFecha(item.fechaRequerida)}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={4}>
                                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Progreso del Item
                                                    </Typography>
                                                    <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                borderRadius: '50%',
                                                                background: `conic-gradient(
                                                                    ${item.progreso >= 100 ? '#4caf50' : '#2196f3'} ${item.progreso * 3.6}deg,
                                                                    #e0e0e0 ${item.progreso * 3.6}deg
                                                                )`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 60,
                                                                    height: 60,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                                    {item.progreso}%
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                                        Información Adicional
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Cotización:</strong> {item.numCotizacion}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Deal:</strong> {item.numeroDeal}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                        <strong>Proyecto:</strong> {item.numeroProyecto}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <strong>Entrega:</strong> {item.semanasEntrega} semanas
                                                    </Typography>
                                                </Box>
                                                {item.requiereArmado && (
                                                    <Chip
                                                        label="Requiere Armado"
                                                        color="warning"
                                                        size="small"
                                                        icon={<SettingsIcon />}
                                                        sx={{ mb: 1 }}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>

                                        {/* Notas del item */}
                                        {item.notas.length > 0 && (
                                            <Accordion sx={{ mt: 2 }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="subtitle2">
                                                        📝 Notas y Comentarios ({item.notas.length})
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <List dense>
                                                        {item.notas.map((nota, noteIndex) => (
                                                            <ListItem key={noteIndex}>
                                                                <ListItemIcon>
                                                                    <NoteIcon color="primary" />
                                                                </ListItemIcon>
                                                                <ListItemText primary={nota} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                {/* Tab 3: Historial */}
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        📚 Historial de Cambios
                    </Typography>
                    
                    <List>
                        {historial.map((item, index) => (
                            <React.Fragment key={index}>
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon>
                                        <Avatar sx={{ bgcolor: getStatusColor(item.tipo) + '.main' }}>
                                            {getHistorialIcon(item.tipo)}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {item.accion}
                                                </Typography>
                                                <Chip
                                                    label={item.tipo}
                                                    size="small"
                                                    color={getStatusColor(item.tipo) as any}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.primary">
                                                    {item.descripcion}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        👤 {item.usuario}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        🕒 {formatearFecha(item.fecha)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < historial.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                </TabPanel>

                {/* Tab 4: Timeline */}
                <TabPanel value={tabValue} index={3}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        ⏱️ Timeline del Proyecto
                    </Typography>
                    
                    <Timeline position="alternate">
                        <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {formatearFecha(orden.fechaCreacion)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="success">
                                    <CheckCircleIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h1">
                                        Orden Creada
                                    </Typography>
                                    <Typography>Se creó la orden de pedido {orden.correlativoOPCI}</Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {formatearFecha(orden.fecRecep)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="primary">
                                    <ScheduleIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h1">
                                        Recepción
                                    </Typography>
                                    <Typography>Orden recibida y procesada</Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {formatearFecha(orden.fecInicio)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="info">
                                    <TrendingUpIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h1">
                                        Inicio de Procesamiento
                                    </Typography>
                                    <Typography>Se inició el procesamiento de la orden</Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {formatearFecha(orden.fecProcVi)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color="warning">
                                    <AssessmentIcon />
                                </TimelineDot>
                            </TimelineSeparator>
                            <TimelineContent>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h6" component="h1">
                                        Procesamiento VI
                                    </Typography>
                                    <Typography>Fecha programada para procesamiento VI</Typography>
                                </Paper>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </TabPanel>

                {/* Tab 5: Documentos */}
                <TabPanel value={tabValue} index={4}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        📎 Documentos y Archivos
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        📄 Documentos Principales
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachmentIcon color="primary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Orden de Compra"
                                                secondary="OC-2025-001.pdf"
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end">
                                                    <DownloadIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachmentIcon color="secondary" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Cotización"
                                                secondary="COT-2024-456.pdf"
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end">
                                                    <DownloadIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AttachmentIcon color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Especificaciones Técnicas"
                                                secondary="SPEC-TECH-001.docx"
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end">
                                                    <DownloadIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        📊 Reportes Generados
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <AssessmentIcon color="info" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Reporte de Avance"
                                                secondary="Actualizado hoy"
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end">
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <PrintIcon color="warning" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Orden Impresa"
                                                secondary="PDF generado"
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end">
                                                    <PrintIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<AttachmentIcon />}
                                            onClick={() => console.log('Subir archivo')}
                                        >
                                            Subir Nuevo Documento
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Card>

            {/* Speed Dial para acciones rápidas */}
            <SpeedDial
                ariaLabel="Acciones rápidas"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>

            {/* Diálogo para editar orden */}
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    ✏️ Editar Orden: {orden.correlativoOPCI}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={orden.status}
                                    label="Status"
                                    onChange={(e) => setOrden(prev => ({ ...prev, status: e.target.value as any }))}
                                >
                                    <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                                    <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
                                    <MenuItem value="COMPLETADO">Completado</MenuItem>
                                    <MenuItem value="CANCELADO">Cancelado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Prioridad</InputLabel>
                                <Select
                                    value={orden.prioridad}
                                    label="Prioridad"
                                    onChange={(e) => setOrden(prev => ({ ...prev, prioridad: e.target.value as any }))}
                                >
                                    <MenuItem value="ALTA">Alta</MenuItem>
                                    <MenuItem value="MEDIA">Media</MenuItem>
                                    <MenuItem value="BAJA">Baja</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Observaciones"
                                value={orden.observaciones}
                                onChange={(e) => setOrden(prev => ({ ...prev, observaciones: e.target.value }))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Aquí iría la lógica para guardar cambios
                            setOpenEditDialog(false);
                        }}
                    >
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para agregar nota */}
            <Dialog
                open={openNoteDialog}
                onClose={() => setOpenNoteDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    📝 Agregar Nota
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Nueva nota"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenNoteDialog(false); setNewNote(''); }}>
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Aquí iría la lógica para guardar la nota
                            setOpenNoteDialog(false);
                            setNewNote('');
                        }}
                    >
                        Agregar Nota
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Botón flotante para volver */}
            <Fab
                color="secondary"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                }}
                onClick={() => navigate(-1)}
            >
                <ArrowBackIcon />
            </Fab>
        </Box>
    );
};

export default Details;