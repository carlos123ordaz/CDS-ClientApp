import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    TextField,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Chip,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Collapse,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingCartIcon,
    Inventory as InventoryIcon,
    CheckCircle as CheckCircleIcon,
    Search as SearchIcon,
    ExpandLess,
    ExpandMore,
    Settings as SettingsIcon,
    Warning as WarningIcon,
    Close as CloseIcon,
    ShoppingBag,
    Assignment,
    Business,
    Preview
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Interfaces actualizadas
interface OrdenPedido {
    OPCIID: number;
    CorrelativoOPCI: string;
    FecRecepcion: string;
    MdaID: number;
    NumReferClt: string;
    FormaPagoID: number;
    Cliente: {
        EmpresaID: number;
        RazonSocial: string;
    };
    Moneda: {
        MdaID: number;
        Codigo: string;
        Nombre: string;
    };
}

interface ItemPedido {
    DetalleID: number;
    OPCIID: number;
    ItemID: number;
    CodCom: string;
    Cantidad: number;
    PrecioVentaUnit: number;
    NumCoti: string;
    FecReqClt: string;
    Item: {
        ItemID: number;
        Descrip: string;
        CodigoERP: string;
        UnidadMedida: string;
    };
    stockDisponible: number;
    cantidadNecesaria: number;
    requiereCompra: boolean;
    pedidoOrigen: OrdenPedido;
}

interface Proveedor {
    EmpresaID: number;
    RazonSocial: string;
    NumDoc: string;
    Estado: boolean;
}

interface FormaPago {
    FormaPagoID: number;
    Descrip: string;
}

interface DetalleCompraForm {
    ItemID: number;
    OPCIID: number;
    ItemOC: string;
    ItemOP: string;
    Cantidad: number;
    MdaID: number;
    PrecioCompraUnitario1: number;
    PrecioCompraUnitario2: number;
    TipoCambioUSD: number;
    TiempoEntregaSemanas: number;
    NumCotizacionProveedor: string;
    FecOfrecida: string;
    NumConfirmProveedor: string;
    FecProveedorInicial: string;
    FecProveedorAct1: string;
    FecProveedorAct2: string;
    FecProveedorAct3: string;
    FecProveedorAct4: string;
    OperadorLogisticoID: number | null;
    FecInvoice: string;
    NumInvoice: string;
    NumItemInvoice: string;
    PaisEmbarque: string;
    CiudadEmbarque: string;
    PaisOrigen: string;
    NumDocTransporte: string;
    ETA: string;
    PesoBrutoKgs: number;
    FleteUSD: number;
    TipoEmbarque: string;
    IncotermID: number;
    TipoEmbarqueID: number;
    GImportacionID: number;
    EstadoID: number;
    Nota1: string;
    Nota2: string;
    Nota3: string;
    Nota4: string;
}

interface Incoterm {
    IncotermID: number;
    Codigo: string;
    Descrip: string;
}

interface TipoEmbarque {
    TipoEmbarqueID: number;
    Nombre: string;
}

interface OperadorLogistico {
    OperadorID: number;
    Nombre: string;
}

interface OrdenCompraForm {
    TipoOC: string;
    NumeroOC: string;
    FechaOC: string;
    FormaPagoID: number;
    MdaID: number;
    ProveedorID: number;
    RSocialProveedor: string;
}

