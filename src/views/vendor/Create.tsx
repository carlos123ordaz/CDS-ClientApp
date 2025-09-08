import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Paper,
    IconButton,
    Avatar,
    Chip,
    Alert,
    Breadcrumbs,
    Link,
    FormControlLabel,
    Switch,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Stepper,
    Step,
    StepLabel,
    Fab,
    Snackbar,
    Grid,
    LinearProgress,
    FormHelperText,
} from '@mui/material';
import {
    Person as PersonIcon,
    Save as SaveIcon,
    Clear as ClearIcon,
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Add as AddIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Work as WorkIcon,
    Business as BusinessIcon,
    AccountBalance as BankIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    Badge as BadgeIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    PhotoCamera as PhotoCameraIcon,
    Upload as UploadIcon,
    Preview as PreviewIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

// Interfaces
interface FormData {
    // Datos básicos
    tipoDocumento: string;
    numeroDocumento: string;
    vendedor: string;
    estado: string;

    // Información personal
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    genero: string;
    estadoCivil: string;

    // Información de contacto
    telefono: string;
    telefonoAdicional: string;
    email: string;
    emailAdicional: string;
    direccion: string;
    distrito: string;
    provincia: string;
    departamento: string;
    codigoPostal: string;

    // Información laboral
    fechaIngreso: string;
    cargo: string;
    departamentoTrabajo: string;
    supervisor: string;
    sucursal: string;
    tipoContrato: string;
    salarioBase: number;
    comision: number;
    metaVentas: number;
    esLider: boolean;
    equipoTrabajo: string[];

    // Información bancaria
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
    numeroInterbancario: string;

    // Configuración del sistema
    usuario: string;
    password: string;
    confirmarPassword: string;
    rol: string;
    permisos: string[];

    // Otros
    observaciones: string;
    documentosAdjuntos: File[];
    fotoPerfil: File | null;
}

// Opciones para campos select
const tiposDocumento = [
    { value: 'DNI', label: 'DNI - Documento Nacional de Identidad' },
    { value: 'CE', label: 'CE - Carné de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
];

const estados = [
    { value: 'ACTIVO', label: 'Activo', color: 'success' },
    { value: 'INACTIVO', label: 'Inactivo', color: 'error' },
    { value: 'SUSPENDIDO', label: 'Suspendido', color: 'warning' },
    { value: 'EN_EVALUACION', label: 'En Evaluación', color: 'info' },
];

const generos = [
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'FEMENINO', label: 'Femenino' },
    { value: 'OTRO', label: 'Otro' },
];

const estadosCiviles = [
    { value: 'SOLTERO', label: 'Soltero(a)' },
    { value: 'CASADO', label: 'Casado(a)' },
    { value: 'DIVORCIADO', label: 'Divorciado(a)' },
    { value: 'VIUDO', label: 'Viudo(a)' },
    { value: 'CONVIVIENTE', label: 'Conviviente' },
];

const cargos = [
    { value: 'VENDEDOR_JUNIOR', label: 'Vendedor Junior' },
    { value: 'VENDEDOR_SENIOR', label: 'Vendedor Senior' },
    { value: 'EJECUTIVO_VENTAS', label: 'Ejecutivo de Ventas' },
    { value: 'SUPERVISOR_VENTAS', label: 'Supervisor de Ventas' },
    { value: 'GERENTE_VENTAS', label: 'Gerente de Ventas' },
];

const departamentos = [
    { value: 'VENTAS', label: 'Ventas' },
    { value: 'VENTAS_CORPORATIVAS', label: 'Ventas Corporativas' },
    { value: 'VENTAS_RETAIL', label: 'Ventas Retail' },
    { value: 'DESARROLLO_NEGOCIOS', label: 'Desarrollo de Negocios' },
];

const tiposContrato = [
    { value: 'INDEFINIDO', label: 'Plazo Indefinido' },
    { value: 'TEMPORAL', label: 'Temporal' },
    { value: 'PRACTICAS', label: 'Prácticas' },
    { value: 'LOCACION', label: 'Locación de Servicios' },
];

const bancos = [
    { value: 'BCP', label: 'Banco de Crédito del Perú' },
    { value: 'BBVA', label: 'BBVA' },
    { value: 'SCOTIABANK', label: 'Scotiabank' },
    { value: 'INTERBANK', label: 'Interbank' },
    { value: 'BIF', label: 'Banco Interamericano de Finanzas' },
];

const tiposCuenta = [
    { value: 'AHORROS', label: 'Cuenta de Ahorros' },
    { value: 'CORRIENTE', label: 'Cuenta Corriente' },
    { value: 'CTS', label: 'Cuenta CTS' },
];

const roles = [
    { value: 'VENDEDOR', label: 'Vendedor', permisos: ['ventas.ver', 'clientes.ver'] },
    { value: 'SUPERVISOR', label: 'Supervisor', permisos: ['ventas.ver', 'ventas.editar', 'clientes.ver', 'clientes.editar', 'reportes.ver'] },
    { value: 'GERENTE', label: 'Gerente', permisos: ['ventas.ver', 'ventas.editar', 'clientes.ver', 'clientes.editar', 'reportes.ver', 'usuarios.ver'] },
    { value: 'ADMIN', label: 'Administrador', permisos: ['*'] },
];

const Create = () => {
    const navigate = useNavigate();

    // Estados principales
    const [loading, setLoading] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [previewMode, setPreviewMode] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info'
    });

    // Form control
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        trigger,
        reset
    } = useForm<FormData>({
        defaultValues: {
            estado: 'ACTIVO',
            tipoDocumento: 'DNI',
            genero: '',
            estadoCivil: '',
            cargo: '',
            departamentoTrabajo: 'VENTAS',
            tipoContrato: 'INDEFINIDO',
            banco: '',
            tipoCuenta: 'AHORROS',
            rol: 'VENDEDOR',
            esLider: false,
            salarioBase: 0,
            comision: 0,
            metaVentas: 0,
            equipoTrabajo: [],
            permisos: [],
            documentosAdjuntos: [],
            fotoPerfil: null,
        }
    });

    // Watch para campos dependientes
    const watchTipoDocumento = watch('tipoDocumento');
    const watchRol = watch('rol');
    const watchEsLider = watch('esLider');
    const watchPassword = watch('password');

    // Stepper steps
    const steps = [
        {
            label: 'Información Personal',
            description: 'Datos básicos del vendedor',
            icon: <PersonIcon />,
        },
        {
            label: 'Contacto y Ubicación',
            description: 'Información de contacto',
            icon: '',
        },
        {
            label: 'Información Laboral',
            description: 'Datos del trabajo',
            icon: <WorkIcon />,
        },
        {
            label: 'Información Bancaria',
            description: 'Datos bancarios',
            icon: <BankIcon />,
        },
        {
            label: 'Configuración Sistema',
            description: 'Usuario y permisos',
            icon: <SecurityIcon />,
        },
        {
            label: 'Revisión Final',
            description: 'Confirmar información',
            icon: <CheckCircleIcon />,
        },
    ];

    // Validaciones personalizadas
    const validateDocumento = (value: string) => {
        if (watchTipoDocumento === 'DNI') {
            return value.length === 8 && /^\d+$/.test(value) || 'DNI debe tener 8 dígitos';
        }
        if (watchTipoDocumento === 'CE') {
            return value.length >= 9 || 'Carné de extranjería debe tener al menos 9 caracteres';
        }
        return true;
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || 'Formato de email inválido';
    };

    const validatePhone = (value: string) => {
        const phoneRegex = /^(\+51|51)?[9]\d{8}$/;
        return phoneRegex.test(value.replace(/\s/g, '')) || 'Formato de teléfono inválido (ej: 999888777)';
    };

    // Generar nombre completo
    const generarNombreCompleto = () => {
        const nombres = watch('nombres');
        const apellidoPaterno = watch('apellidoPaterno');
        const apellidoMaterno = watch('apellidoMaterno');

        if (nombres || apellidoPaterno || apellidoMaterno) {
            const nombreCompleto = `${nombres || ''} ${apellidoPaterno || ''} ${apellidoMaterno || ''}`.trim();
            setValue('vendedor', nombreCompleto);
        }
    };

    // Generar usuario automático
    const generarUsuario = () => {
        const nombres = watch('nombres');
        const apellidoPaterno = watch('apellidoPaterno');

        if (nombres && apellidoPaterno) {
            const usuario = `${nombres.split(' ')[0]}.${apellidoPaterno}`.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z.]/g, '');
            setValue('usuario', usuario);
        }
    };

    // Validar paso actual
    const validateStep = async (step: number) => {
        const fieldsToValidate: Record<number, (keyof FormData)[]> = {
            0: ['tipoDocumento', 'numeroDocumento', 'nombres', 'apellidoPaterno', 'apellidoMaterno'],
            1: ['telefono', 'email', 'direccion'],
            2: ['fechaIngreso', 'cargo', 'departamentoTrabajo'],
            3: ['banco', 'tipoCuenta', 'numeroCuenta'],
            4: ['usuario', 'password', 'confirmarPassword', 'rol'],
        };

        if (fieldsToValidate[step]) {
            const result = await trigger(fieldsToValidate[step]);
            return result;
        }
        return true;
    };

    // Navegar entre pasos
    const handleNext = async () => {
        const isValid = await validateStep(activeStep);
        if (isValid) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    // Guardar vendedor
    const guardarVendedor = (data: FormData) => {
        setLoading(true);

        // Simular guardado
        setTimeout(() => {
            console.log('Vendedor guardado:', data);
            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Vendedor registrado correctamente',
                severity: 'success'
            });

            // Opcional: redireccionar después de guardar
            setTimeout(() => {
                navigate('/vendedores');
            }, 2000);
        }, 2000);
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        reset();
        setActiveStep(0);
    };

    // Efecto para generar nombre completo automáticamente
    React.useEffect(() => {
        generarNombreCompleto();
    }, [watch('nombres'), watch('apellidoPaterno'), watch('apellidoMaterno')]);

    // Efecto para generar usuario automáticamente
    React.useEffect(() => {
        generarUsuario();
    }, [watch('nombres'), watch('apellidoPaterno')]);

    // Efecto para establecer permisos por rol
    React.useEffect(() => {
        const rolSeleccionado = roles.find(r => r.value === watchRol);
        if (rolSeleccionado) {
            setValue('permisos', rolSeleccionado.permisos);
        }
    }, [watchRol]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
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
                        onClick={() => navigate('/vendedores')}
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <PeopleIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Vendedores
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        Nuevo Vendedor
                    </Typography>
                </Breadcrumbs>

                {/* Header */}
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <CardContent sx={{ color: 'white', pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    👤 Registro de Nuevo Vendedor
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    Paso {activeStep + 1} de {steps.length}: {steps[activeStep]?.label}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        border: '3px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Box>
                        </Box>

                        {/* Barra de progreso */}
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={(activeStep / (steps.length - 1)) * 100}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: 'white',
                                        borderRadius: 4,
                                    },
                                }}
                            />
                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                                {Math.round((activeStep / (steps.length - 1)) * 100)}% completado
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Stepper */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel
                                        icon={step.icon}
                                        onClick={() => {
                                            if (index <= activeStep) {
                                                setActiveStep(index);
                                            }
                                        }}
                                        sx={{
                                            cursor: index <= activeStep ? 'pointer' : 'default',
                                            '& .MuiStepLabel-label': {
                                                fontSize: '0.875rem',
                                                fontWeight: index === activeStep ? 'bold' : 'normal',
                                            }
                                        }}
                                    >
                                        {step.label}
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {step.description}
                                        </Typography>
                                    </StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit(guardarVendedor)}>
                    {/* Paso 1: Información Personal */}
                    {activeStep === 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Información Personal
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Documento de identidad */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                📄 Documento de Identidad
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid  size={{ xs: 12, md: 4 }}>
                                                    <FormControl fullWidth size="small" required>
                                                        <InputLabel>Tipo de Documento</InputLabel>
                                                        <Controller
                                                            name="tipoDocumento"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Tipo de Documento"
                                                                    error={!!errors.tipoDocumento}
                                                                >
                                                                    {tiposDocumento.map(tipo => (
                                                                        <MenuItem key={tipo.value} value={tipo.value}>
                                                                            {tipo.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.tipoDocumento && (
                                                            <FormHelperText error>
                                                                {errors.tipoDocumento.message}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Número de Documento"
                                                        {...register('numeroDocumento', {
                                                            required: 'Campo requerido',
                                                            validate: validateDocumento
                                                        })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.numeroDocumento}
                                                        helperText={errors.numeroDocumento?.message}
                                                        placeholder={watchTipoDocumento === 'DNI' ? '12345678' : 'Número de documento'}
                                                        inputProps={{
                                                            maxLength: watchTipoDocumento === 'DNI' ? 8 : 20
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <FormControl fullWidth size="small" required>
                                                        <InputLabel>Estado</InputLabel>
                                                        <Controller
                                                            name="estado"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Estado"
                                                                    error={!!errors.estado}
                                                                >
                                                                    {estados.map(estado => (
                                                                        <MenuItem key={estado.value} value={estado.value}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <Chip
                                                                                    label={estado.label}
                                                                                    color={estado.color as any}
                                                                                    size="small"
                                                                                />
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Nombres */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                👤 Nombres y Apellidos
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Nombres"
                                                        {...register('nombres', { required: 'Campo requerido' })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.nombres}
                                                        helperText={errors.nombres?.message}
                                                        placeholder="Juan Carlos"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Apellido Paterno"
                                                        {...register('apellidoPaterno', { required: 'Campo requerido' })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.apellidoPaterno}
                                                        helperText={errors.apellidoPaterno?.message}
                                                        placeholder="García"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Apellido Materno"
                                                        {...register('apellidoMaterno', { required: 'Campo requerido' })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.apellidoMaterno}
                                                        helperText={errors.apellidoMaterno?.message}
                                                        placeholder="López"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        label="Nombre Completo (Generado automáticamente)"
                                                        {...register('vendedor')}
                                                        size="small"
                                                        fullWidth
                                                        disabled
                                                        sx={{
                                                            '& .MuiInputBase-input.Mui-disabled': {
                                                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)',
                                                                fontWeight: 'bold',
                                                            }
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Información adicional */}
                                    <Grid size={{ xs: 12 }}>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    📋 Información Adicional
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <Controller
                                                            name="fechaNacimiento"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    label="Fecha de Nacimiento"
                                                                    value={field.value ? dayjs(field.value) : null}
                                                                    onChange={(value) => field.onChange(value?.toISOString())}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: 'small',
                                                                            fullWidth: true
                                                                        }
                                                                    }}
                                                                    maxDate={dayjs().subtract(18, 'year')}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Género</InputLabel>
                                                            <Controller
                                                                name="genero"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field} label="Género">
                                                                        {generos.map(genero => (
                                                                            <MenuItem key={genero.value} value={genero.value}>
                                                                                {genero.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid size={{ xs: 12, md: 4 }}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel>Estado Civil</InputLabel>
                                                            <Controller
                                                                name="estadoCivil"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select {...field} label="Estado Civil">
                                                                        {estadosCiviles.map(estado => (
                                                                            <MenuItem key={estado.value} value={estado.value}>
                                                                                {estado.label}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                )}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 2: Contacto y Ubicación */}
                    {activeStep === 1 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    {/* <ContactIcon sx={{ mr: 1 }} /> */}
                                    Información de Contacto y Ubicación
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Información de contacto */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                📞 Contacto
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Teléfono Principal"
                                                        {...register('telefono', {
                                                            required: 'Campo requerido',
                                                            validate: validatePhone
                                                        })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.telefono}
                                                        helperText={errors.telefono?.message}
                                                        placeholder="999888777"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Teléfono Adicional"
                                                        {...register('telefonoAdicional', { validate: validatePhone })}
                                                        size="small"
                                                        fullWidth
                                                        error={!!errors.telefonoAdicional}
                                                        helperText={errors.telefonoAdicional?.message}
                                                        placeholder="999888777"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PhoneIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Email Principal"
                                                        {...register('email', {
                                                            required: 'Campo requerido',
                                                            validate: validateEmail
                                                        })}
                                                        type="email"
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.email}
                                                        helperText={errors.email?.message}
                                                        placeholder="juan.garcia@empresa.com"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <EmailIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Email Adicional"
                                                        {...register('emailAdicional', { validate: validateEmail })}
                                                        type="email"
                                                        size="small"
                                                        fullWidth
                                                        error={!!errors.emailAdicional}
                                                        helperText={errors.emailAdicional?.message}
                                                        placeholder="juan.garcia.personal@gmail.com"
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <EmailIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Dirección */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                🏠 Dirección
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12 }}>
                                                    <TextField
                                                        label="Dirección Completa"
                                                        {...register('direccion', { required: 'Campo requerido' })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.direccion}
                                                        helperText={errors.direccion?.message}
                                                        placeholder="Av. Principal 123, Urbanización Los Olivos"
                                                        multiline
                                                        rows={2}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                                    <LocationIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Distrito"
                                                        {...register('distrito')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="San Isidro"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Provincia"
                                                        {...register('provincia')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Lima"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Departamento"
                                                        {...register('departamento')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Lima"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Código Postal"
                                                        {...register('codigoPostal')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="15047"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 3: Información Laboral */}
                    {activeStep === 2 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <WorkIcon sx={{ mr: 1 }} />
                                    Información Laboral
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Datos básicos laborales */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                💼 Datos Laborales
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Controller
                                                        name="fechaIngreso"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                label="Fecha de Ingreso"
                                                                value={field.value ? dayjs(field.value) : null}
                                                                onChange={(value) => field.onChange(value?.toISOString())}
                                                                slotProps={{
                                                                    textField: {
                                                                        size: 'small',
                                                                        fullWidth: true,
                                                                        required: true,
                                                                        error: !!errors.fechaIngreso,
                                                                        helperText: errors.fechaIngreso?.message
                                                                    }
                                                                }}
                                                                maxDate={dayjs()}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <FormControl fullWidth size="small" required>
                                                        <InputLabel>Cargo</InputLabel>
                                                        <Controller
                                                            name="cargo"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Cargo"
                                                                    error={!!errors.cargo}
                                                                >
                                                                    {cargos.map(cargo => (
                                                                        <MenuItem key={cargo.value} value={cargo.value}>
                                                                            {cargo.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.cargo && (
                                                            <FormHelperText error>
                                                                {errors.cargo.message}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <FormControl fullWidth size="small" required>
                                                        <InputLabel>Departamento</InputLabel>
                                                        <Controller
                                                            name="departamentoTrabajo"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Departamento"
                                                                    error={!!errors.departamentoTrabajo}
                                                                >
                                                                    {departamentos.map(depto => (
                                                                        <MenuItem key={depto.value} value={depto.value}>
                                                                            {depto.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Supervisor Directo"
                                                        {...register('supervisor')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Nombre del supervisor"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Sucursal"
                                                        {...register('sucursal')}
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Oficina principal"
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Tipo de Contrato</InputLabel>
                                                        <Controller
                                                            name="tipoContrato"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select {...field} label="Tipo de Contrato">
                                                                    {tiposContrato.map(tipo => (
                                                                        <MenuItem key={tipo.value} value={tipo.value}>
                                                                            {tipo.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                {...register('esLider')}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="¿Es Líder de Equipo?"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Información salarial */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                💰 Información Salarial y Metas
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Salario Base (S/)"
                                                        {...register('salarioBase', {
                                                            required: 'Campo requerido',
                                                            min: { value: 1, message: 'Debe ser mayor a 0' }
                                                        })}
                                                        type="number"
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.salarioBase}
                                                        helperText={errors.salarioBase?.message}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    S/
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Comisión (%)"
                                                        {...register('comision', {
                                                            min: { value: 0, message: 'No puede ser negativo' },
                                                            max: { value: 100, message: 'No puede ser mayor a 100%' }
                                                        })}
                                                        type="number"
                                                        size="small"
                                                        fullWidth
                                                        error={!!errors.comision}
                                                        helperText={errors.comision?.message}
                                                        inputProps={{ min: 0, max: 100, step: 0.1 }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    %
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <TextField
                                                        label="Meta de Ventas Mensual (S/)"
                                                        {...register('metaVentas', {
                                                            min: { value: 0, message: 'No puede ser negativo' }
                                                        })}
                                                        type="number"
                                                        size="small"
                                                        fullWidth
                                                        error={!!errors.metaVentas}
                                                        helperText={errors.metaVentas?.message}
                                                        inputProps={{ min: 0, step: 0.01 }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    S/
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Equipo de trabajo (si es líder) */}
                                    {watchEsLider && (
                                        <Grid size={{ xs: 12 }}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                        👥 Equipo de Trabajo
                                                    </Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Alert severity="info" sx={{ mb: 2 }}>
                                                        Como líder de equipo, puede asignar vendedores a su cargo después del registro inicial.
                                                    </Alert>
                                                    <TextField
                                                        label="Notas sobre el equipo"
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        placeholder="Describa las características del equipo que liderará..."
                                                        size="small"
                                                    />
                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 4: Información Bancaria */}
                    {activeStep === 3 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <BankIcon sx={{ mr: 1 }} />
                                    Información Bancaria
                                </Typography>

                                <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        🏦 Datos Bancarios para Pagos
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl fullWidth size="small" required>
                                                <InputLabel>Banco</InputLabel>
                                                <Controller
                                                    name="banco"
                                                    control={control}
                                                    rules={{ required: 'Campo requerido' }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Banco"
                                                            error={!!errors.banco}
                                                        >
                                                            {bancos.map(banco => (
                                                                <MenuItem key={banco.value} value={banco.value}>
                                                                    {banco.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                                {errors.banco && (
                                                    <FormHelperText error>
                                                        {errors.banco.message}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl fullWidth size="small" required>
                                                <InputLabel>Tipo de Cuenta</InputLabel>
                                                <Controller
                                                    name="tipoCuenta"
                                                    control={control}
                                                    rules={{ required: 'Campo requerido' }}
                                                    render={({ field }) => (
                                                        <Select
                                                            {...field}
                                                            label="Tipo de Cuenta"
                                                            error={!!errors.tipoCuenta}
                                                        >
                                                            {tiposCuenta.map(tipo => (
                                                                <MenuItem key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Número de Cuenta"
                                                {...register('numeroCuenta', {
                                                    required: 'Campo requerido',
                                                    pattern: {
                                                        value: /^\d{10,20}$/,
                                                        message: 'Número de cuenta inválido'
                                                    }
                                                })}
                                                size="small"
                                                fullWidth
                                                required
                                                error={!!errors.numeroCuenta}
                                                helperText={errors.numeroCuenta?.message}
                                                placeholder="1234567890"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Número Interbancario (CCI)"
                                                {...register('numeroInterbancario', {
                                                    pattern: {
                                                        value: /^\d{20}$/,
                                                        message: 'CCI debe tener 20 dígitos'
                                                    }
                                                })}
                                                size="small"
                                                fullWidth
                                                error={!!errors.numeroInterbancario}
                                                helperText={errors.numeroInterbancario?.message}
                                                placeholder="12345678901234567890"
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 5: Configuración del Sistema */}
                    {activeStep === 4 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <SecurityIcon sx={{ mr: 1 }} />
                                    Configuración del Sistema
                                </Typography>

                                <Grid container spacing={3}>
                                    {/* Credenciales de acceso */}
                                    <Grid size={{ xs: 12 }}>
                                        <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                                            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                                🔐 Credenciales de Acceso
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Usuario (Generado automáticamente)"
                                                        {...register('usuario', {
                                                            required: 'Campo requerido',
                                                            minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                                                        })}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.usuario}
                                                        helperText={errors.usuario?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <FormControl fullWidth size="small" required>
                                                        <InputLabel>Rol del Sistema</InputLabel>
                                                        <Controller
                                                            name="rol"
                                                            control={control}
                                                            rules={{ required: 'Campo requerido' }}
                                                            render={({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    label="Rol del Sistema"
                                                                    error={!!errors.rol}
                                                                >
                                                                    {roles.map(rol => (
                                                                        <MenuItem key={rol.value} value={rol.value}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                                <BadgeIcon fontSize="small" />
                                                                                {rol.label}
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Contraseña"
                                                        {...register('password', {
                                                            required: 'Campo requerido',
                                                            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                                                            pattern: {
                                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                                message: 'Debe contener mayúscula, minúscula y número'
                                                            }
                                                        })}
                                                        type={showPassword ? 'text' : 'password'}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.password}
                                                        helperText={errors.password?.message}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        edge="end"
                                                                        size="small"
                                                                    >
                                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, md: 6 }}>
                                                    <TextField
                                                        label="Confirmar Contraseña"
                                                        {...register('confirmarPassword', {
                                                            required: 'Campo requerido',
                                                            validate: (value) =>
                                                                value === watchPassword || 'Las contraseñas no coinciden'
                                                        })}
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        size="small"
                                                        fullWidth
                                                        required
                                                        error={!!errors.confirmarPassword}
                                                        helperText={errors.confirmarPassword?.message}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        edge="end"
                                                                        size="small"
                                                                    >
                                                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Permisos del sistema */}
                                    <Grid size={{ xs: 12 }}>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    🛡️ Permisos del Sistema
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Alert severity="info" sx={{ mb: 2 }}>
                                                    Los permisos se asignan automáticamente según el rol seleccionado.
                                                </Alert>
                                                <Box sx={{ mt: 2 }}>
                                                    {roles.find(r => r.value === watchRol)?.permisos.map((permiso, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={permiso}
                                                            color="primary"
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ m: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paso 6: Revisión Final */}
                    {activeStep === 5 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                    <CheckCircleIcon sx={{ mr: 1 }} />
                                    Revisión Final
                                </Typography>

                                <Alert severity="success" sx={{ mb: 3 }}>
                                    🎉 ¡Perfecto! Revisa toda la información antes de guardar el registro del vendedor.
                                </Alert>

                                <Grid container spacing={3}>
                                    {/* Resumen de información personal */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                    👤 Información Personal
                                                </Typography>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Nombre Completo"
                                                            secondary={watch('vendedor')}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Documento"
                                                            secondary={`${watch('tipoDocumento')}: ${watch('numeroDocumento')}`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Estado"
                                                            secondary={
                                                                <Chip
                                                                    label={estados.find(e => e.value === watch('estado'))?.label}
                                                                    color={estados.find(e => e.value === watch('estado'))?.color as any}
                                                                    size="small"
                                                                />
                                                            }
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Email"
                                                            secondary={watch('email')}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Teléfono"
                                                            secondary={watch('telefono')}
                                                        />
                                                    </ListItem>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Resumen de información laboral */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                                                    💼 Información Laboral
                                                </Typography>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Cargo"
                                                            secondary={cargos.find(c => c.value === watch('cargo'))?.label}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Departamento"
                                                            secondary={departamentos.find(d => d.value === watch('departamentoTrabajo'))?.label}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Salario Base"
                                                            secondary={`S/ ${watch('salarioBase')?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Comisión"
                                                            secondary={`${watch('comision')}%`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Meta de Ventas"
                                                            secondary={`S/ ${watch('metaVentas')?.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Es Líder"
                                                            secondary={
                                                                <Chip
                                                                    label={watch('esLider') ? 'Sí' : 'No'}
                                                                    color={watch('esLider') ? 'success' : 'default'}
                                                                    size="small"
                                                                />
                                                            }
                                                        />
                                                    </ListItem>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Resumen de información bancaria */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                                                    🏦 Información Bancaria
                                                </Typography>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Banco"
                                                            secondary={bancos.find(b => b.value === watch('banco'))?.label}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Tipo de Cuenta"
                                                            secondary={tiposCuenta.find(t => t.value === watch('tipoCuenta'))?.label}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Número de Cuenta"
                                                            secondary={watch('numeroCuenta')}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="CCI"
                                                            secondary={watch('numeroInterbancario') || 'No proporcionado'}
                                                        />
                                                    </ListItem>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Resumen de configuración del sistema */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                                                    🔐 Configuración del Sistema
                                                </Typography>
                                                <List dense>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Usuario"
                                                            secondary={watch('usuario')}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Rol"
                                                            secondary={roles.find(r => r.value === watch('rol'))?.label}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Contraseña"
                                                            secondary="••••••••"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemText
                                                            primary="Permisos"
                                                            secondary={
                                                                <Box sx={{ mt: 1 }}>
                                                                    {roles.find(r => r.value === watch('rol'))?.permisos.slice(0, 3).map((permiso, index) => (
                                                                        <Chip
                                                                            key={index}
                                                                            label={permiso}
                                                                            size="small"
                                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                                        />
                                                                    ))}
                                                                    {/* {roles.find(r => r.value === watch('rol'))?.permisos.length > 3 && (
                                                                        <Chip
                                                                            label={`+${roles.find(r => r.value === watch('rol'))?.permisos.length - 3} más`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                        />
                                                                    )} */}
                                                                </Box>
                                                            }
                                                        />
                                                    </ListItem>
                                                </List>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Observaciones finales */}
                                    <Grid size={{ xs: 12 }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                                                    📝 Observaciones Adicionales
                                                </Typography>
                                                <TextField
                                                    label="Observaciones del registro"
                                                    {...register('observaciones')}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    placeholder="Agregar cualquier observación adicional sobre el vendedor..."
                                                    variant="outlined"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                    {/* Navegación entre pasos */}
                    {activeStep < 5 && (
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                        disabled={activeStep === 0 || loading}
                                        startIcon={<ArrowBackIcon />}
                                    >
                                        Anterior
                                    </Button>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<PreviewIcon />}
                                            onClick={() => setPreviewMode(true)}
                                            disabled={loading}
                                        >
                                            Vista Previa
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            disabled={loading}
                                            endIcon={<NavigateNextIcon />}
                                        >
                                            Siguiente
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {/* Botones finales */}
                    {activeStep === 5 && (
                        <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="h6" color="primary">
                                        🎯 ¿Todo está correcto?
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Revisa la información antes de guardar el vendedor
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleBack}
                                            disabled={loading}
                                            startIcon={<ArrowBackIcon />}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={limpiarFormulario}
                                            disabled={loading}
                                        >
                                            Limpiar
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            disabled={loading}
                                            size="large"
                                            sx={{
                                                background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                                                boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                                                minWidth: 150,
                                            }}
                                        >
                                            {loading ? 'Guardando...' : 'Guardar Vendedor'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Barra de progreso durante guardado */}
                            {loading && (
                                <Box sx={{ mt: 2 }}>
                                    <LinearProgress />
                                    <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                        Procesando registro del vendedor...
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
                </form>

                {/* Diálogo de vista previa */}
                <Dialog
                    open={previewMode}
                    onClose={() => setPreviewMode(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        👁️ Vista Previa del Vendedor
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                                        <PersonIcon fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{watch('vendedor')}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {watch('tipoDocumento')}: {watch('numeroDocumento')}
                                        </Typography>
                                        <Chip
                                            label={estados.find(e => e.value === watch('estado'))?.label}
                                            color={estados.find(e => e.value === watch('estado'))?.color as any}
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Cargo:</strong> {cargos.find(c => c.value === watch('cargo'))?.label}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Departamento:</strong> {departamentos.find(d => d.value === watch('departamentoTrabajo'))?.label}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Email:</strong> {watch('email')}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Teléfono:</strong> {watch('telefono')}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Usuario:</strong> {watch('usuario')}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Typography variant="body2"><strong>Rol:</strong> {roles.find(r => r.value === watch('rol'))?.label}</Typography>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setPreviewMode(false)}>
                            Cerrar
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

export default Create;