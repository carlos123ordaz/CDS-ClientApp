import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Grid,
    MenuItem,
    Pagination,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Divider,
    Menu,
    MenuList,
    ListItemIcon,
    ListItemText,
    TableSortLabel,
    Skeleton,
    Alert,
    Fab,
    Badge,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Add as AddIcon,
    Download as DownloadIcon,
    Print as PrintIcon,
    MoreVert as MoreVertIcon,
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
    Refresh as RefreshIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { FilterCard } from 'src/components/shared/FilterCard';

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
        moneda: 'PEN',
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
        moneda: 'USD',
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
        moneda: 'PEN',
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
    type FieldOption = {
        name: string;
        value: string;
    };
    type Field = {
        active: boolean;
        name: string;
        type: 'text' | 'select' | 'date' | 'number';
        options?: FieldOption[];
        value?: string | number;
    };

    type Fields = Record<string, Field>;

    const fields: Fields = {
        moneda: {
            active: false,
            name: 'Moneda',
            type: 'select',
            options: [
                { name: 'Soles', value: 'S' },
                { name: 'Dólares', value: 'D' },
            ],
        },
    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 3 }}>
                <FilterCard path="/pedidos-crear" fieldsProp={fields} btnName="Nuevo pedido" />
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
                                        <TableCell>Fecha de inicio</TableCell>
                                        <TableCell>Fecha de procesamiento</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>N° Operación</TableCell>
                                        <TableCell>Moneda</TableCell>
                                        <TableCell sx={{ width: 120 }}> Total sin IGV</TableCell>
                                        <TableCell>Cliente final</TableCell>
                                        <TableCell>Cliente Proveedor</TableCell>
                                        <TableCell>Vendedor</TableCell>
                                        <TableCell>Lider</TableCell>
                                        <TableCell sx={{ width: 120 }}>U. Bruta Coti</TableCell>
                                        <TableCell>Comisión compartida</TableCell>
                                        <TableCell>Cantidad</TableCell>
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
                                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }} >
                                                            {orden.correlativoOPCI}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {orden.formaPago}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {moment(orden.fecRecep).format('DD/MM/YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {moment(orden.fecInicio).format('DD/MM/YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" >
                                                            {moment(orden.fecInicio).format('DD/MM/YYYY')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.clienteFinal}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.numOp}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.moneda}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.totalSinIgv}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.clienteFinal}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" >
                                                            {orden.clienteProveedor}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', width: 100 }}>
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
                                                        <Typography variant="body2">
                                                            {orden.lider}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.ubrutaCoti}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {orden.comisionCompartida ? 'SI' : 'NO'}
                                                        </Typography>
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
                                <SendIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Enviar a compras</ListItemText>
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