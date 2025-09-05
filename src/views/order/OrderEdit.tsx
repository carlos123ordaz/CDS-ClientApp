import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Grid,
    Autocomplete,
    Paper,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Breadcrumbs,
    Link,
    Fab,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Tooltip,
    Badge,
    Snackbar,
    LinearProgress,
    Switch,
    RadioGroup,
    Radio,
    FormLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    List as ListIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
    CalendarToday as CalendarIcon,
    Assignment as AssignmentIcon,
    Sync as SyncIcon,
    History as HistoryIcon,
    Compare as CompareIcon,
    Restore as RestoreIcon,
    Preview as PreviewIcon,
    DragIndicator as DragIcon,
    ContentCopy as CopyIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';

// Interfaces
interface FormData {
    // Datos de la orden
    correlativoOPCI: string;
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
    status: string;
    prioridad: string;
    observaciones: string;
    
    // Detalles de la orden
    detalles: DetalleItem[];
}

interface DetalleItem {
    id: string;
    itemOP: string;
    codigoComercial: string;
    descripcion: string;
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
    statusOP: string;
    tipoNegocio: string;
    subTipoNegocio1: string;
    subTipoNegocio2: string;
    ccs: string;
    ccss: string;
    ccn: string;
    nota1: string;
    nota2: string;
    nota3: string;
    nota4: string;
    isNew: boolean;
    isModified: boolean;
    isDeleted: boolean;
}

interface HistorialCambio {
    fecha: string;
    campo: string;
    valorAnterior: string;
    valorNuevo: string;
    usuario: string;
}

// Datos maestros (simulados)
const vendedores = [
    { idVdr: '1', nomVdr: 'Juan Pérez', ibLider: false },
    { idVdr: '2', nomVdr: 'María García', ibLider: false },
    { idVdr: '3', nomVdr: 'Carlos López', ibLider: true },
    { idVdr: '4', nomVdr: 'Ana Torres', ibLider: false },
    { idVdr: '5', nomVdr: 'Roberto Silva', ibLider: true },
];

const clientes = [
    { idClt: '1', razonSocial: 'EMPRESA CONSTRUCTORA ABC S.A.C.' },
    { idClt: '2', razonSocial: 'TECNOLOGÍA AVANZADA LTDA.' },
    { idClt: '3', razonSocial: 'SERVICIOS INDUSTRIALES S.A.' },
    { idClt: '4', razonSocial: 'CONSTRUCTORA XYZ' },
    { idClt: '5', razonSocial: 'PROVEEDOR DELTA' },
];

const formasPago = [
    { idFp: '1', descrip: 'CONTADO' },
    { idFp: '2', descrip: 'CREDITO 15 DIAS' },
    { idFp: '3', descrip: 'CREDITO 30 DIAS' },
    { idFp: '4', descrip: 'CREDITO 45 DIAS' },
    { idFp: '5', descrip: 'CREDITO 60 DIAS' },
];

const monedas = [
    { idMda: '1', nombre: 'SOLES' },
    { idMda: '2', nombre: 'DOLARES AMERICANOS' },
    { idMda: '3', nombre: 'EURO' },
    { idMda: '4', nombre: 'YEN' },
];

// Opciones para campos select
const statusOptions = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];
const prioridadOptions = ['ALTA', 'MEDIA', 'BAJA'];
const tipoNegocioOptions = ['PRODUCTO', 'SERVICIO', 'MIXTO'];
const subTipoNegocioOptions = ['VENTA', 'ALQUILER', 'MANTENIMIENTO', 'CONSULTORIA'];
const unidadMedidaOptions = ['UND', 'KG', 'M', 'M2', 'M3', 'LT', 'SET', 'PAR'];

