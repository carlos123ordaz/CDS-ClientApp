import React from 'react';
import {
    TextField,
    Checkbox,
    Button,
    Box,
    Autocomplete,
    Typography,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Tooltip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Card,
    CardContent,
    Alert,
    Skeleton,
    Breadcrumbs,
    Link
} from '@mui/material';
import {
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    Save as SaveIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Clear as ClearIcon,
    Close as CloseIcon,
    ArrowBack as ArrowBackIcon,
    History as HistoryIcon,
    Restore as RestoreIcon
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

// Reutilizamos las interfaces del OrderCreate
interface FormData {
    fecRecep: string;
    fecInicio: string;
    fecProcVi: string;
    idClt: string;
    numOp: string;
    idMda: number;
    totalSinIgv: number;
    numRefCliente: string;
    idFp: number;
    ibCltFin: string;
    ibCltPrv: string;
    idVdr: string;
    ibVdr2: string;
    ibLider: string;
    ubrutaCoti: string;
    comisionCompartida: boolean;
    detalles: DetalleItem[];
}

interface DetalleItem {
    id: string;
    statusOP: string;
    tipoNegocio: string;
    subTipoNegocio1: string;
    subTipoNegocio2: string;
    itemOP: string;
    codigoComercial: string;
    cantidad: number;
    unidadMedida: string;
    moneda: string;
    pvu: number;
    tcUsd: number;
    fechaRequeridaCliente: string;
    teSemanasEntrega: number;
    numCotizacion: string;
    requiereArmado: boolean;
    codigoCliente: string;
    numeroDeal: string;
    numeroServicio: string;
    numeroProyecto: string;
    ccs: string;
    ccss: string;
    ccn: string;
    nota1: string;
    nota2: string;
    nota3: string;
    nota4: string;
}

// Interfaces de datos maestros (reutilizadas)
interface Vendedor {
    idVdr: string;
    nomVdr: string;
    ibLider: boolean;
}

interface Clientes {
    idClt: string;
    razonSocial: string;
    numDocumento: string;
}

interface FormaPago {
    idFp: string;
    descrip: string;
}

interface Monedas {
    idMda: string;
    nombre: string;
}

// Simple BaseCard component
const BaseCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            {title}
        </Typography>
        {children}
    </Paper>
);

