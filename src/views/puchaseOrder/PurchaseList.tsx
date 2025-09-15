import { useEffect, useState } from "react";
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
} from "@mui/material";
import {
    Add as AddIcon,
    Close as CloseIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

// Interfaces según tu DB
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
    // Datos relacionados
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
            // Simulamos datos de ejemplo para órdenes de pedido disponibles
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
                },
                {
                    OPCIID: 108,
                    CorrelativoOPCI: "OP-2025-0048",
                    FechaRecepcion: "2025-09-12T16:20:00.000Z",
                    MontoTotalSinIGV: 12800.00,
                    NumeroReferenciaCliente: null,
                    Cliente: {
                        EmpresaID: 2004,
                        RazonSocial: "CEMENTOS LIMA S.A.A."
                    }
                },
                {
                    OPCIID: 109,
                    CorrelativoOPCI: "OP-2025-0049",
                    FechaRecepcion: "2025-09-11T11:30:00.000Z",
                    MontoTotalSinIGV: 89500.00,
                    NumeroReferenciaCliente: "PO-MIN-2025-034",
                    Cliente: {
                        EmpresaID: 2005,
                        RazonSocial: "VOLCAN COMPAÑIA MINERA S.A.A."
                    }
                },
                {
                    OPCIID: 110,
                    CorrelativoOPCI: "OP-2025-0050",
                    FechaRecepcion: "2025-09-10T09:45:00.000Z",
                    MontoTotalSinIGV: 25600.00,
                    NumeroReferenciaCliente: "ORD-IND-789",
                    Cliente: {
                        EmpresaID: 2006,
                        RazonSocial: "INDUSTRIAS DEL ESPINO S.A."
                    }
                }
            ];

            setOrdenesPedido(mockPedidos);

            // Para usar con backend real:
            // const response = await fetch("/api/ordenes-pedido?disponibles=true");
            // const data = await response.json();
            // setOrdenesPedido(data);
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
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Seleccionar Orden de Pedido
                    </Typography>
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
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    disabled={!selectedPedido}
                >
                    Crear Orden de Compra
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const OrdenCompraList = () => {
    const [rows, setRows] = useState<OrdenCompra[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Simulamos datos de ejemplo mientras no tienes backend
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simular loading

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
                    FormaPago: {
                        FormaPagoID: 1,
                        Descripcion: "30 días"
                    },
                    Moneda: {
                        MonedaID: 1,
                        Nombre: "Soles",
                        Codigo: "PEN"
                    },
                    Estado: {
                        EstadoID: 2,
                        Descripcion: "APROBADO"
                    },
                    OrdenPedido: {
                        OPCIID: 101,
                        CorrelativoOPCI: "OP-2025-0025"
                    }
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
                    FormaPago: {
                        FormaPagoID: 2,
                        Descripcion: "60 días"
                    },
                    Moneda: {
                        MonedaID: 2,
                        Nombre: "Dólares Americanos",
                        Codigo: "USD"
                    },
                    Estado: {
                        EstadoID: 1,
                        Descripcion: "PENDIENTE"
                    },
                    OrdenPedido: {
                        OPCIID: 102,
                        CorrelativoOPCI: "OP-2025-0031"
                    }
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
                    FormaPago: {
                        FormaPagoID: 3,
                        Descripcion: "Al contado"
                    },
                    Moneda: {
                        MonedaID: 1,
                        Nombre: "Soles",
                        Codigo: "PEN"
                    },
                    Estado: {
                        EstadoID: 3,
                        Descripcion: "EN_PROCESO"
                    },
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
                    FormaPago: {
                        FormaPagoID: 1,
                        Descripcion: "30 días"
                    },
                    Moneda: {
                        MonedaID: 2,
                        Nombre: "Dólares Americanos",
                        Codigo: "USD"
                    },
                    Estado: {
                        EstadoID: 4,
                        Descripcion: "COMPLETADO"
                    },
                    OrdenPedido: {
                        OPCIID: 103,
                        CorrelativoOPCI: "OP-2025-0028"
                    }
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
                    FormaPago: {
                        FormaPagoID: 2,
                        Descripcion: "60 días"
                    },
                    Moneda: {
                        MonedaID: 1,
                        Nombre: "Soles",
                        Codigo: "PEN"
                    },
                    Estado: {
                        EstadoID: 5,
                        Descripcion: "RECHAZADO"
                    },
                    OrdenPedido: {
                        OPCIID: 104,
                        CorrelativoOPCI: "OP-2025-0042"
                    }
                }
            ];

            setRows(mockData);

            // Para usar con backend real, descomenta esto:
            // const res = await fetch("/api/ordenes-compra");
            // const data = await res.json();
            // setRows(data);
        } catch (error) {
            console.error("Error al cargar órdenes de compra:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNuevaOrden = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handlePedidoSeleccionado = (pedidoId: number) => {
        setModalOpen(false);
        // Redirige a la pantalla de crear con el ID del pedido
        navigate(`/compras-crear?pedidoId=${pedidoId}`);
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

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                {/* Título y botón */}
                <Grid
                    size={{ xs: 12 }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h4" fontWeight={600}>
                        Órdenes de Compra
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/compras-crear')}
                    >
                        Nueva Orden de Compra
                    </Button>
                </Grid>

                {/* Tabla */}
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {loading ? (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="300px"
                            >
                                <CircularProgress />
                                <Typography sx={{ ml: 2 }}>Cargando órdenes de compra...</Typography>
                            </Box>
                        ) : (
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Número OC</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Fecha OC</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Orden Pedido</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Monto Total</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Moneda</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.length > 0 ? (
                                            rows.map((row) => (
                                                <TableRow key={row.OCID} hover>
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
                                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                    <Typography variant="h6" color="text.secondary">
                                                        No hay órdenes de compra registradas
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Haz clic en "Nueva Orden de Compra" para crear la primera
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Modal de selección de pedido */}
            <SeleccionarPedidoModal
                open={modalOpen}
                onClose={handleModalClose}
                onConfirm={handlePedidoSeleccionado}
            />
        </Box>
    );
};

export default OrdenCompraList;