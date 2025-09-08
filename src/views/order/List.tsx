import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    Divider,
    InputAdornment,
    Menu,
    MenuList,
    ListItemIcon,
    ListItemText,
    TableSortLabel,
    Skeleton,
    Alert,
    Fab,
    Badge,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    Business as BusinessIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    ExpandMore as ExpandMoreIcon,
    Clear as ClearIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';

// Interfaces
interface OrdenPedido {
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
}

interface DetalleOrden {
    itemOP: string;
    codigoComercial: string;
    cantidad: number;
    unidadMedida: string;
    pvu: number;
    total: number;
    tipoNegocio: string;
    statusOP: string;
}

interface FiltrosState {
    busqueda: string;
    status: string;
    vendedor: string;
    cliente: string;
    fechaDesde: Dayjs | null;
    fechaHasta: Dayjs | null;
    moneda: string;
    montoMinimo: string;
    montoMaximo: string;
}

// Datos de ejemplo (simularían venir de una API)
const ordenesEjemplo: OrdenPedido[] = [
    {
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
        cantidadItems: 5,
        fechaCreacion: '2025-01-15T10:30:00Z',
        ultimaModificacion: '2025-01-18T16:45:00Z',
    },
    {
        correlativoOPCI: 'OP-2025-002',
        fecRecep: '2025-01-16T14:20:00Z',
        fecInicio: '2025-01-17T09:00:00Z',
        fecProcVi: '2025-01-22T11:30:00Z',
        razonSocialCliente: 'TECNOLOGÍA AVANZADA LTDA.',
        numOp: 'OP-789457',
        moneda: '$',
        totalSinIgv: 8975.25,
        numRefCliente: 'REF-2025-002',
        formaPago: 'CONTADO',
        clienteFinal: 'TECH SOLUTIONS',
        clienteProveedor: 'PROVEEDOR GAMMA',
        vendedor1: 'Ana Torres',
        vendedor2: '',
        lider: 'Roberto Silva',
        ubrutaCoti: 'COT-2024-457',
        comisionCompartida: false,
        status: 'COMPLETADO',
        cantidadItems: 3,
        fechaCreacion: '2025-01-16T14:20:00Z',
        ultimaModificacion: '2025-01-19T12:15:00Z',
    },
    {
        correlativoOPCI: 'OP-2025-003',
        fecRecep: '2025-01-17T11:15:00Z',
        fecInicio: '2025-01-18T10:00:00Z',
        fecProcVi: '2025-01-25T15:00:00Z',
        razonSocialCliente: 'SERVICIOS INDUSTRIALES S.A.',
        numOp: 'OP-789458',
        moneda: 'S/',
        totalSinIgv: 45720.80,
        numRefCliente: 'REF-2025-003',
        formaPago: 'CREDITO 45 DIAS',
        clienteFinal: 'INDUSTRIAS BETA',
        clienteProveedor: 'PROVEEDOR ALPHA',
        vendedor1: 'Luis Mendoza',
        vendedor2: 'Patricia Ruiz',
        lider: 'Carlos López',
        ubrutaCoti: 'COT-2024-458',
        comisionCompartida: true,
        status: 'PENDIENTE',
        cantidadItems: 8,
        fechaCreacion: '2025-01-17T11:15:00Z',
        ultimaModificacion: '2025-01-17T11:15:00Z',
    },
];

const detallesEjemplo: Record<string, DetalleOrden[]> = {
    'OP-2025-001': [
        {
            itemOP: 'ITEM-001',
            codigoComercial: 'CC-12345',
            cantidad: 10,
            unidadMedida: 'UND',
            pvu: 2543.05,
            total: 25430.50,
            tipoNegocio: 'PRODUCTO',
            statusOP: 'EN_PROCESO',
        },
    ],
    'OP-2025-002': [
        {
            itemOP: 'ITEM-002',
            codigoComercial: 'CC-67890',
            cantidad: 5,
            unidadMedida: 'SET',
            pvu: 1795.05,
            total: 8975.25,
            tipoNegocio: 'SERVICIO',
            statusOP: 'COMPLETADO',
        },
    ],
};