// Datos de ejemplo para edición
const ordenOriginal: FormData = {
    correlativoOPCI: 'OP-2025-001',
    fecRecep: '2025-01-15T10:30:00Z',
    fecInicio: '2025-01-16T08:00:00Z',
    fecProcVi: '2025-01-20T14:00:00Z',
    idClt: '1',
    numOp: 'OP-789456',
    idMda: 1,
    totalSinIgv: 25430.50,
    numRefCliente: 'REF-2025-001',
    idFp: 3,
    ibCltFin: '4',
    ibCltPrv: '5',
    idVdr: '1',
    ibVdr2: '2',
    ibLider: '3',
    ubrutaCoti: 'COT-2024-456',
    comisionCompartida: true,
    status: 'EN_PROCESO',
    prioridad: 'ALTA',
    observaciones: 'Orden prioritaria para cliente estratégico. Revisar disponibilidad de stock antes del 20 de enero.',
    detalles: [
        {
            id: '1',
            itemOP: 'ITEM-001',
            codigoComercial: 'CC-12345',
            descripcion: 'Válvula de control industrial DN100 PN16',
            cantidad: 5,
            unidadMedida: 'UND',
            moneda: 'SOLES',
            pvu: 2543.05,
            tcUsd: 1,
            fechaRequeridaCliente: '2025-02-15T00:00:00Z',
            teSemanasEntrega: 4,
            numCotizacion: 'COT-2024-456-001',
            requiereArmado: true,
            codigoCliente: 'CLI-VAL-001',
            numeroDeal: 'DEAL-2024-789',
            numeroServicio: 'SRV-001',
            numeroProyecto: 'PROJ-CONST-2025',
            statusOP: 'EN_PROCESO',
            tipoNegocio: 'PRODUCTO',
            subTipoNegocio1: 'VENTA',
            subTipoNegocio2: 'INDUSTRIAL',
            ccs: 'CCS-001',
            ccss: 'CCSS-001',
            ccn: 'CCN-001',
            nota1: 'Confirmar especificaciones técnicas',
            nota2: 'Pendiente aprobación del cliente',
            nota3: '',
            nota4: '',
            isNew: false,
            isModified: false,
            isDeleted: false,
        },
        {
            id: '2',
            itemOP: 'ITEM-002',
            codigoComercial: 'CC-67890',
            descripcion: 'Servicio de instalación y puesta en marcha',
            cantidad: 1,
            unidadMedida: 'SRV',
            moneda: 'SOLES',
            pvu: 8500.00,
            tcUsd: 1,
            fechaRequeridaCliente: '2025-02-20T00:00:00Z',
            teSemanasEntrega: 2,
            numCotizacion: 'COT-2024-456-002',
            requiereArmado: false,
            codigoCliente: 'CLI-SRV-001',
            numeroDeal: 'DEAL-2024-789',
            numeroServicio: 'SRV-002',
            numeroProyecto: 'PROJ-CONST-2025',
            statusOP: 'PENDIENTE',
            tipoNegocio: 'SERVICIO',
            subTipoNegocio1: 'INSTALACION',
            subTipoNegocio2: 'TECNICO',
            ccs: 'CCS-002',
            ccss: 'CCSS-002',
            ccn: 'CCN-002',
            nota1: 'Coordinar con equipo técnico',
            nota2: '',
            nota3: '',
            nota4: '',
            isNew: false,
            isModified: false,
            isDeleted: false,
        },
    ],
};

const OrderEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados principales
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [hasChanges, setHasChanges] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [showPreview, setShowPreview] = React.useState(false);
    const [showComparison, setShowComparison] = React.useState(false);
    const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);
    const [historialCambios, setHistorialCambios] = React.useState<HistorialCambio[]>([]);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

    // Form control
    const { register, handleSubmit, control, reset, watch, formState: { errors, isDirty } } = useForm<FormData>({
        defaultValues: ordenOriginal
    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "detalles"
    });

    // Watch para detectar cambios
    const watchedValues = watch();

    // Funciones utilitarias
    const formatearFecha = (fecha: string) => {
        return dayjs(fecha).format('DD/MM/YYYY HH:mm');
    };

    const formatearMoneda = (monto: number, moneda: string) => {
        const simbolo = moneda === 'SOLES' ? 'S/' : moneda === 'DOLARES AMERICANOS' ? '$' : '€';
        return `${simbolo} ${monto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    };

    const calcularTotal = () => {
        return watchedValues.detalles?.reduce((total, detalle) => {
            if (!detalle.isDeleted) {
                return total + (detalle.cantidad * detalle.pvu);
            }
            return total;
        }, 0) || 0;
    };

    // Stepper steps
    const steps = [
        {
            label: 'Datos Principales',
            description: 'Información básica de la orden',
            icon: <InfoIcon />,
        },
        {
            label: 'Detalle de Items',
            description: 'Productos y servicios',
            icon: <AssignmentIcon />,
        },
        {
            label: 'Revisión Final',
            description: 'Confirmar cambios',
            icon: <CheckCircleIcon />,
        },
    ];

    // Agregar nuevo item
    const agregarItem = () => {
        const nuevoItem: DetalleItem = {
            id: Date.now().toString(),
            itemOP: '',
            codigoComercial: '',
            descripcion: '',
            cantidad: 1,
            unidadMedida: 'UND',
            moneda: 'SOLES',
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
            statusOP: 'PENDIENTE',
            tipoNegocio: '',
            subTipoNegocio1: '',
            subTipoNegocio2: '',
            ccs: '',
            ccss: '',
            ccn: '',
            nota1: '',
            nota2: '',
            nota3: '',
            nota4: '',
            isNew: true,
            isModified: false,
            isDeleted: false,
        };
        append(nuevoItem);
        setHasChanges(true);
    };

    // Marcar item como eliminado
    const eliminarItem = (index: number) => {
        const item = fields[index];
        if (item.isNew) {
            remove(index);
        } else {
            update(index, { ...item, isDeleted: true });
        }
        setHasChanges(true);
    };

    // Duplicar item
    const duplicarItem = (index: number) => {
        const item = fields[index];
        const nuevoItem = {
            ...item,
            id: Date.now().toString(),
            itemOP: `${item.itemOP}-COPY`,
            isNew: true,
            isModified: false,
            isDeleted: false,
        };
        append(nuevoItem);
        setHasChanges(true);
    };

    // Restaurar item eliminado
    const restaurarItem = (index: number) => {
        const item = fields[index];
        update(index, { ...item, isDeleted: false });
        setHasChanges(true);
    };

    // Guardar cambios
    const guardarCambios = (data: FormData) => {
        setSaving(true);
        
        // Simular guardado
        setTimeout(() => {
            console.log('Datos guardados:', data);
            setSaving(false);
            setHasChanges(false);
            setSnackbar({
                open: true,
                message: 'Orden actualizada correctamente',
                severity: 'success'
            });
            
            // Registrar cambios en historial
            const cambio: HistorialCambio = {
                fecha: new Date().toISOString(),
                campo: 'Orden completa',
                valorAnterior: 'Estado anterior',
                valorNuevo: 'Estado actualizado',
                usuario: 'Usuario Actual',
            };
            setHistorialCambios(prev => [cambio, ...prev]);
        }, 2000);
    };

    // Confirmar salida con cambios no guardados
    const handleExit = () => {
        if (hasChanges || isDirty) {
            setShowUnsavedDialog(true);
        } else {
            navigate(-1);
        }
    };

    // Detectar cambios
    React.useEffect(() => {
        setHasChanges(isDirty);
    }, [isDirty]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNext />}
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
                        onClick={handleExit}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <ListIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Órdenes de Pedido
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <EditIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Editar {watchedValues.correlativoOPCI}
                    </Typography>
                </Breadcrumbs>

                {/* Header con información de estado */}
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b45 100%)' }}>
                    <CardContent sx={{ color: 'white', pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    ✏️ Editando Orden: {watchedValues.correlativoOPCI}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Chip
                                        label={hasChanges ? 'Cambios Pendientes' : 'Sin Cambios'}
                                        color={hasChanges ? 'warning' : 'success'}
                                        icon={hasChanges ? <WarningIcon /> : <CheckCircleIcon />}
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {fields.filter(f => !f.isDeleted).length} items activos
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {formatearMoneda(calcularTotal(), 'S/')}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Total calculado
                                </Typography>
                            </Box>
                        </Box>

                        {/* Barra de progreso si está guardando */}
                        {saving && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
                                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                    Guardando cambios...
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Stepper de navegación */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        icon={step.icon}
                                        onClick={() => setActiveStep(index)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <Typography variant="subtitle2">{step.label}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {step.description}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit(guardarCambios)}>
                    {/* Paso 1: Datos Principales */}
                    {activeStep === 0 && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <InfoIcon sx={{ mr: 1 }} />
                                    Datos Principales de la Orden
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Información básica */}
                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    📋 Información Básica
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={3}>
                                                        <TextField
                                                            label="Correlativo OPCI"
                                                            {...register('correlativoOPCI', { required: 'Campo requerido' })}
                                                            size="small"
                                                            fullWidth
                                                            error={!!errors.correlativoOPCI}
                                                            helperText={errors.correlativoOPCI?.message}
                                                            disabled={loading}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
                                                        <Controller
                                                            name="fecRecep"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    label="Fecha Recepción"
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                                    slotProps={{
                                                                        textField: { 
                                                                            size: 'small', 
                                                                            fullWidth: true,
                                                                            error: !!errors.fecRecep,
                                                                            helperText: errors.fecRecep?.message
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={3}>
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
                                                    <Grid item xs={12} md={3}>
                                                        <Controller
                                                            name="fecProcVi"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    label="Fecha Proc. VI"
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                                    slotProps={{
                                                                        textField: { size: 'small', fullWidth: true }
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            label="N° Operación"
                                                            {...register('numOp', { required: 'Campo requerido' })}
                                                            size="small"
                                                            fullWidth
                                                            error={!!errors.numOp}
                                                            helperText={errors.numOp?.message}
                                                            disabled={loading}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            label="N° Ref. Cliente"
                                                            {...register('numRefCliente')}
                                                            size="small"
                                                            fullWidth
                                                            disabled={loading}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <TextField
                                                            label="Ubruta Cotización"
                                                            {...register('ubrutaCoti')}
                                                            size="small"
                                                            fullWidth
                                                            disabled={loading}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Estados y prioridad */}
                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    ⚡ Estado y Prioridad
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <FormControl fullWidth size="small" required>
                                                            <InputLabel>Status</InputLabel>
                                                            <Controller
                                                                name="status"
                                                                control={control}
                                                                rules={{ required: 'Campo requerido' }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Status"
                                                                        error={!!errors.status}
                                                                    >
                                                                        {statusOptions.map(option => (
                                                                            <MenuItem key={option} value={option}>
                                                                                {option}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <FormControl fullWidth size="small" required>
                                                            <InputLabel>Prioridad</InputLabel>
                                                            <Controller
                                                                name="prioridad"
                                                                control={control}
                                                                rules={{ required: 'Campo requerido' }}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        label="Prioridad"
                                                                        error={!!errors.prioridad}
                                                                    >
                                                                        {prioridadOptions.map(option => (
                                                                            <MenuItem key={option} value={option}>
                                                                                {option}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch
                                                                    {...register('comisionCompartida')}
                                                                    disabled={loading}
                                                                />
                                                            }
                                                            label="Comisión Compartida"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label="Observaciones"
                                                            {...register('observaciones')}
                                                            multiline
                                                            rows={3}
                                                            fullWidth
                                                            disabled={loading}
                                                            placeholder="Agregar observaciones importantes sobre la orden..."
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Clientes */}
                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    🏢 Información de Clientes
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="idClt"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={clientes}
                                                                    getOptionLabel={(option) => option.razonSocial}
                                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Cliente Principal"
                                                                            size="small"
                                                                            fullWidth
                                                                            required
                                                                            error={!!errors.idClt}
                                                                            helperText={errors.idClt?.message}
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="ibCltFin"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={clientes}
                                                                    getOptionLabel={(option) => option.razonSocial}
                                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Cliente Final"
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="ibCltPrv"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={clientes}
                                                                    getOptionLabel={(option) => option.razonSocial}
                                                                    onChange={(_, value) => field.onChange(value?.idClt)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Cliente Proveedor"
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Vendedores */}
                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    👥 Equipo de Ventas
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="idVdr"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={vendedores}
                                                                    getOptionLabel={(option) => option.nomVdr}
                                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Vendedor Principal"
                                                                            size="small"
                                                                            fullWidth
                                                                            required
                                                                            error={!!errors.idVdr}
                                                                            helperText={errors.idVdr?.message}
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="ibVdr2"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={vendedores}
                                                                    getOptionLabel={(option) => option.nomVdr}
                                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Vendedor Secundario"
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Controller
                                                            name="ibLider"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={vendedores.filter(v => v.ibLider)}
                                                                    getOptionLabel={(option) => option.nomVdr}
                                                                    onChange={(_, value) => field.onChange(value?.idVdr)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Líder"
                                                                            size="small"
                                                                            fullWidth
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>

                                    {/* Información Financiera */}
                                    <Grid item xs={12}>
                                        <Accordion defaultExpanded>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    💰 Información Financiera
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name="idMda"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={monedas}
                                                                    getOptionLabel={(option) => {
                                                                        const simbolos: Record<string, string> = {
                                                                            'SOLES': 'S/ - Soles',
                                                                            'DOLARES AMERICANOS': '$ - Dólares',
                                                                            'EURO': '€ - Euros',
                                                                            'YEN': '¥ - Yenes'
                                                                        };
                                                                        return simbolos[option.nombre] || option.nombre;
                                                                    }}
                                                                    onChange={(_, value) => field.onChange(value?.idMda)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Moneda"
                                                                            size="small"
                                                                            fullWidth
                                                                            required
                                                                            error={!!errors.idMda}
                                                                            helperText={errors.idMda?.message}
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Controller
                                                            name="idFp"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Autocomplete
                                                                    {...field}
                                                                    options={formasPago}
                                                                    getOptionLabel={(option) => option.descrip}
                                                                    onChange={(_, value) => field.onChange(value?.idFp)}
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            label="Forma de Pago"
                                                                            size="small"
                                                                            fullWidth
                                                                            required
                                                                            error={!!errors.idFp}
                                                                            helperText={errors.idFp?.message}
                                                                        />
                                                                    )}
                                                                    disabled={loading}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                                            <Typography variant="h6" sx={{ color: 'success.main', mb: 1 }}>
                                                                💰 Total Calculado: {formatearMoneda(calcularTotal(), 'S/')}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Este total se calcula automáticamente basado en los items del detalle
                                                            </Typography>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => setActiveStep(1)}
                                        endIcon={<NavigateNextIcon />}
                                    >
                                        Siguiente: Detalle de Items
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 2: Detalle de Items */}
                    {activeStep === 1 && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AssignmentIcon sx={{ mr: 1 }} />
                                        Detalle de Items ({fields.filter(f => !f.isDeleted).length} activos)
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={agregarItem}
                                        disabled={loading}
                                    >
                                        Agregar Item
                                    </Button>
                                </Box>

                                <Alert severity="info" sx={{ mb: 3 }}>
                                    💡 Puedes editar, agregar, eliminar o duplicar items. Los cambios se marcarán visualmente.
                                </Alert>

                                <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Acciones</TableCell>
                                                <TableCell>Estado</TableCell>
                                                <TableCell>Item OP</TableCell>
                                                <TableCell>Descripción</TableCell>
                                                <TableCell>Código</TableCell>
                                                <TableCell>Cant.</TableCell>
                                                <TableCell>U.M.</TableCell>
                                                <TableCell>PVU</TableCell>
                                                <TableCell>Total</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Tipo</TableCell>
                                                <TableCell>F. Requerida</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field, index) => (
                                                <TableRow 
                                                    key={field.id}
                                                    sx={{ 
                                                        backgroundColor: field.isNew ? 'success.50' : 
                                                                        field.isModified ? 'warning.50' : 
                                                                        field.isDeleted ? 'error.50' : 'inherit',
                                                        opacity: field.isDeleted ? 0.5 : 1
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                            {!field.isDeleted ? (
                                                                <>
                                                                    <Tooltip title="Eliminar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => eliminarItem(index)}
                                                                            disabled={loading}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Duplicar">
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            onClick={() => duplicarItem(index)}
                                                                            disabled={loading}
                                                                        >
                                                                            <CopyIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            ) : (
                                                                <Tooltip title="Restaurar">
                                                                    <IconButton
                                                                        size="small"
                                                                        color="success"
                                                                        onClick={() => restaurarItem(index)}
                                                                        disabled={loading}
                                                                    >
                                                                        <RestoreIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Box>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setActiveStep(0)}
                                        startIcon={<ArrowBackIcon />}
                                    >
                                        Anterior: Datos Principales
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => setActiveStep(2)}
                                        endIcon={<NavigateNextIcon />}
                                    >
                                        Siguiente: Revisión Final
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 3: Revisión Final */}
                    {activeStep === 2 && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ mr: 1 }} />
                                    Revisión Final y Confirmación
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Resumen de cambios */}
                                    <Grid item xs={12} lg={8}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    📋 Resumen de la Orden
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Correlativo OPCI
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                            {watchedValues.correlativoOPCI}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Status
                                                        </Typography>
                                                        <Box sx={{ mt: 0.5 }}>
                                                            <Chip
                                                                label={watchedValues.status}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Cliente Principal
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {clientes.find(c => c.idClt === watchedValues.idClt)?.razonSocial || 'No seleccionado'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Vendedor Principal
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {vendedores.find(v => v.idVdr === watchedValues.idVdr)?.nomVdr || 'No seleccionado'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Observaciones
                                                        </Typography>
                                                        <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                                                            <Typography variant="body2">
                                                                {watchedValues.observaciones || 'Sin observaciones'}
                                                            </Typography>
                                                        </Paper>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Totales y estadísticas */}
                                    <Grid item xs={12} lg={4}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                                                    💰 Totales
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Total sin IGV
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                                        {formatearMoneda(calcularTotal(), 'S/')}
                                                    </Typography>
                                                </Box>
                                                <Divider sx={{ my: 2 }} />
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        Items activos: {fields.filter(f => !f.isDeleted).length}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        Items nuevos: {fields.filter(f => f.isNew && !f.isDeleted).length}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        Items eliminados: {fields.filter(f => f.isDeleted).length}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Lista de items con estado */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    📦 Items de la Orden
                                                </Typography>
                                                <List>
                                                    {fields.map((field, index) => (
                                                        <ListItem key={field.id}>
                                                            <ListItemIcon>
                                                                <AssignmentIcon 
                                                                    color={field.isDeleted ? 'error' : 
                                                                           field.isNew ? 'success' : 
                                                                           field.isModified ? 'warning' : 'primary'}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Typography variant="body1" sx={{ 
                                                                            textDecoration: field.isDeleted ? 'line-through' : 'none',
                                                                            opacity: field.isDeleted ? 0.6 : 1
                                                                        }}>
                                                                            {watchedValues.detalles?.[index]?.itemOP || 'Sin código'} - 
                                                                            {watchedValues.detalles?.[index]?.descripcion || 'Sin descripción'}
                                                                        </Typography>
                                                                        {field.isNew && <Chip label="NUEVO" color="success" size="small" />}
                                                                        {field.isModified && <Chip label="MODIFICADO" color="warning" size="small" />}
                                                                        {field.isDeleted && <Chip label="ELIMINADO" color="error" size="small" />}
                                                                    </Box>
                                                                }
                                                                secondary={
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {watchedValues.detalles?.[index]?.cantidad || 0} {watchedValues.detalles?.[index]?.unidadMedida || 'UND'} × 
                                                                        {formatearMoneda(watchedValues.detalles?.[index]?.pvu || 0, 'S/')} = 
                                                                        {formatearMoneda((watchedValues.detalles?.[index]?.cantidad || 0) * (watchedValues.detalles?.[index]?.pvu || 0), 'S/')}
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Historial de cambios */}
                                    {historialCambios.length > 0 && (
                                        <Grid item xs={12}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                        🕒 Historial de Cambios Recientes
                                                    </Typography>
                                                    <List>
                                                        {historialCambios.slice(0, 3).map((cambio, index) => (
                                                            <ListItem key={index}>
                                                                <ListItemIcon>
                                                                    <HistoryIcon color="primary" />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={`${cambio.campo}: ${cambio.valorAnterior} → ${cambio.valorNuevo}`}
                                                                    secondary={`${cambio.usuario} - ${formatearFecha(cambio.fecha)}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setActiveStep(1)}
                                        startIcon={<ArrowBackIcon />}
                                    >
                                        Anterior: Detalle de Items
                                    </Button>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PreviewIcon />}
                                            onClick={() => setShowPreview(true)}
                                        >
                                            Vista Previa
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<CompareIcon />}
                                            onClick={() => setShowComparison(true)}
                                        >
                                            Comparar Cambios
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Botones de acción principales */}
                    <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" color="primary">
                                    💾 Estado: {hasChanges ? 'Cambios Pendientes' : 'Sin Cambios'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {hasChanges ? 'Hay cambios sin guardar en la orden' : 'Todos los cambios están guardados'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleExit}
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<SyncIcon />}
                                        onClick={() => reset(ordenOriginal)}
                                        disabled={saving || !hasChanges}
                                    >
                                        Restaurar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={saving || !hasChanges}
                                        size="large"
                                        sx={{
                                            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                                        }}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>

                {/* Diálogo de vista previa */}
                <Dialog
                    open={showPreview}
                    onClose={() => setShowPreview(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        👁️ Vista Previa de la Orden
                    </DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {watchedValues.correlativoOPCI}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Cliente:</strong> {clientes.find(c => c.idClt === watchedValues.idClt)?.razonSocial}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    <strong>Total:</strong> {formatearMoneda(calcularTotal(), 'S/')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <strong>Observaciones:</strong> {watchedValues.observaciones || 'Sin observaciones'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            Items ({fields.filter(f => !f.isDeleted).length}):
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Descripción</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                        <TableCell>PVU</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.filter(f => !f.isDeleted).map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>{watchedValues.detalles?.[index]?.itemOP}</TableCell>
                                            <TableCell>{watchedValues.detalles?.[index]?.descripcion}</TableCell>
                                            <TableCell>{watchedValues.detalles?.[index]?.cantidad} {watchedValues.detalles?.[index]?.unidadMedida}</TableCell>
                                            <TableCell>{formatearMoneda(watchedValues.detalles?.[index]?.pvu || 0, 'S/')}</TableCell>
                                            <TableCell>{formatearMoneda((watchedValues.detalles?.[index]?.cantidad || 0) * (watchedValues.detalles?.[index]?.pvu || 0), 'S/')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowPreview(false)}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de comparación */}
                <Dialog
                    open={showComparison}
                    onClose={() => setShowComparison(false)}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>
                        🔍 Comparación de Cambios
                    </DialogTitle>
                    <DialogContent dividers>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Comparación entre los valores originales y los valores actuales
                        </Alert>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                                    📋 Valores Originales
                                </Typography>
                                <Paper sx={{ p: 2, bgcolor: 'error.50' }}>
                                    <Typography variant="body2">
                                        <strong>Correlativo:</strong> {ordenOriginal.correlativoOPCI}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong> {ordenOriginal.status}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Items:</strong> {ordenOriginal.detalles.length}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Total:</strong> {formatearMoneda(ordenOriginal.totalSinIgv, 'S/')}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                                    📋 Valores Actuales
                                </Typography>
                                <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                                    <Typography variant="body2">
                                        <strong>Correlativo:</strong> {watchedValues.correlativoOPCI}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Status:</strong> {watchedValues.status}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Items:</strong> {fields.filter(f => !f.isDeleted).length}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Total:</strong> {formatearMoneda(calcularTotal(), 'S/')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowComparison(false)}>
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Diálogo de confirmación para salir */}
                <Dialog
                    open={showUnsavedDialog}
                    onClose={() => setShowUnsavedDialog(false)}
                >
                    <DialogTitle>
                        ⚠️ Cambios Sin Guardar
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Tienes cambios sin guardar. ¿Qué deseas hacer?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowUnsavedDialog(false)}>
                            Continuar Editando
                        </Button>
                        <Button 
                            onClick={() => {
                                reset(ordenOriginal);
                                setShowUnsavedDialog(false);
                                navigate(-1);
                            }}
                            color="warning"
                        >
                            Descartar Cambios
                        </Button>
                        <Button 
                            onClick={handleSubmit(guardarCambios)}
                            color="primary"
                            variant="contained"
                        >
                            Guardar y Salir
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
                    onClick={handleExit}
                >
                    <ArrowBackIcon />
                </Fab>

                {/* Snackbar para notificaciones */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    <Alert 
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
};

export default OrderEdit;
                          