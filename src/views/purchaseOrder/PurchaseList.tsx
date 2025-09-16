import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Autocomplete,
    IconButton,
    Chip,
    Tooltip,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    TablePagination,
    Checkbox,
    Menu,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    Skeleton,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Fab,
    Badge
} from "@mui/material";
import {
    Add as AddIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    GetApp as ExportIcon,
    Refresh as RefreshIcon,
    ViewList as ViewListIcon,
    ViewModule as ViewModuleIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    Assignment as AssignmentIcon,
    Business as BusinessIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router";

// Interfaces
interface OrdenCompra {
    OCID: number;
    TipoOC: string;
    NumeroOC: string;
    FechaOC: string;
    FormaPagoID: number;
    OPCIID: number | null;
    MonedaID: number | null;
    MontoTotal: number | null;
    EstadoID: number | null;
    FechaCreacion: string;
    ProveedorID: number;
    RSocialProveedor: string;
    FormaPago?: {
        FormaPagoID: number;
        Descripcion: string;
    };
    Moneda?: {
        MonedaID: number;
        Nombre: string;
        Codigo: string;
    };
    Estado?: {
        EstadoID: number;
        Descripcion: string;
    };
    OrdenPedido?: {
        OPCIID: number;
        CorrelativoOPCI: string;
    };
}

interface OrdenPedido {
    OPCIID: number;
    CorrelativoOPCI: string;
    FechaRecepcion: string;
    MontoTotalSinIGV: number | null;
    NumeroReferenciaCliente: string | null;
    Cliente?: {
        EmpresaID: number;
        RazonSocial: string;
    };
}

interface FilterState {
    searchTerm: string;
    estado: string;
    tipoOC: string;
    moneda: string;
    fechaDesde: string;
    fechaHasta: string;
    proveedor: string;
}

// Modal para seleccionar orden de pedido
const SeleccionarPedidoModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onConfirm: (pedidoId: number) => void;
}> = ({ open, onClose, onConfirm }) => {
    const [ordenesPedido, setOrdenesPedido] = useState<OrdenPedido[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<OrdenPedido | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (open) {
            fetchOrdenesPedido();
        }
    }, [open]);

    const fetchOrdenesPedido = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockPedidos: OrdenPedido[] = [
                {
                    OPCIID: 105,
                    CorrelativoOPCI: "OP-2025-0045",
                    FechaRecepcion: "2025-09-14T08:30:00.000Z",
                    MontoTotalSinIGV: 35000.00,
                    NumeroReferenciaCliente: "REQ-2025-078",
                    Cliente: {
                        EmpresaID: 2001,
                        RazonSocial: "MINERA YANACOCHA S.R.L."
                    }
                },
                {
                    OPCIID: 106,
                    CorrelativoOPCI: "OP-2025-0046",
                    FechaRecepcion: "2025-09-13T10:15:00.000Z",
                    MontoTotalSinIGV: 18500.00,
                    NumeroReferenciaCliente: "SOL-456789",
                    Cliente: {
                        EmpresaID: 2002,
                        RazonSocial: "PETROPERU S.A."
                    }
                },
                {
                    OPCIID: 107,
                    CorrelativoOPCI: "OP-2025-0047",
                    FechaRecepcion: "2025-09-15T14:45:00.000Z",
                    MontoTotalSinIGV: 67200.00,
                    NumeroReferenciaCliente: "COTIZ-2025-123",
                    Cliente: {
                        EmpresaID: 2003,
                        RazonSocial: "SOUTHERN COPPER CORPORATION"
                    }
                }
            ];
            setOrdenesPedido(mockPedidos);
        } catch (error) {
            console.error("Error al cargar órdenes de pedido:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (selectedPedido) {
            onConfirm(selectedPedido.OPCIID);
        }
    };

    const handleClose = () => {
        setSelectedPedido(null);
        setSearchTerm("");
        onClose();
    };

    const filteredPedidos = ordenesPedido.filter(pedido =>
        pedido.CorrelativoOPCI.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.Cliente?.RazonSocial || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.NumeroReferenciaCliente || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Seleccionar Orden de Pedido</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        label="Buscar por correlativo, cliente o referencia"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                    />
                </Box>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Autocomplete
                        options={filteredPedidos}
                        getOptionLabel={(option) =>
                            `${option.CorrelativoOPCI} - ${option.Cliente?.RazonSocial || 'Sin cliente'}`
                        }
                        value={selectedPedido}
                        onChange={(_, value) => setSelectedPedido(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Seleccionar Orden de Pedido"
                                placeholder="Busca y selecciona una orden de pedido"
                                size="small"
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {option.CorrelativoOPCI}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Cliente: {option.Cliente?.RazonSocial || 'No definido'}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                        Fecha: {new Date(option.FechaRecepcion).toLocaleDateString()}
                                        {option.MontoTotalSinIGV && ` - Total: ${option.MontoTotalSinIGV.toFixed(2)}`}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                        noOptionsText="No se encontraron órdenes de pedido disponibles"
                    />
                )}
                {selectedPedido && (
                    <Paper sx={{ p: 2, mt: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Orden Seleccionada:
                        </Typography>
                        <Typography variant="body2">
                            <strong>Correlativo:</strong> {selectedPedido.CorrelativoOPCI}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Cliente:</strong> {selectedPedido.Cliente?.RazonSocial || 'No definido'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Fecha:</strong> {new Date(selectedPedido.FechaRecepcion).toLocaleDateString()}
                        </Typography>
                        {selectedPedido.NumeroReferenciaCliente && (
                            <Typography variant="body2">
                                <strong>Ref. Cliente:</strong> {selectedPedido.NumeroReferenciaCliente}
                            </Typography>
                        )}
                    </Paper>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} variant="outlined">
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} variant="contained" disabled={!selectedPedido}>
                    Crear Orden de Compra
                </Button>
            </DialogActions>
        </Dialog>
    );
};


const OrdenCompraList = () => {
    const [allRows, setAllRows] = useState<OrdenCompra[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState<keyof OrdenCompra>('FechaOC');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [showStats, setShowStats] = useState(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    // Estados de filtros
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        estado: '',
        tipoOC: '',
        moneda: '',
        fechaDesde: '',
        fechaHasta: '',
        proveedor: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockData: OrdenCompra[] = [
                {
                    OCID: 1,
                    TipoOC: "NACIONAL",
                    NumeroOC: "OC-2025-001",
                    FechaOC: "2025-09-10T10:30:00.000Z",
                    FormaPagoID: 1,
                    OPCIID: 101,
                    MonedaID: 1,
                    MontoTotal: 45750.00,
                    EstadoID: 2,
                    FechaCreacion: "2025-09-10T10:30:00.000Z",
                    ProveedorID: 1001,
                    RSocialProveedor: "TECNOLOGIA AVANZADA S.A.C.",
                    FormaPago: { FormaPagoID: 1, Descripcion: "30 días" },
                    Moneda: { MonedaID: 1, Nombre: "Soles", Codigo: "PEN" },
                    Estado: { EstadoID: 2, Descripcion: "APROBADO" },
                    OrdenPedido: { OPCIID: 101, CorrelativoOPCI: "OP-2025-0025" }
                },
                {
                    OCID: 2,
                    TipoOC: "IMPORTACION",
                    NumeroOC: "OC-2025-002",
                    FechaOC: "2025-09-12T14:15:00.000Z",
                    FormaPagoID: 2,
                    OPCIID: 102,
                    MonedaID: 2,
                    MontoTotal: 12500.00,
                    EstadoID: 1,
                    FechaCreacion: "2025-09-12T14:15:00.000Z",
                    ProveedorID: 1002,
                    RSocialProveedor: "SIEMENS PERU S.A.",
                    FormaPago: { FormaPagoID: 2, Descripcion: "60 días" },
                    Moneda: { MonedaID: 2, Nombre: "Dólares Americanos", Codigo: "USD" },
                    Estado: { EstadoID: 1, Descripcion: "PENDIENTE" },
                    OrdenPedido: { OPCIID: 102, CorrelativoOPCI: "OP-2025-0031" }
                },
                {
                    OCID: 3,
                    TipoOC: "NACIONAL",
                    NumeroOC: "OC-2025-003",
                    FechaOC: "2025-09-13T09:45:00.000Z",
                    FormaPagoID: 3,
                    OPCIID: null,
                    MonedaID: 1,
                    MontoTotal: 8950.00,
                    EstadoID: 3,
                    FechaCreacion: "2025-09-13T09:45:00.000Z",
                    ProveedorID: 1003,
                    RSocialProveedor: "DISTRIBUIDORA ELECTRONICA LTDA",
                    FormaPago: { FormaPagoID: 3, Descripcion: "Al contado" },
                    Moneda: { MonedaID: 1, Nombre: "Soles", Codigo: "PEN" },
                    Estado: { EstadoID: 3, Descripcion: "EN_PROCESO" },
                    OrdenPedido: undefined
                },
                {
                    OCID: 4,
                    TipoOC: "IMPORTACION",
                    NumeroOC: "OC-2025-004",
                    FechaOC: "2025-09-14T16:20:00.000Z",
                    FormaPagoID: 1,
                    OPCIID: 103,
                    MonedaID: 2,
                    MontoTotal: 75320.50,
                    EstadoID: 4,
                    FechaCreacion: "2025-09-14T16:20:00.000Z",
                    ProveedorID: 1004,
                    RSocialProveedor: "SCHNEIDER ELECTRIC PERU S.A.",
                    FormaPago: { FormaPagoID: 1, Descripcion: "30 días" },
                    Moneda: { MonedaID: 2, Nombre: "Dólares Americanos", Codigo: "USD" },
                    Estado: { EstadoID: 4, Descripcion: "COMPLETADO" },
                    OrdenPedido: { OPCIID: 103, CorrelativoOPCI: "OP-2025-0028" }
                },
                {
                    OCID: 5,
                    TipoOC: "NACIONAL",
                    NumeroOC: "OC-2025-005",
                    FechaOC: "2025-09-15T11:10:00.000Z",
                    FormaPagoID: 2,
                    OPCIID: 104,
                    MonedaID: 1,
                    MontoTotal: 23800.00,
                    EstadoID: 5,
                    FechaCreacion: "2025-09-15T11:10:00.000Z",
                    ProveedorID: 1005,
                    RSocialProveedor: "MOTORES Y EQUIPOS INDUSTRIALES S.R.L.",
                    FormaPago: { FormaPagoID: 2, Descripcion: "60 días" },
                    Moneda: { MonedaID: 1, Nombre: "Soles", Codigo: "PEN" },
                    Estado: { EstadoID: 5, Descripcion: "RECHAZADO" },
                    OrdenPedido: { OPCIID: 104, CorrelativoOPCI: "OP-2025-0042" }
                },
                {
                    OCID: 6,
                    TipoOC: "NACIONAL",
                    NumeroOC: "OC-2025-006",
                    FechaOC: "2025-09-16T08:00:00.000Z",
                    FormaPagoID: 1,
                    OPCIID: null,
                    MonedaID: 1,
                    MontoTotal: 15200.00,
                    EstadoID: 1,
                    FechaCreacion: "2025-09-16T08:00:00.000Z",
                    ProveedorID: 1006,
                    RSocialProveedor: "FERRETERIA INDUSTRIAL S.A.C.",
                    FormaPago: { FormaPagoID: 1, Descripcion: "30 días" },
                    Moneda: { MonedaID: 1, Nombre: "Soles", Codigo: "PEN" },
                    Estado: { EstadoID: 1, Descripcion: "PENDIENTE" },
                    OrdenPedido: undefined
                }
            ];

            setAllRows(mockData);
        } catch (error) {
            console.error("Error al cargar órdenes de compra:", error);
            setError('Error al cargar las órdenes de compra. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // Filtros aplicados
    const filteredAndSortedRows = useMemo(() => {
        let filtered = allRows.filter(row => {
            const matchesSearch =
                row.NumeroOC.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                row.RSocialProveedor.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                (row.OrdenPedido?.CorrelativoOPCI || '').toLowerCase().includes(filters.searchTerm.toLowerCase());

            const matchesEstado = !filters.estado || row.Estado?.Descripcion === filters.estado;
            const matchesTipo = !filters.tipoOC || row.TipoOC === filters.tipoOC;
            const matchesMoneda = !filters.moneda || row.Moneda?.Codigo === filters.moneda;
            const matchesProveedor = !filters.proveedor ||
                row.RSocialProveedor.toLowerCase().includes(filters.proveedor.toLowerCase());

            let matchesFecha = true;
            if (filters.fechaDesde) {
                matchesFecha = matchesFecha && new Date(row.FechaOC) >= new Date(filters.fechaDesde);
            }
            if (filters.fechaHasta) {
                matchesFecha = matchesFecha && new Date(row.FechaOC) <= new Date(filters.fechaHasta);
            }

            return matchesSearch && matchesEstado && matchesTipo && matchesMoneda && matchesProveedor && matchesFecha;
        });

        // Ordenamiento
        filtered.sort((a, b) => {
            let aValue = a[orderBy];
            let bValue = b[orderBy];

            if (orderBy === 'MontoTotal') {
                aValue = aValue || 0;
                bValue = bValue || 0;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

        return filtered;
    }, [allRows, filters, orderBy, order]);

    const paginatedRows = filteredAndSortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            estado: '',
            tipoOC: '',
            moneda: '',
            fechaDesde: '',
            fechaHasta: '',
            proveedor: ''
        });
        setPage(0);
    };

    const handleSelectRow = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        setSelectedRows(
            selectedRows.length === paginatedRows.length
                ? []
                : paginatedRows.map(row => row.OCID)
        );
    };

    const handleSort = (property: keyof OrdenCompra) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const exportData = () => {
        const csvContent = [
            ['Número OC', 'Tipo', 'Fecha', 'Estado', 'Proveedor', 'Monto', 'Moneda'].join(','),
            ...filteredAndSortedRows.map(row => [
                row.NumeroOC,
                row.TipoOC,
                new Date(row.FechaOC).toLocaleDateString(),
                row.Estado?.Descripcion || '',
                row.RSocialProveedor,
                row.MontoTotal || 0,
                row.Moneda?.Codigo || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'ordenes_compra.csv';
        link.click();
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getChipColor = (estado: string) => {
        const colores: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
            'PENDIENTE': 'warning',
            'APROBADO': 'success',
            'RECHAZADO': 'error',
            'EN_PROCESO': 'info',
            'COMPLETADO': 'primary'
        };
        return colores[estado] || 'default';
    };

    const getTipoOCColor = (tipo: string) => {
        const colores: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
            'NACIONAL': 'info',
            'IMPORTACION': 'secondary'
        };
        return colores[tipo] || 'default';
    };

    const estados = Array.from(new Set(allRows.map(row => row.Estado?.Descripcion).filter(Boolean)));
    const tipos = Array.from(new Set(allRows.map(row => row.TipoOC)));
    const monedas = Array.from(new Set(allRows.map(row => row.Moneda?.Codigo).filter(Boolean)));

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={fetchData}>
                        Reintentar
                    </Button>
                }>
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                <Stack direction="row" spacing={2}>
                    <ToggleButtonGroup
                        value={showStats}
                        exclusive
                        onChange={(_, value) => setShowStats(value)}
                        size="small"
                    >
                        <ToggleButton value={true}>
                            <TrendingUpIcon />
                        </ToggleButton>
                        <ToggleButton value={false}>
                            <ViewListIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={fetchData}
                        disabled={loading}
                    >
                        Actualizar
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<ExportIcon />}
                        onClick={exportData}
                        size="small"
                        disabled={filteredAndSortedRows.length === 0}
                    >
                        Exportar
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => window.location.href = '/compras-crear'}
                    >
                        Nueva Orden
                    </Button>
                </Stack>
            </Box>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Buscar"
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.estado}
                                label="Estado"
                                onChange={(e) => handleFilterChange('estado', e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {estados.map(estado => (
                                    <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={filters.tipoOC}
                                label="Tipo"
                                onChange={(e) => handleFilterChange('tipoOC', e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {tipos.map(tipo => (
                                    <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Moneda</InputLabel>
                            <Select
                                value={filters.moneda}
                                label="Moneda"
                                onChange={(e) => handleFilterChange('moneda', e.target.value)}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {monedas.map(moneda => (
                                    <MenuItem key={moneda} value={moneda}>{moneda}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 6, md: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Desde"
                            type="date"
                            value={filters.fechaDesde}
                            onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={clearFilters}
                            startIcon={<CloseIcon />}
                            size="small"
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                {loading ? (
                    <Box sx={{ p: 3 }}>
                        {[...Array(5)].map((_, index) => (
                            <Skeleton key={index} variant="rectangular" height={60} sx={{ mb: 1 }} />
                        ))}
                    </Box>
                ) : (
                    <>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedRows.length}
                                                checked={paginatedRows.length > 0 && selectedRows.length === paginatedRows.length}
                                                onChange={handleSelectAll}
                                            />
                                        </TableCell>
                                        <TableCell
                                            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                            onClick={() => handleSort('NumeroOC')}
                                        >
                                            Número OC
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                        <TableCell
                                            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                            onClick={() => handleSort('FechaOC')}
                                        >
                                            Fecha OC
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Orden Pedido</TableCell>
                                        <TableCell
                                            sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                                            onClick={() => handleSort('MontoTotal')}
                                        >
                                            Monto Total
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Moneda</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedRows.length > 0 ? (
                                        paginatedRows.map((row) => (
                                            <TableRow
                                                key={row.OCID}
                                                hover
                                                selected={selectedRows.includes(row.OCID)}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedRows.includes(row.OCID)}
                                                        onChange={() => handleSelectRow(row.OCID)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {row.NumeroOC}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.TipoOC}
                                                        size="small"
                                                        color={getTipoOCColor(row.TipoOC)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatearFecha(row.FechaOC)}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.Estado?.Descripcion || 'Sin estado'}
                                                        size="small"
                                                        color={getChipColor(row.Estado?.Descripcion || '')}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {row.RSocialProveedor}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {row.OrdenPedido ? (
                                                        <Chip
                                                            label={row.OrdenPedido.CorrelativoOPCI}
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Sin OP
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {row.MontoTotal ? (
                                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                            {row.MontoTotal.toLocaleString('es-PE', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            —
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {row.Moneda?.Codigo || '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <Tooltip title="Ver detalles">
                                                            <IconButton
                                                                size="small"
                                                                color="info"
                                                                onClick={() => navigate(`/compras/${row.OCID}`)}
                                                            >
                                                                <ViewIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Editar">
                                                            <IconButton
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => navigate(`/compras-editar/${row.OCID}`)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                                <Typography variant="h6" color="text.secondary">
                                                    No hay órdenes de compra que coincidan con los filtros
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Intenta ajustar los filtros o crear una nueva orden
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={filteredAndSortedRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                        />
                    </>
                )}
            </Paper>

            {/* Acciones flotantes para selecciones múltiples */}
            {selectedRows.length > 0 && (
                <Fab
                    color="primary"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <Badge badgeContent={selectedRows.length} color="error">
                        <MoreVertIcon />
                    </Badge>
                </Fab>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => console.log('Aprobar seleccionados')}>
                    <ListItemIcon><CheckIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Aprobar Seleccionados ({selectedRows.length})</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => console.log('Rechazar seleccionados')}>
                    <ListItemIcon><CancelIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Rechazar Seleccionados</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => console.log('Exportar seleccionados')}>
                    <ListItemIcon><ExportIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Exportar Seleccionados</ListItemText>
                </MenuItem>
            </Menu>

            {/* Modal de selección de pedido */}
            <SeleccionarPedidoModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={(pedidoId) => {
                    setModalOpen(false);
                    window.location.href = `/compras-crear?pedidoId=${pedidoId}`;
                }}
            />
        </Box>
    );
};

export default OrdenCompraList;