const List = () => {
    // Estados principales
    const [ordenes, setOrdenes] = React.useState<OrdenPedido[]>(ordenesEjemplo);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [rowsPerPage] = React.useState(10);
    const [totalItems, setTotalItems] = React.useState(ordenesEjemplo.length);
    const [orderBy, setOrderBy] = React.useState<keyof OrdenPedido>('fecRecep');
    const [order, setOrder] = React.useState<'asc' | 'desc'>('desc');

    // Estados para diálogos y menús
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState<OrdenPedido | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedOrderForMenu, setSelectedOrderForMenu] = React.useState<OrdenPedido | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const navigate = useNavigate();
    // Estados para filtros
    const [filtros, setFiltros] = React.useState<FiltrosState>({
        busqueda: '',
        status: '',
        vendedor: '',
        cliente: '',
        fechaDesde: null,
        fechaHasta: null,
        moneda: '',
        montoMinimo: '',
        montoMaximo: '',
    });
    const [filtrosAbiertos, setFiltrosAbiertos] = React.useState(false);

    // Función para obtener color del status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return 'warning';
            case 'EN_PROCESO': return 'info';
            case 'COMPLETADO': return 'success';
            case 'CANCELADO': return 'error';
            default: return 'default';
        }
    };

    // Función para formatear fecha
    const formatearFecha = (fecha: string) => {
        return dayjs(fecha).format('DD/MM/YYYY HH:mm');
    };

    // Función para formatear moneda
    const formatearMoneda = (monto: number, moneda: string) => {
        return `${moneda} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    };

    // Manejo de ordenamiento
    const handleRequestSort = (property: keyof OrdenPedido) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Aplicar filtros
    const aplicarFiltros = () => {
        setLoading(true);
        // Aquí iría la lógica real de filtrado con API
        setTimeout(() => {
            let ordenesFiltradas = [...ordenesEjemplo];

            // Filtro por búsqueda
            if (filtros.busqueda) {
                ordenesFiltradas = ordenesFiltradas.filter(orden =>
                    orden.correlativoOPCI.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                    orden.razonSocialCliente.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                    orden.numOp.toLowerCase().includes(filtros.busqueda.toLowerCase())
                );
            }

            // Filtro por status
            if (filtros.status) {
                ordenesFiltradas = ordenesFiltradas.filter(orden => orden.status === filtros.status);
            }

            // Filtro por moneda
            if (filtros.moneda) {
                ordenesFiltradas = ordenesFiltradas.filter(orden => orden.moneda === filtros.moneda);
            }

            // Filtro por fechas
            if (filtros.fechaDesde) {
                ordenesFiltradas = ordenesFiltradas.filter(orden =>
                    dayjs(orden.fecRecep).isAfter(filtros.fechaDesde)
                );
            }

            if (filtros.fechaHasta) {
                ordenesFiltradas = ordenesFiltradas.filter(orden =>
                    dayjs(orden.fecRecep).isBefore(filtros.fechaHasta)
                );
            }

            setOrdenes(ordenesFiltradas);
            setTotalItems(ordenesFiltradas.length);
            setLoading(false);
        }, 1000);
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltros({
            busqueda: '',
            status: '',
            vendedor: '',
            cliente: '',
            fechaDesde: null,
            fechaHasta: null,
            moneda: '',
            montoMinimo: '',
            montoMaximo: '',
        });
        setOrdenes(ordenesEjemplo);
        setTotalItems(ordenesEjemplo.length);
    };

    // Ver detalle de orden
    const verDetalle = (orden: OrdenPedido) => {
        setSelectedOrder(orden);
        setOpenDetailDialog(true);
    };
    const editarOrden = (orden: OrdenPedido) => {
        navigate('/orden-edit/:1')
    };

    // Abrir menú de acciones
    const abrirMenu = (event: React.MouseEvent<HTMLElement>, orden: OrdenPedido) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrderForMenu(orden);
    };

    // Cerrar menú
    const cerrarMenu = () => {
        setAnchorEl(null);
        setSelectedOrderForMenu(null);
    };

    // Eliminar orden
    const eliminarOrden = () => {
        if (selectedOrderForMenu) {
            setOrdenes(ordenes.filter(o => o.correlativoOPCI !== selectedOrderForMenu.correlativoOPCI));
            setTotalItems(prev => prev - 1);
        }
        setOpenDeleteDialog(false);
        cerrarMenu();
    };

    // Calcular estadísticas
    const estadisticas = React.useMemo(() => {
        const total = ordenes.reduce((sum, orden) => sum + orden.totalSinIgv, 0);
        const porStatus = ordenes.reduce((acc, orden) => {
            acc[orden.status] = (acc[orden.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { total, porStatus };
    }, [ordenes]);

    React.useEffect(() => {
        // Simular carga inicial
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 3 }}>
                {/* Header con estadísticas */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <CardContent sx={{ color: 'white' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AssignmentIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Total Órdenes</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {totalItems}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <CardContent sx={{ color: 'white' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <MoneyIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Valor Total</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {formatearMoneda(estadisticas.total, 'S/')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid  size={{ xs: 12, md: 3 }}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <CardContent sx={{ color: 'white' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TrendingUpIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">En Proceso</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {estadisticas.porStatus.EN_PROCESO || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                            <CardContent sx={{ color: 'white' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Completadas</Typography>
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                    {estadisticas.porStatus.COMPLETADO || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filtros y búsqueda */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                <SearchIcon sx={{ mr: 1 }} />
                                Búsqueda y Filtros
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                            >
                                {filtrosAbiertos ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                            </Button>
                        </Box>

                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Buscar por correlativo, cliente o N° operación..."
                                    value={filtros.busqueda}
                                    onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filtros.status}
                                        label="Status"
                                        onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <MenuItem value="">Todos</MenuItem>
                                        <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                                        <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
                                        <MenuItem value="COMPLETADO">Completado</MenuItem>
                                        <MenuItem value="CANCELADO">Cancelado</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Moneda</InputLabel>
                                    <Select
                                        value={filtros.moneda}
                                        label="Moneda"
                                        onChange={(e) => setFiltros(prev => ({ ...prev, moneda: e.target.value }))}
                                    >
                                        <MenuItem value="">Todas</MenuItem>
                                        <MenuItem value="S/">Soles</MenuItem>
                                        <MenuItem value="$">Dólares</MenuItem>
                                        <MenuItem value="€">Euros</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={aplicarFiltros}
                                    disabled={loading}
                                    startIcon={<SearchIcon />}
                                >
                                    Buscar
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={limpiarFiltros}
                                    startIcon={<ClearIcon />}
                                >
                                    Limpiar
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Filtros avanzados */}
                        {filtrosAbiertos && (
                            <Accordion sx={{ mt: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>Filtros Avanzados</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <DatePicker
                                                label="Fecha Desde"
                                                value={filtros.fechaDesde}
                                                onChange={(newValue) => setFiltros(prev => ({ ...prev, fechaDesde: newValue }))}
                                                slotProps={{
                                                    textField: { size: 'small', fullWidth: true }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <DatePicker
                                                label="Fecha Hasta"
                                                value={filtros.fechaHasta}
                                                onChange={(newValue) => setFiltros(prev => ({ ...prev, fechaHasta: newValue }))}
                                                slotProps={{
                                                    textField: { size: 'small', fullWidth: true }
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Monto Mínimo"
                                                type="number"
                                                value={filtros.montoMinimo}
                                                onChange={(e) => setFiltros(prev => ({ ...prev, montoMinimo: e.target.value }))}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Monto Máximo"
                                                type="number"
                                                value={filtros.montoMaximo}
                                                onChange={(e) => setFiltros(prev => ({ ...prev, montoMaximo: e.target.value }))}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </CardContent>
                </Card>

                {/* Tabla de órdenes */}
                <Card>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Typography variant="h6">
                                📋 Lista de Órdenes de Pedido
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    onClick={() => window.location.reload()}
                                    size="small"
                                >
                                    Actualizar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    size="small"
                                >
                                    Exportar
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<PrintIcon />}
                                    size="small"
                                >
                                    Imprimir
                                </Button>
                            </Box>
                        </Box>
                        <Divider />

                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'correlativoOPCI'}
                                                direction={orderBy === 'correlativoOPCI' ? order : 'asc'}
                                                onClick={() => handleRequestSort('correlativoOPCI')}
                                            >
                                                Correlativo
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'fecRecep'}
                                                direction={orderBy === 'fecRecep' ? order : 'asc'}
                                                onClick={() => handleRequestSort('fecRecep')}
                                            >
                                                Fecha Recepción
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>N° Operación</TableCell>
                                        <TableCell>
                                            <TableSortLabel
                                                active={orderBy === 'totalSinIgv'}
                                                direction={orderBy === 'totalSinIgv' ? order : 'asc'}
                                                onClick={() => handleRequestSort('totalSinIgv')}
                                            >
                                                Total
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Vendedor</TableCell>
                                        <TableCell>Items</TableCell>
                                        <TableCell align="center">Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        Array.from(new Array(5)).map((_, index) => (
                                            <TableRow key={index}>
                                                {Array.from(new Array(9)).map((_, cellIndex) => (
                                                    <TableCell key={cellIndex}>
                                                        <Skeleton variant="text" />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : ordenes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                <Alert severity="info" sx={{ m: 2 }}>
                                                    No se encontraron órdenes de pedido
                                                </Alert>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        ordenes
                                            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                                            .map((orden) => (
                                                <TableRow key={orden.correlativoOPCI} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {orden.correlativoOPCI}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {orden.formaPago}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={orden.status}
                                                            size="small"
                                                            color={getStatusColor(orden.status) as any}
                                                            variant="filled"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main' }}>
                                                                <PersonIcon fontSize="small" />
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2">
                                                                    {orden.vendedor1}
                                                                </Typography>
                                                                {orden.vendedor2 && (
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        + {orden.vendedor2}
                                                                    </Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge badgeContent={orden.cantidadItems} color="primary">
                                                            <AssignmentIcon color="action" />
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            <Tooltip title="Ver detalle">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => verDetalle(orden)}
                                                                >
                                                                    <ViewIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Editar">
                                                                <IconButton
                                                                    size="small"
                                                                    color="secondary"
                                                                    onClick={() => editarOrden(orden)}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Más acciones">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => abrirMenu(e, orden)}
                                                                >
                                                                    <MoreVertIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Paginación */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Mostrando {((page - 1) * rowsPerPage) + 1} - {Math.min(page * rowsPerPage, totalItems)} de {totalItems} registros
                            </Typography>
                            <Pagination
                                count={Math.ceil(totalItems / rowsPerPage)}
                                page={page}
                                onChange={(_, newPage) => setPage(newPage)}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* FAB para agregar nueva orden */}
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }}
                    onClick={() => console.log('Ir a crear nueva orden')}
                >
                    <AddIcon />
                </Fab>

                {/* Diálogo de detalle */}
                <Dialog
                    open={openDetailDialog}
                    onClose={() => setOpenDetailDialog(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">
                                📋 Detalle de Orden: {selectedOrder?.correlativoOPCI}
                            </Typography>
                            <IconButton onClick={() => setOpenDetailDialog(false)}>
                                <ClearIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedOrder && (
                            <Grid container spacing={3}>
                                {/* Información principal */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                ℹ️ Información Principal
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Correlativo OPCI
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {selectedOrder.correlativoOPCI}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        N° Operación
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {selectedOrder.numOp}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Fecha Recepción
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatearFecha(selectedOrder.fecRecep)}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Fecha Inicio
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {formatearFecha(selectedOrder.fecInicio)}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Status
                                                    </Typography>
                                                    <Box sx={{ mt: 0.5 }}>
                                                        <Chip
                                                            label={selectedOrder.status}
                                                            color={getStatusColor(selectedOrder.status) as any}
                                                            variant="filled"
                                                        />
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Información del cliente */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                🏢 Información del Cliente
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Razón Social
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {selectedOrder.razonSocialCliente}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Cliente Final
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.clienteFinal || 'No especificado'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Cliente Proveedor
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.clienteProveedor || 'No especificado'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        N° Referencia Cliente
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.numRefCliente}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Información financiera */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                💰 Información Financiera
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Total sin IGV
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                        {formatearMoneda(selectedOrder.totalSinIgv, selectedOrder.moneda)}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Forma de Pago
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.formaPago}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Ubruta Cotización
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedOrder.ubrutaCoti}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedOrder.comisionCompartida}
                                                                disabled
                                                            />
                                                        }
                                                        label="Comisión Compartida"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Información de vendedores */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                👥 Equipo de Ventas
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Vendedor Principal
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                                                            <PersonIcon fontSize="small" />
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {selectedOrder.vendedor1}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                {selectedOrder.vendedor2 && (
                                                    <Grid size={{ xs: 12 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Vendedor Secundario
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }}>
                                                                <PersonIcon fontSize="small" />
                                                            </Avatar>
                                                            <Typography variant="body2">
                                                                {selectedOrder.vendedor2}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                )}
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Líder
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'warning.main' }}>
                                                            <PersonIcon fontSize="small" />
                                                        </Avatar>
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {selectedOrder.lider}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Detalle de items */}
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                📦 Detalle de Items ({selectedOrder.cantidadItems} items)
                                            </Typography>
                                            {detallesEjemplo[selectedOrder.correlativoOPCI] ? (
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Item OP</TableCell>
                                                                <TableCell>Código Comercial</TableCell>
                                                                <TableCell>Cantidad</TableCell>
                                                                <TableCell>U.M.</TableCell>
                                                                <TableCell>PVU</TableCell>
                                                                <TableCell>Total</TableCell>
                                                                <TableCell>Tipo</TableCell>
                                                                <TableCell>Status</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {detallesEjemplo[selectedOrder.correlativoOPCI].map((detalle, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{detalle.itemOP}</TableCell>
                                                                    <TableCell>{detalle.codigoComercial}</TableCell>
                                                                    <TableCell>{detalle.cantidad}</TableCell>
                                                                    <TableCell>{detalle.unidadMedida}</TableCell>
                                                                    <TableCell>{formatearMoneda(detalle.pvu, selectedOrder.moneda)}</TableCell>
                                                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                                                        {formatearMoneda(detalle.total, selectedOrder.moneda)}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={detalle.tipoNegocio}
                                                                            size="small"
                                                                            variant="outlined"
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={detalle.statusOP}
                                                                            size="small"
                                                                            color={getStatusColor(detalle.statusOP) as any}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Alert severity="info">
                                                    No hay detalles disponibles para esta orden
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button startIcon={<PrintIcon />} variant="outlined">
                            Imprimir
                        </Button>
                        <Button startIcon={<DownloadIcon />} variant="outlined">
                            Exportar PDF
                        </Button>
                        <Button startIcon={<EditIcon />} variant="contained">
                            Editar Orden
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Menú de acciones */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={cerrarMenu}
                >
                    <MenuList>
                        <MenuItem onClick={() => { verDetalle(selectedOrderForMenu!); cerrarMenu(); }}>
                            <ListItemIcon>
                                <ViewIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Ver Detalle</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={cerrarMenu}>
                            <ListItemIcon>
                                <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Editar</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={cerrarMenu}>
                            <ListItemIcon>
                                <PrintIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Imprimir</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={cerrarMenu}>
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Exportar PDF</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem 
                            onClick={() => { setOpenDeleteDialog(true); cerrarMenu(); }}
                            sx={{ color: 'error.main' }}
                        >
                            <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Eliminar</ListItemText>
                        </MenuItem>
                    </MenuList>
                </Menu>

                {/* Diálogo de confirmación de eliminación */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle>
                        ⚠️ Confirmar Eliminación
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Está seguro que desea eliminar la orden "{selectedOrderForMenu?.correlativoOPCI}"?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Esta acción no se puede deshacer.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={eliminarOrden} 
                            color="error" 
                            variant="contained"
                            startIcon={<DeleteIcon />}
                        >
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default List;