// Componente Modal de Item reutilizado (igual que en OrderCreate)
const ItemModal: React.FC<{
    open: boolean;
    onClose: () => void;
    onSave: (item: DetalleItem) => void;
    item?: DetalleItem;
    isEditing?: boolean;
}> = ({ open, onClose, onSave, item, isEditing = false }) => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<DetalleItem>({
        defaultValues: item || {
            id: Date.now().toString(),
            statusOP: 'PENDIENTE',
            tipoNegocio: '',
            subTipoNegocio1: '',
            subTipoNegocio2: '',
            itemOP: '',
            codigoComercial: '',
            cantidad: 1,
            unidadMedida: 'UND',
            moneda: '',
            pvu: 0,
            tcUsd: 1,
            fechaRequeridaCliente: '',
            teSemanasEntrega: 1,
            numCotizacion: '',
            requiereArmado: false,
            codigoCliente: '',
            numeroDeal: '',
            numeroServicio: '',
            numeroProyecto: '',
            ccs: '',
            ccss: '',
            ccn: '',
            nota1: '',
            nota2: '',
            nota3: '',
            nota4: '',
        }
    });

    React.useEffect(() => {
        if (item) {
            reset(item);
        }
    }, [item, reset, open]);

    const handleSave = (data: DetalleItem) => {
        onSave({ ...data, id: item?.id || Date.now().toString() });
        onClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        {isEditing ? 'Editar Item' : 'Agregar Nuevo Item'}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form onSubmit={handleSubmit(handleSave)}>
                <DialogContent>
                    {/* Contenido del modal igual que en OrderCreate */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Información Principal
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="tipoNegocio"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.tipoNegocio}>
                                        <InputLabel>Tipo Negocio *</InputLabel>
                                        <Select {...field} label="Tipo Negocio *">
                                            <MenuItem value="COMPRAS">Compras</MenuItem>
                                            <MenuItem value="VENTAS">Ventas</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="subTipoNegocio1"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.subTipoNegocio1}>
                                        <InputLabel>Sub Tipo Negocio 1 *</InputLabel>
                                        <Select {...field} label="Sub Tipo Negocio 1 *">
                                            <MenuItem value="NACIONAL">Nacional</MenuItem>
                                            <MenuItem value="INTERNACIONAL">Internacional</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Controller
                                name="subTipoNegocio2"
                                control={control}
                                rules={{ required: 'Campo requerido' }}
                                render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.subTipoNegocio2}>
                                        <InputLabel>Sub Tipo Negocio 2 *</InputLabel>
                                        <Select {...field} label="Sub Tipo Negocio 2 *">
                                            <MenuItem value="PRODUCTO">Producto</MenuItem>
                                            <MenuItem value="SERVICIO">Servicio</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Código Comercial *"
                                {...register('codigoComercial', { required: 'Campo requerido' })}
                                size="small"
                                fullWidth
                                error={!!errors.codigoComercial}
                                helperText={errors.codigoComercial?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="N° Cotización"
                                {...register('numCotizacion')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Cantidad y Precios
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Cantidad *"
                                {...register('cantidad', {
                                    required: 'Campo requerido',
                                    min: { value: 1, message: 'Cantidad debe ser mayor a 0' }
                                })}
                                type="number"
                                size="small"
                                fullWidth
                                error={!!errors.cantidad}
                                helperText={errors.cantidad?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Unidad de Medida"
                                {...register('unidadMedida')}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="PVU *"
                                {...register('pvu', {
                                    required: 'Campo requerido',
                                    min: { value: 0, message: 'PVU debe ser mayor o igual a 0' }
                                })}
                                type="number"
                                size="small"
                                fullWidth
                                error={!!errors.pvu}
                                helperText={errors.pvu?.message}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="T/C USD"
                                {...register('tcUsd')}
                                type="number"
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                        {isEditing ? 'Actualizar Item' : 'Agregar Item'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const OrderEdit = () => {
    // Estados principales
    const [vendedores, setVendedores] = React.useState<Vendedor[]>([]);
    const [clientes, setClientes] = React.useState<Clientes[]>([]);
    const [formaPago, setFormaPago] = React.useState<FormaPago[]>([]);
    const [monedas, setMonedas] = React.useState<Monedas[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [itemModalOpen, setItemModalOpen] = React.useState(false);
    const [editingItem, setEditingItem] = React.useState<DetalleItem | undefined>(undefined);
    const [editingIndex, setEditingIndex] = React.useState<number | undefined>(undefined);
    const [showRestoreDialog, setShowRestoreDialog] = React.useState(false);
    const [originalData, setOriginalData] = React.useState<FormData | null>(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const { register, handleSubmit, control, reset, watch, setValue } = useForm<FormData>({
        defaultValues: {
            detalles: []
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "detalles"
    });

    // Cargar datos de la orden existente
    const cargarOrdenExistente = async () => {
        setLoading(true);
        try {
            // Simular carga de API - en real sería: await getOrdenPedido(id)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const ordenExistente: FormData = {
                fecRecep: '2025-01-15T10:30:00Z',
                fecInicio: '2025-01-16T08:00:00Z',
                fecProcVi: '2025-01-20T14:00:00Z',
                idClt: 'CLT-001',
                numOp: 'OP-789456',
                idMda: 1,
                totalSinIgv: 25430.50,
                numRefCliente: 'REF-2025-001',
                idFp: 1,
                ibCltFin: 'CLT-002',
                ibCltPrv: 'CLT-003',
                idVdr: 'VDR-001',
                ibVdr2: 'VDR-002',
                ibLider: 'VDR-003',
                ubrutaCoti: 'COT-2024-456',
                comisionCompartida: true,
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
                        numeroServicio: '',
                        numeroProyecto: 'PROJ-2025-001',
                        ccs: 'CC-VENTAS',
                        ccss: '',
                        ccn: '',
                        nota1: 'Producto requiere instalación especializada',
                        nota2: 'Cliente solicita entrega directa en obra',
                        nota3: '',
                        nota4: '',
                    }
                ]
            };

            // Guardar datos originales para restaurar
            setOriginalData(ordenExistente);

            // Pre-llenar el formulario
            reset(ordenExistente);

        } catch (error) {
            console.error("Error al cargar orden:", error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos maestros
    const cargarDatosMaestros = async () => {
        try {
            // Simular carga de datos maestros
            const mockVendedores = [
                { idVdr: 'VDR-001', nomVdr: 'Juan Pérez', ibLider: false },
                { idVdr: 'VDR-002', nomVdr: 'María García', ibLider: false },
                { idVdr: 'VDR-003', nomVdr: 'Carlos López', ibLider: true },
            ];

            const mockClientes = [
                { idClt: 'CLT-001', razonSocial: 'EMPRESA CONSTRUCTORA ABC S.A.C.', numDocumento: '20123456789' },
                { idClt: 'CLT-002', razonSocial: 'CONSTRUCTORA XYZ', numDocumento: '20987654321' },
            ];

            const mockFormaPago = [
                { idFp: '1', descrip: 'CREDITO 30 DIAS' },
                { idFp: '2', descrip: 'CONTADO' },
            ];

            const mockMonedas = [
                { idMda: '1', nombre: 'SOLES' },
                { idMda: '2', nombre: 'DOLARES AMERICANOS' },
            ];

            setVendedores(mockVendedores);
            setClientes(mockClientes);
            setFormaPago(mockFormaPago);
            setMonedas(mockMonedas);

        } catch (error) {
            console.error('Error al cargar datos maestros:', error);
        }
    };

    React.useEffect(() => {
        Promise.all([
            cargarDatosMaestros(),
            cargarOrdenExistente()
        ]);
    }, [id]);

    // Funciones para manejar items
    const abrirModalAgregar = () => {
        setEditingItem(undefined);
        setEditingIndex(undefined);
        setItemModalOpen(true);
    };

    const abrirModalEditar = (item: DetalleItem, index: number) => {
        setEditingItem(item);
        setEditingIndex(index);
        setItemModalOpen(true);
    };

    const cerrarModal = () => {
        setItemModalOpen(false);
        setEditingItem(undefined);
        setEditingIndex(undefined);
    };

    const guardarItem = (item: DetalleItem) => {
        if (editingIndex !== undefined) {
            update(editingIndex, item);
        } else {
            append(item);
        }
    };

    const eliminarDetalle = (index: number) => {
        remove(index);
    };

    const calcularTotal = () => {
        const detalles = watch('detalles');
        return detalles?.reduce((total, detalle) => {
            return total + (detalle.cantidad * detalle.pvu);
        }, 0) || 0;
    };

    // Actualizar pedido
    const actualizarPedido = async (data: FormData) => {
        setSaving(true);
        try {
            const order = {
                ...data,
                idFp: Number(data.idFp),
                idMda: Number(data.idMda),
                totalSinIgv: calcularTotal()
            };

            // Simular llamada a API de actualización
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Orden actualizada:', order);

            // Mostrar mensaje de éxito y redirigir
            navigate(`/pedidos/${id}`);

        } catch (error) {
            console.error('Error al actualizar:', error);
        } finally {
            setSaving(false);
        }
    };

    // Restaurar valores originales
    const restaurarValores = () => {
        if (originalData) {
            reset(originalData);
            setShowRestoreDialog(false);
        }
    };

    const clientesUnicos = React.useMemo(() => {
        const seen = new Set();
        return clientes
            .filter(c => !!c.razonSocial && c.razonSocial.trim() !== '')
            .filter(c => {
                if (seen.has(c.razonSocial)) return false;
                seen.add(c.razonSocial);
                return true;
            });
    }, [clientes]);

    const lideres = vendedores.filter(v => v.ibLider);

    if (loading) {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <Box sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={300} />
                </Box>
            </LocalizationProvider>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 3 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                        Está editando la orden <strong>OP-2025-001</strong>.
                        Los cambios se guardarán automáticamente en el historial de modificaciones.
                    </Typography>
                </Alert>
                <BaseCard title="EDITAR PEDIDO">
                    <form onSubmit={handleSubmit(actualizarPedido)}>
                        <Accordion defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Datos Principales de la Orden
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecRecep"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha Recepción"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecInicio"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha Inicio"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="fecProcVi"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Fecha de Procesamiento VI"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                    slotProps={{
                                                        textField: { size: 'small', fullWidth: true }
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="N° Operación"
                                            {...register('numOp')}
                                            size="small"
                                            fullWidth
                                            disabled={saving}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="N° Ref. Cliente"
                                            {...register('numRefCliente')}
                                            size="small"
                                            fullWidth
                                            disabled={saving}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <TextField
                                            label="Utilidad bruta Cotización"
                                            {...register('ubrutaCoti')}
                                            size="small"
                                            fullWidth
                                            disabled={saving}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Controller
                                            name="comisionCompartida"
                                            control={control}
                                            render={({ field }) => (
                                                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                        disabled={saving}
                                                    />
                                                    <Typography variant="body2">
                                                        Comisión Compartida
                                                    </Typography>
                                                </Box>
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion defaultExpanded sx={{ mt: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Detalle de Items
                                    </Typography>
                                    <Chip
                                        label={`${fields.length} item(s)`}
                                        color="primary"
                                        size="small"
                                        sx={{ mr: 2 }}
                                    />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={abrirModalAgregar}
                                        disabled={saving}
                                        size="medium"
                                    >
                                        Agregar Item
                                    </Button>
                                </Box>
                                {fields.length === 0 ? (
                                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            No hay items agregados
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Utiliza el botón "Agregar Item" para añadir productos o servicios a este pedido
                                        </Typography>
                                    </Paper>
                                ) : (
                                    <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ minWidth: 100 }}>Acciones</TableCell>
                                                    <TableCell sx={{ minWidth: 120 }}>Tipo Negocio</TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>Código Comercial</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Cantidad</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>PVU</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Subtotal</TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}>N° Cotización</TableCell>
                                                    <TableCell sx={{ minWidth: 120 }}>Fecha Requerida</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Semanas</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Armado</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {fields.map((field, index) => {
                                                    const subtotal = field.cantidad * field.pvu;
                                                    return (
                                                        <TableRow key={field.id} hover>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                                    <Tooltip title="Editar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            onClick={() => abrirModalEditar(field, index)}
                                                                            disabled={saving}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Eliminar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => eliminarDetalle(index)}
                                                                            disabled={saving}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={field.tipoNegocio || 'No definido'}
                                                                    size="small"
                                                                    color={field.tipoNegocio === 'VENTAS' ? 'success' : field.tipoNegocio === 'COMPRAS' ? 'info' : 'default'}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                                    {field.codigoComercial || '-'}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {field.subTipoNegocio1} - {field.subTipoNegocio2}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.cantidad} {field.unidadMedida}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.pvu.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                                    {subtotal.toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.numCotizacion || '-'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.fechaRequeridaCliente ?
                                                                        new Date(field.fechaRequeridaCliente).toLocaleDateString() :
                                                                        '-'
                                                                    }
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2">
                                                                    {field.teSemanasEntrega}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={field.requiereArmado ? 'Sí' : 'No'}
                                                                    size="small"
                                                                    color={field.requiereArmado ? 'warning' : 'default'}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </AccordionDetails>
                        </Accordion>
                        <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" color="primary">
                                        Total sin IGV: {calcularTotal().toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cantidad de items: {fields.length}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate(`/pedidos/${id}`)}
                                            disabled={saving}
                                        >
                                            Cancelar Edición
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={saving || fields.length === 0}
                                            size="large"
                                        >
                                            {saving ? 'Guardando Cambios...' : 'Guardar Cambios'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </form>
                </BaseCard>
                <ItemModal
                    open={itemModalOpen}
                    onClose={cerrarModal}
                    onSave={guardarItem}
                    item={editingItem}
                    isEditing={editingIndex !== undefined}
                />
                <Dialog open={showRestoreDialog} onClose={() => setShowRestoreDialog(false)}>
                    <DialogTitle>Restaurar Valores Originales</DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Está seguro que desea restaurar todos los campos a sus valores originales?
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Se perderán todos los cambios realizados en esta sesión.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRestoreDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={restaurarValores}
                            color="warning"
                            variant="contained"
                            startIcon={<RestoreIcon />}
                        >
                            Restaurar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
};

export default OrderEdit;