// Custom Tab Panel Component
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
            id={`orden-compra-tabpanel-${index}`}
            aria-labelledby={`orden-compra-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

// Modal para configurar detalle de compra
const DetalleCompraModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onSave: (detalle: DetalleCompraForm) => void;
    item: ItemPedido;
    tipoOC: string;
    incoterms: Incoterm[];
    tiposEmbarque: TipoEmbarque[];
    operadores: OperadorLogistico[];
}> = ({ open, onClose, onSave, item, tipoOC, incoterms, tiposEmbarque, operadores }) => {
    const { register, handleSubmit, control, formState: { errors } } = useForm<DetalleCompraForm>({
        defaultValues: {
            ItemID: item.ItemID,
            OPCIID: item.OPCIID,
            ItemOC: item.CodCom,
            ItemOP: item.CodCom,
            Cantidad: item.cantidadNecesaria,
            MdaID: 1,
            PrecioCompraUnitario1: item.PrecioVentaUnit * 0.8,
            PrecioCompraUnitario2: 0,
            TipoCambioUSD: 3.75,
            TiempoEntregaSemanas: 2,
            NumCotizacionProveedor: '',
            FecOfrecida: '',
            NumConfirmProveedor: '',
            FecProveedorInicial: '',
            FecProveedorAct1: '',
            FecProveedorAct2: '',
            FecProveedorAct3: '',
            FecProveedorAct4: '',
            OperadorLogisticoID: null,
            FecInvoice: '',
            NumInvoice: '',
            NumItemInvoice: '',
            PaisEmbarque: tipoOC === 'IMPORTACION' ? 'China' : 'Perú',
            CiudadEmbarque: tipoOC === 'IMPORTACION' ? 'Shanghai' : 'Lima',
            PaisOrigen: tipoOC === 'IMPORTACION' ? 'China' : 'Perú',
            NumDocTransporte: '',
            ETA: '',
            PesoBrutoKgs: 0,
            FleteUSD: 0,
            TipoEmbarque: tipoOC === 'IMPORTACION' ? 'Marítimo' : 'Nacional',
            IncotermID: 1,
            TipoEmbarqueID: 1,
            GImportacionID: 1,
            EstadoID: 1,
            Nota1: '',
            Nota2: '',
            Nota3: '',
            Nota4: ''
        }
    });

    const handleSave = (data: DetalleCompraForm) => {
        onSave(data);
        onClose();
    };

    const esImportacion = tipoOC === 'IMPORTACION';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Configurar Detalle de Compra</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.Item.Descrip} - Cantidad: {item.cantidadNecesaria}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    {/* Información Básica */}
                    <Accordion defaultExpanded sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Información Básica y Precios
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Precio Compra Unitario 1 *"
                                        {...register('PrecioCompraUnitario1', { required: 'Campo requerido' })}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        inputProps={{ step: 0.01 }}
                                        error={!!errors.PrecioCompraUnitario1}
                                        helperText={errors.PrecioCompraUnitario1?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Precio Compra Unitario 2"
                                        {...register('PrecioCompraUnitario2')}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        inputProps={{ step: 0.01 }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Tipo de Cambio USD *"
                                        {...register('TipoCambioUSD', { required: 'Campo requerido' })}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        inputProps={{ step: 0.01 }}
                                        error={!!errors.TipoCambioUSD}
                                        helperText={errors.TipoCambioUSD?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Tiempo Entrega (Semanas) *"
                                        {...register('TiempoEntregaSemanas', { required: 'Campo requerido' })}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        inputProps={{ min: 1, step: 1 }}
                                        error={!!errors.TiempoEntregaSemanas}
                                        helperText={errors.TiempoEntregaSemanas?.message}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Información del Proveedor */}
                    <Accordion defaultExpanded sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Información del Proveedor
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="N° Cotización Proveedor"
                                        {...register('NumCotizacionProveedor')}
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="N° Confirmación Proveedor"
                                        {...register('NumConfirmProveedor')}
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="FecOfrecida"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="Fecha Ofrecida"
                                                onChange={(value) => field.onChange(value?.toISOString())}
                                                slotProps={{
                                                    textField: { size: 'small', fullWidth: true }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="FecProveedorInicial"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="Fecha Proveedor Inicial"
                                                onChange={(value) => field.onChange(value?.toISOString())}
                                                slotProps={{
                                                    textField: { size: 'small', fullWidth: true }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>

                    {/* Logística - Solo para importaciones */}
                    {esImportacion && (
                        <Accordion sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Logística y Embarque
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="País de Embarque"
                                            {...register('PaisEmbarque')}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Ciudad de Embarque"
                                            {...register('CiudadEmbarque')}
                                            size="small"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Peso Bruto (Kgs)"
                                            {...register('PesoBrutoKgs')}
                                            type="number"
                                            size="small"
                                            fullWidth
                                            inputProps={{ step: 0.01 }}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    )}

                    {/* Notas */}
                    <Accordion sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Notas y Observaciones
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Nota 1"
                                        {...register('Nota1')}
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Nota 2"
                                        {...register('Nota2')}
                                        size="small"
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                        Guardar Detalle
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const CrearOrdenCompraMultiple = () => {
    const navigate = useNavigate();

    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pedidosSeleccionados, setPedidosSeleccionados] = useState<OrdenPedido[]>([]);
    const [pedidosDisponibles, setPedidosDisponibles] = useState<OrdenPedido[]>([]);
    const [itemsConsolidados, setItemsConsolidados] = useState<ItemPedido[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [detallesCompra, setDetallesCompra] = useState<Map<number, DetalleCompraForm>>(new Map());
    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
    const [itemConfigurandoDetalle, setItemConfigurandoDetalle] = useState<ItemPedido | null>(null);
    const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
    const [tiposEmbarque, setTiposEmbarque] = useState<TipoEmbarque[]>([]);
    const [operadores, setOperadores] = useState<OperadorLogistico[]>([]);
    const [proveedores, setProveedores] = useState<Proveedor[]>([]);
    const [formasPago, setFormasPago] = useState<FormaPago[]>([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [vistaItems, setVistaItems] = useState(0);
    const [expandedPedidos, setExpandedPedidos] = useState<Record<number, boolean>>({});

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<OrdenCompraForm>({
        defaultValues: {
            TipoOC: 'NACIONAL',
            NumeroOC: `OC-2025-${String(Date.now()).slice(-3)}`,
            FechaOC: new Date().toISOString()
        }
    });

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        setLoading(true);
        try {
            const mockPedidos: OrdenPedido[] = [
                {
                    OPCIID: 105,
                    CorrelativoOPCI: "OP-2025-0045",
                    FecRecepcion: "2025-09-14T08:30:00.000Z",
                    MdaID: 1,
                    NumReferClt: "REQ-2025-078",
                    FormaPagoID: 1,
                    Cliente: { EmpresaID: 2001, RazonSocial: "MINERA YANACOCHA S.R.L." },
                    Moneda: { MdaID: 1, Codigo: "PEN", Nombre: "Soles" }
                },
                {
                    OPCIID: 106,
                    CorrelativoOPCI: "OP-2025-0046",
                    FecRecepcion: "2025-09-13T10:15:00.000Z",
                    MdaID: 1,
                    NumReferClt: "SOL-456789",
                    FormaPagoID: 1,
                    Cliente: { EmpresaID: 2002, RazonSocial: "PETROPERU S.A." },
                    Moneda: { MdaID: 1, Codigo: "PEN", Nombre: "Soles" }
                },
                {
                    OPCIID: 107,
                    CorrelativoOPCI: "OP-2025-0047",
                    FecRecepcion: "2025-09-15T14:45:00.000Z",
                    MdaID: 2,
                    NumReferClt: "COTIZ-2025-123",
                    FormaPagoID: 1,
                    Cliente: { EmpresaID: 2003, RazonSocial: "SOUTHERN COPPER CORPORATION" },
                    Moneda: { MdaID: 2, Codigo: "USD", Nombre: "Dólares" }
                }
            ];

            const mockProveedores: Proveedor[] = [
                { EmpresaID: 1001, RazonSocial: "TECNOLOGIA AVANZADA S.A.C.", NumDoc: "20123456789", Estado: true },
                { EmpresaID: 1002, RazonSocial: "SIEMENS PERU S.A.", NumDoc: "20987654321", Estado: true }
            ];

            const mockFormasPago: FormaPago[] = [
                { FormaPagoID: 1, Descrip: "30 días" },
                { FormaPagoID: 2, Descrip: "60 días" }
            ];

            setPedidosDisponibles(mockPedidos);
            setProveedores(mockProveedores);
            setFormasPago(mockFormasPago);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarItemsConsolidados = async (pedidos: OrdenPedido[]) => {
        setLoading(true);
        try {
            const todosLosItems: ItemPedido[] = [];

            for (const pedido of pedidos) {
                const itemsPedido: ItemPedido[] = [
                    {
                        DetalleID: pedido.OPCIID * 10 + 1,
                        OPCIID: pedido.OPCIID,
                        ItemID: 101,
                        CodCom: "MOT-001-24V",
                        Cantidad: 3,
                        PrecioVentaUnit: 2500.00,
                        NumCoti: "COT-2025-001",
                        FecReqClt: "2025-10-15T00:00:00.000Z",
                        Item: {
                            ItemID: 101,
                            Descrip: "Motor trifásico 24V 5HP",
                            CodigoERP: "ERP-MOT-001",
                            UnidadMedida: "UND"
                        },
                        stockDisponible: 1,
                        cantidadNecesaria: 2,
                        requiereCompra: true,
                        pedidoOrigen: pedido
                    },
                    {
                        DetalleID: pedido.OPCIID * 10 + 2,
                        OPCIID: pedido.OPCIID,
                        ItemID: 102,
                        CodCom: "SEN-TEMP-PT100",
                        Cantidad: 5,
                        PrecioVentaUnit: 450.00,
                        NumCoti: "COT-2025-001",
                        FecReqClt: "2025-10-15T00:00:00.000Z",
                        Item: {
                            ItemID: 102,
                            Descrip: "Sensor de temperatura PT100",
                            CodigoERP: "ERP-SEN-002",
                            UnidadMedida: "UND"
                        },
                        stockDisponible: 0,
                        cantidadNecesaria: 5,
                        requiereCompra: true,
                        pedidoOrigen: pedido
                    }
                ];
                todosLosItems.push(...itemsPedido);
            }

            setItemsConsolidados(todosLosItems);
            setSelectedItems(todosLosItems.filter(item => item.requiereCompra).map(item => item.DetalleID));
        } catch (error) {
            console.error('Error al cargar items:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePedidoSelection = (pedido: OrdenPedido) => {
        setPedidosSeleccionados(prev => {
            const existe = prev.find(p => p.OPCIID === pedido.OPCIID);
            if (existe) {
                const nuevosSeleccionados = prev.filter(p => p.OPCIID !== pedido.OPCIID);
                if (nuevosSeleccionados.length > 0) {
                    cargarItemsConsolidados(nuevosSeleccionados);
                } else {
                    setItemsConsolidados([]);
                    setSelectedItems([]);
                    setDetallesCompra(new Map());
                }
                return nuevosSeleccionados;
            } else {
                const nuevosSeleccionados = [...prev, pedido];
                cargarItemsConsolidados(nuevosSeleccionados);
                return nuevosSeleccionados;
            }
        });
    };

    const toggleItemSelection = (detalleId: number) => {
        setSelectedItems(prev => {
            if (prev.includes(detalleId)) {
                setDetallesCompra(prevDetalles => {
                    const newDetalles = new Map(prevDetalles);
                    newDetalles.delete(detalleId);
                    return newDetalles;
                });
                return prev.filter(id => id !== detalleId);
            } else {
                return [...prev, detalleId];
            }
        });
    };

    const abrirModalDetalle = (item: ItemPedido) => {
        setItemConfigurandoDetalle(item);
        setModalDetalleOpen(true);
    };

    const cerrarModalDetalle = () => {
        setModalDetalleOpen(false);
        setItemConfigurandoDetalle(null);
    };

    const guardarDetalleCompra = (detalle: DetalleCompraForm) => {
        if (itemConfigurandoDetalle) {
            setDetallesCompra(prev => new Map(prev.set(itemConfigurandoDetalle.DetalleID, detalle)));
        }
    };

    const togglePedidoExpansion = (opciid: number) => {
        setExpandedPedidos(prev => ({
            ...prev,
            [opciid]: !prev[opciid]
        }));
    };

    const calcularTotalCompra = () => {
        return Array.from(detallesCompra.values())
            .reduce((total, detalle) => total + (detalle.Cantidad * detalle.PrecioCompraUnitario1), 0);
    };

    const guardarOrdenCompra = async (data: OrdenCompraForm) => {
        try {
            const itemsSinDetalle = selectedItems.filter(itemId => !detallesCompra.has(itemId));

            if (itemsSinDetalle.length > 0) {
                alert(`Por favor configure el detalle de compra para todos los items seleccionados. Faltan ${itemsSinDetalle.length} item(s).`);
                return;
            }

            const ordenCompra = {
                ...data,
                MontoTotal: calcularTotalCompra(),
                pedidosAsociados: pedidosSeleccionados.map(p => p.OPCIID),
                detalles: Array.from(detallesCompra.values())
            };

            console.log('Guardando orden de compra consolidada:', ordenCompra);
            navigate('/compras');
        } catch (error) {
            console.error('Error al guardar orden de compra:', error);
        }
    };

    const pedidosFiltrados = pedidosDisponibles.filter(pedido =>
        pedido.Cliente.RazonSocial.toLowerCase().includes(filtroCliente.toLowerCase()) ||
        pedido.CorrelativoOPCI.toLowerCase().includes(filtroCliente.toLowerCase())
    );

    const itemsPorPedido = pedidosSeleccionados.reduce((acc, pedido) => {
        acc[pedido.OPCIID] = itemsConsolidados.filter(item => item.OPCIID === pedido.OPCIID);
        return acc;
    }, {} as Record<number, ItemPedido[]>);

    const tabsConfig = [
        { label: 'Seleccionar Pedidos', icon: <ShoppingBag />, disabled: false },
        { label: 'Configurar Items', icon: <Assignment />, disabled: pedidosSeleccionados.length === 0 },
        { label: 'Datos de la Orden', icon: <Business />, disabled: selectedItems.length === 0 },
        { label: 'Confirmar', icon: <Preview />, disabled: selectedItems.length !== detallesCompra.size || !watch('ProveedorID') }
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 2 }}>
                <Paper sx={{ mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => setTabValue(newValue)}
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        {tabsConfig.map((tab, index) => (
                            <Tab
                                key={index}
                                label={tab.label}
                                icon={tab.icon}
                                iconPosition="start"
                                disabled={tab.disabled}
                                sx={{
                                    minHeight: 72,
                                    '&.Mui-selected': {
                                        fontWeight: 'bold',
                                        color: 'primary.main'
                                    }
                                }}
                            />
                        ))}
                    </Tabs>

                    {/* Tab 1: Seleccionar Pedidos */}
                    <TabPanel value={tabValue} index={0}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Selecciona uno o más pedidos para consolidar en una orden de compra.
                            Los items se cargarán automáticamente.
                        </Alert>

                        <TextField
                            fullWidth
                            label="Filtrar por cliente o correlativo"
                            value={filtroCliente}
                            onChange={(e) => setFiltroCliente(e.target.value)}
                            size="small"
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />

                        <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 2 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Seleccionar</TableCell>
                                        <TableCell>Correlativo</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Moneda</TableCell>
                                        <TableCell>Ref. Cliente</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pedidosFiltrados.map((pedido) => {
                                        const seleccionado = pedidosSeleccionados.some(p => p.OPCIID === pedido.OPCIID);
                                        return (
                                            <TableRow key={pedido.OPCIID} hover>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={seleccionado}
                                                        onChange={() => togglePedidoSelection(pedido)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {pedido.CorrelativoOPCI}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {pedido.Cliente.RazonSocial}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(pedido.FecRecepcion).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={pedido.Moneda.Codigo} size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {pedido.NumReferClt || 'Sin ref.'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {pedidosSeleccionados.length > 0 && (
                            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Pedidos Seleccionados ({pedidosSeleccionados.length}):
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {pedidosSeleccionados.map((pedido) => (
                                        <Chip
                                            key={pedido.OPCIID}
                                            label={`${pedido.CorrelativoOPCI} - ${pedido.Cliente.RazonSocial}`}
                                            size="small"
                                            onDelete={() => togglePedidoSelection(pedido)}
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        )}
                    </TabPanel>

                    {/* Tab 2: Configurar Items */}
                    <TabPanel value={tabValue} index={1}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Selecciona los items que necesitas comprar y configura los detalles de cada uno.
                            <strong> Todos los items seleccionados deben tener su detalle configurado.</strong>
                        </Alert>

                        {selectedItems.length > 0 && selectedItems.length !== detallesCompra.size && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                {selectedItems.length - detallesCompra.size} item(s) pendiente(s) de configurar detalle de compra.
                            </Alert>
                        )}

                        <Box sx={{ mb: 2 }}>
                            <Tabs value={vistaItems} onChange={(_, newValue) => setVistaItems(newValue)}>
                                <Tab label="Vista por Pedido" />
                                <Tab label="Vista Consolidada" />
                            </Tabs>
                        </Box>

                        {vistaItems === 0 ? (
                            // Vista por Pedido
                            <Box>
                                {pedidosSeleccionados.map((pedido) => {
                                    const itemsDelPedido = itemsPorPedido[pedido.OPCIID] || [];
                                    const expanded = expandedPedidos[pedido.OPCIID] ?? true;
                                    const itemsSeleccionadosDelPedido = itemsDelPedido.filter(item => selectedItems.includes(item.DetalleID));

                                    return (
                                        <Card key={pedido.OPCIID} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => togglePedidoExpansion(pedido.OPCIID)}
                                                >
                                                    <Box>
                                                        <Typography variant="h6" color="primary">
                                                            {pedido.CorrelativoOPCI}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {pedido.Cliente.RazonSocial}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Chip
                                                            label={`${itemsSeleccionadosDelPedido.length}/${itemsDelPedido.length} items`}
                                                            size="small"
                                                            color={itemsSeleccionadosDelPedido.length > 0 ? "primary" : "default"}
                                                        />
                                                        {expanded ? <ExpandLess /> : <ExpandMore />}
                                                    </Box>
                                                </Box>

                                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                    <TableContainer sx={{ mt: 2 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Sel.</TableCell>
                                                                    <TableCell>Código</TableCell>
                                                                    <TableCell>Descripción</TableCell>
                                                                    <TableCell>Stock</TableCell>
                                                                    <TableCell>A Comprar</TableCell>
                                                                    <TableCell>Estado</TableCell>
                                                                    <TableCell>Configurar</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {itemsDelPedido.map((item) => {
                                                                    const estaSeleccionado = selectedItems.includes(item.DetalleID);
                                                                    const tieneDetalle = detallesCompra.has(item.DetalleID);

                                                                    return (
                                                                        <TableRow key={item.DetalleID}>
                                                                            <TableCell>
                                                                                <Checkbox
                                                                                    checked={estaSeleccionado}
                                                                                    onChange={() => toggleItemSelection(item.DetalleID)}
                                                                                    disabled={!item.requiereCompra}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2" fontWeight="bold">
                                                                                    {item.CodCom}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography variant="body2">
                                                                                    {item.Item.Descrip}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                    <InventoryIcon
                                                                                        fontSize="small"
                                                                                        color={item.stockDisponible >= item.Cantidad ? 'success' : 'error'}
                                                                                    />
                                                                                    {item.stockDisponible}
                                                                                </Box>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Typography
                                                                                    variant="body2"
                                                                                    fontWeight="bold"
                                                                                    color="error.main"
                                                                                >
                                                                                    {item.cantidadNecesaria}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Chip
                                                                                    label="Requiere Compra"
                                                                                    color="warning"
                                                                                    size="small"
                                                                                    icon={<ShoppingCartIcon />}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {estaSeleccionado && (
                                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                        <Button
                                                                                            size="small"
                                                                                            variant={tieneDetalle ? "contained" : "outlined"}
                                                                                            color={tieneDetalle ? "success" : "primary"}
                                                                                            startIcon={<SettingsIcon />}
                                                                                            onClick={() => abrirModalDetalle(item)}
                                                                                        >
                                                                                            {tieneDetalle ? 'Configurado' : 'Configurar'}
                                                                                        </Button>
                                                                                        {!tieneDetalle && (
                                                                                            <Tooltip title="Debe configurar el detalle de compra">
                                                                                                <WarningIcon color="warning" fontSize="small" />
                                                                                            </Tooltip>
                                                                                        )}
                                                                                    </Box>
                                                                                )}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Collapse>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        ) : (
                            // Vista Consolidada
                            <TableContainer component={Paper}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Seleccionar</TableCell>
                                            <TableCell>Código</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Pedidos Origen</TableCell>
                                            <TableCell>Total a Comprar</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell>Configurar</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(
                                            itemsConsolidados.reduce((acc, item) => {
                                                const key = item.ItemID;
                                                if (!acc[key]) {
                                                    acc[key] = {
                                                        ...item,
                                                        pedidosOrigen: [item.pedidoOrigen],
                                                        cantidadTotalNecesaria: item.cantidadNecesaria,
                                                        detalleIds: [item.DetalleID]
                                                    };
                                                } else {
                                                    acc[key].cantidadTotalNecesaria += item.cantidadNecesaria;
                                                    acc[key].pedidosOrigen.push(item.pedidoOrigen);
                                                    acc[key].detalleIds.push(item.DetalleID);
                                                }
                                                return acc;
                                            }, {} as Record<number, any>)
                                        ).map(([itemId, itemConsolidado]) => {
                                            const todosSeleccionados = itemConsolidado.detalleIds.every((id: number) => selectedItems.includes(id));
                                            const itemsSeleccionados = itemConsolidado.detalleIds.filter((id: number) => selectedItems.includes(id));
                                            const detallesConfigurados = itemsSeleccionados.filter((id: number) => detallesCompra.has(id));

                                            return (
                                                <TableRow key={itemId}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={todosSeleccionados}
                                                            onChange={() => {
                                                                itemConsolidado.detalleIds.forEach((detalleId: number) => {
                                                                    if (todosSeleccionados) {
                                                                        setSelectedItems(prev => prev.filter(id => id !== detalleId));
                                                                        setDetallesCompra(prev => {
                                                                            const newMap = new Map(prev);
                                                                            newMap.delete(detalleId);
                                                                            return newMap;
                                                                        });
                                                                    } else {
                                                                        setSelectedItems(prev => [...new Set([...prev, detalleId])]);
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {itemConsolidado.CodCom}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{itemConsolidado.Item.Descrip}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {itemConsolidado.pedidosOrigen.map((pedido: OrdenPedido, index: number) => (
                                                                <Chip
                                                                    key={`${pedido.OPCIID}-${index}`}
                                                                    label={pedido.CorrelativoOPCI}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ))}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                                                            {itemConsolidado.cantidadTotalNecesaria}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="Requiere Compra"
                                                            color="warning"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {itemsSeleccionados.length > 0 && (
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                <Typography variant="caption">
                                                                    {detallesConfigurados.length}/{itemsSeleccionados.length} configurados
                                                                </Typography>
                                                                {itemConsolidado.detalleIds
                                                                    .filter((id: number) => selectedItems.includes(id))
                                                                    .map((detalleId: number) => {
                                                                        const item = itemsConsolidados.find(i => i.DetalleID === detalleId);
                                                                        const tieneDetalle = detallesCompra.has(detalleId);
                                                                        return item ? (
                                                                            <Button
                                                                                key={detalleId}
                                                                                size="small"
                                                                                variant={tieneDetalle ? "contained" : "outlined"}
                                                                                color={tieneDetalle ? "success" : "primary"}
                                                                                onClick={() => abrirModalDetalle(item)}
                                                                                sx={{ minWidth: 80 }}
                                                                            >
                                                                                {item.pedidoOrigen.CorrelativoOPCI.slice(-4)}
                                                                            </Button>
                                                                        ) : null;
                                                                    })}
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </TabPanel>

                    {/* Tab 3: Datos de la Orden */}
                    <TabPanel value={tabValue} index={2}>
                        <form onSubmit={handleSubmit(guardarOrdenCompra)}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name="TipoOC"
                                        control={control}
                                        rules={{ required: 'Campo requerido' }}
                                        render={({ field }) => (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>Tipo de OC *</InputLabel>
                                                <Select {...field} label="Tipo de OC *">
                                                    <MenuItem value="NACIONAL">Nacional</MenuItem>
                                                    <MenuItem value="IMPORTACION">Importación</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Número de OC *"
                                        {...register('NumeroOC', { required: 'Campo requerido' })}
                                        size="small"
                                        fullWidth
                                        error={!!errors.NumeroOC}
                                        helperText={errors.NumeroOC?.message}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Controller
                                        name="FechaOC"
                                        control={control}
                                        rules={{ required: 'Campo requerido' }}
                                        render={({ field }) => (
                                            <DatePicker
                                                label="Fecha OC *"
                                                onChange={(value) => field.onChange(value?.toISOString())}
                                                slotProps={{
                                                    textField: { size: 'small', fullWidth: true }
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="ProveedorID"
                                        control={control}
                                        rules={{ required: 'Campo requerido' }}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={proveedores}
                                                getOptionLabel={(option) => option.RazonSocial}
                                                onChange={(_, value) => {
                                                    field.onChange(value?.EmpresaID);
                                                    setValue('RSocialProveedor', value?.RazonSocial || '');
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Proveedor *"
                                                        size="small"
                                                        error={!!errors.ProveedorID}
                                                        helperText={errors.ProveedorID?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Controller
                                        name="FormaPagoID"
                                        control={control}
                                        rules={{ required: 'Campo requerido' }}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={formasPago}
                                                getOptionLabel={(option) => option.Descrip}
                                                onChange={(_, value) => field.onChange(value?.FormaPagoID)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Forma de Pago *"
                                                        size="small"
                                                        error={!!errors.FormaPagoID}
                                                        helperText={errors.FormaPagoID?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </TabPanel>

                    {/* Tab 4: Confirmar */}
                    <TabPanel value={tabValue} index={3}>
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Revisa toda la información antes de crear la orden de compra.
                        </Alert>

                        {/* Resumen de Pedidos */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Pedidos Consolidados ({pedidosSeleccionados.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {pedidosSeleccionados.map((pedido) => (
                                    <Chip
                                        key={pedido.OPCIID}
                                        label={`${pedido.CorrelativoOPCI} - ${pedido.Cliente.RazonSocial}`}
                                        size="small"
                                        color="primary"
                                    />
                                ))}
                            </Box>
                        </Paper>

                        {/* Resumen de Items */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Items Seleccionados ({selectedItems.length})
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Código</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                            <TableCell>Precio Compra</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.from(detallesCompra.values()).map((detalle) => (
                                            <TableRow key={detalle.ItemID + '-' + detalle.OPCIID}>
                                                <TableCell>{detalle.ItemOC}</TableCell>
                                                <TableCell>
                                                    {itemsConsolidados.find(i => i.ItemID === detalle.ItemID)?.Item.Descrip}
                                                </TableCell>
                                                <TableCell>{detalle.Cantidad}</TableCell>
                                                <TableCell>PEN {detalle.PrecioCompraUnitario1.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Typography fontWeight="bold">
                                                        PEN {(detalle.Cantidad * detalle.PrecioCompraUnitario1).toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>

                        {/* Resumen de la Orden */}
                        <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="h6" gutterBottom>
                                Datos de la Orden de Compra
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2">
                                        <strong>Número OC:</strong> {watch('NumeroOC')}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Tipo:</strong> {watch('TipoOC')}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Fecha:</strong> {watch('FechaOC') ? new Date(watch('FechaOC')).toLocaleDateString() : 'No definida'}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2">
                                        <strong>Proveedor:</strong> {watch('RSocialProveedor') || 'No seleccionado'}
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        <strong>Total: PEN {calcularTotalCompra().toFixed(2)}</strong>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </TabPanel>
                </Paper>

                {/* Actions Footer */}
                <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" color="primary">
                                Total Estimado: PEN {calcularTotalCompra().toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Items seleccionados: {selectedItems.length} | Configurados: {detallesCompra.size}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Pedidos consolidados: {pedidosSeleccionados.length}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={() => navigate('/compras')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSubmit(guardarOrdenCompra)}
                                    disabled={selectedItems.length !== detallesCompra.size || !watch('ProveedorID')}
                                >
                                    Crear Orden de Compra
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Modal de configuración de detalle */}
                {itemConfigurandoDetalle && (
                    <DetalleCompraModal
                        open={modalDetalleOpen}
                        onClose={cerrarModalDetalle}
                        onSave={guardarDetalleCompra}
                        item={itemConfigurandoDetalle}
                        tipoOC={watch('TipoOC')}
                        incoterms={incoterms}
                        tiposEmbarque={tiposEmbarque}
                        operadores={operadores}
                    />
                )}
            </Box>
        </LocalizationProvider>)
}

export default CrearOrdenCompraMultiple;