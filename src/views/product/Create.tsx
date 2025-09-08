
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
    Grid,
    Paper,
    IconButton,
    Avatar,
    Chip,
    Alert,
    Breadcrumbs,
    Link,
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
    LinearProgress,
    FormHelperText,
} from '@mui/material';
import {
    Inventory as InventoryIcon,
    Save as SaveIcon,
    Clear as ClearIcon,
    ArrowBack as ArrowBackIcon,
    ExpandMore as ExpandMoreIcon,
    NavigateNext as NavigateNextIcon,
    Home as HomeIcon,
    Category as CategoryIcon,
    Add as AddIcon,
    Language as LanguageIcon,
    AccountBalance as TaxIcon,
    CheckCircle as CheckCircleIcon,
    QrCode as QrCodeIcon,
    Description as DescriptionIcon,
    Preview as PreviewIcon,
    LocalOffer as TagIcon,
} from '@mui/icons-material';
import { Controller, useForm } from "react-hook-form";

// Interfaces
interface ProductFormData {
    codERP: string;
    marca: string;
    codComercial: string;
    descripcion: string;
    unidadMedida: string;
    clase: string;
    subClase: string;
    subSubClase: string;
    modeloTraduccion: string;
    descripcionTraduccion: string;
    materialTraduccion: string;
    usoTraduccion: string;
    bbssSunat: string;
    estado: string;
    observaciones: string;
}

// Catálogos basados en la imagen del Excel
const marcas = [
    { value: 'ANTICIPEL', label: 'Anticipel' },
    { value: 'CREDITO', label: 'Crédito' },
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'LETRA', label: 'Letra' },
    { value: 'OTROS', label: 'Otros' },
];

const unidadesMedida = [
    { value: 'UND', label: 'Unidad' },
    { value: 'KG', label: 'Kilogramo' },
    { value: 'MT', label: 'Metro' },
    { value: 'LT', label: 'Litro' },
    { value: 'M2', label: 'Metro Cuadrado' },
    { value: 'M3', label: 'Metro Cúbico' },
    { value: 'DOC', label: 'Docena' },
    { value: 'PAR', label: 'Par' },
    { value: 'JGO', label: 'Juego' },
];

const clases = [
    { value: 'VENTA', label: 'Venta' },
    { value: 'SERVICIO', label: 'Servicio' },
    { value: 'PROYECTO', label: 'Proyecto' },
    { value: 'IMPORTACION', label: 'Importación' },
    { value: 'EXPORTACION', label: 'Exportación' },
];

const subClases = [
    { value: 'ELECTRONICO', label: 'Electrónico' },
    { value: 'MECANICO', label: 'Mecánico' },
    { value: 'QUIMICO', label: 'Químico' },
    { value: 'TEXTIL', label: 'Textil' },
    { value: 'ALIMENTARIO', label: 'Alimentario' },
    { value: 'CONSTRUCCION', label: 'Construcción' },
    { value: 'AUTOMOTRIZ', label: 'Automotriz' },
    { value: 'FARMACEUTICO', label: 'Farmacéutico' },
];

const subSubClases = [
    { value: 'STOCK', label: 'Stock' },
    { value: 'DEMO', label: 'Demo' },
    { value: 'BACKORDER', label: 'Backorder' },
    { value: 'REFURBISHED', label: 'Refurbished' },
    { value: 'NUEVO', label: 'Nuevo' },
    { value: 'USADO', label: 'Usado' },
    { value: 'DROPSHIPPING', label: 'Dropshipping' },
    { value: 'VENTA_BAJO_PEDIDO', label: 'Venta Bajo Pedido' },
    { value: 'EXPORTACION', label: 'Exportación' },
    { value: 'GARANTIA', label: 'Garantía' },
    { value: 'CONSUMO_INTERNO', label: 'Consumo Interno' },
];

const bbssSunat = [
    { value: 'USD', label: 'USD - Dólar Americano' },
    { value: 'PEN', label: 'PEN - Sol Peruano' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - Libra Esterlina' },
];

const estados = [
    { value: 'ACTIVO', label: 'Activo', color: 'success' },
    { value: 'INACTIVO', label: 'Inactivo', color: 'error' },
    { value: 'DESCONTINUADO', label: 'Descontinuado', color: 'warning' },
    { value: 'EN_DESARROLLO', label: 'En Desarrollo', color: 'info' },
];

const serviciosComplementarios = [
    'Calibración de Flujo',
    'Calibración de Gases',
    'Calibración de Presión',
    'Calibración de Temperatura',
    'Alquiler',
    'Transporte Puerta Gamma',
    'Levantamiento de base instalada',
    'Mantenimiento de detectores',
    'Asistencia al campo',
];

const condicionesPago = [
    '100% adelanto',
    '50% adelanto',
    '50% adelanto, saldo contado',
    'Contado',
    'Factura 8 días',
    'Factura 30 días',
    'Factura 45 días',
    'Factura 60 días',
    'Factura 7 días',
    '70% adelanto, saldo contado',
    '30% adelanto, saldo contado',
    '40% adelanto, saldo 30 días',
    'Factura 10 días',
];

const ProductCreate = () => {
    // Estados principales
    const [loading, setLoading] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
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
    } = useForm<ProductFormData>({
        defaultValues: {
            estado: 'ACTIVO',
            unidadMedida: 'UND',
            clase: '',
            subClase: '',
            subSubClase: '',
            marca: '',
            bbssSunat: 'PEN',
            codERP: '',
            codComercial: '',
            descripcion: '',
            modeloTraduccion: '',
            descripcionTraduccion: '',
            materialTraduccion: '',
            usoTraduccion: '',
            observaciones: ''
        }
    });

    // Watch para campos dependientes
    const watchClase = watch('clase');
    const watchSubClase = watch('subClase');
    const watchMarca = watch('marca');

    // Stepper steps
    const steps = [
        {
            label: 'Información Básica',
            description: 'Códigos y descripción',
            icon: <InventoryIcon />,
        },
        {
            label: 'Clasificación',
            description: 'Categorización del producto',
            icon: <CategoryIcon />,
        },
        {
            label: 'Traducciones',
            description: 'Información en otros idiomas',
            icon: <LanguageIcon />,
        },
        {
            label: 'Información Fiscal',
            description: 'Datos para SUNAT',
            icon: <TaxIcon />,
        },
        {
            label: 'Revisión Final',
            description: 'Confirmar información',
            icon: <CheckCircleIcon />,
        },
    ];

    // Generar código ERP automáticamente
    const generarCodigoERP = () => {
        const marca = watch('marca');
        const clase = watch('clase');
        
        if (marca && clase) {
            const timestamp = Date.now().toString().slice(-6);
            const codigo = `${marca.substring(0, 3)}-${clase.substring(0, 3)}-${timestamp}`.toUpperCase();
            setValue('codERP', codigo);
        }
    };

    // Validaciones personalizadas
    const validateCodERP = (value: string) => {
        if (!value) return 'Campo requerido';
        if (value.length < 5) return 'Mínimo 5 caracteres';
        return true;
    };

    // Validar paso actual
    const validateStep = async (step: number) => {
        const fieldsToValidate: Record<number, (keyof ProductFormData)[]> = {
            0: ['codERP', 'marca', 'codComercial', 'descripcion', 'unidadMedida'],
            1: ['clase', 'subClase'],
            2: [], // Traducciones son opcionales
            3: ['bbssSunat'],
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

    // Guardar producto
    const guardarProducto = (data: ProductFormData) => {
        setLoading(true);
        
        // Simular guardado
        setTimeout(() => {
            console.log('Producto guardado:', data);
            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Producto registrado correctamente',
                severity: 'success'
            });
        }, 2000);
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        reset();
        setActiveStep(0);
    };

    // Efecto para generar código ERP automáticamente
    React.useEffect(() => {
        generarCodigoERP();
    }, [watchMarca, watchClase]);

    return (
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
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Inicio
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="#"
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Productos
                </Link>
                <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    Nuevo Producto
                </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' }}>
                <CardContent sx={{ color: 'white', pb: '16px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                📦 Registro de Nuevo Producto
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
                                <InventoryIcon sx={{ fontSize: 40 }} />
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

            <form onSubmit={handleSubmit(guardarProducto)}>
                {/* Paso 1: Información Básica */}
                {activeStep === 0 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <InventoryIcon sx={{ mr: 1 }} />
                                Información Básica del Producto
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Códigos de identificación */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            🏷️ Códigos de Identificación
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    label="Código ERP (Generado automáticamente)"
                                                    {...register('codERP', { 
                                                        required: 'Campo requerido',
                                                        validate: validateCodERP
                                                    })}
                                                    size="small"
                                                    fullWidth
                                                    required
                                                    error={!!errors.codERP}
                                                    helperText={errors.codERP?.message}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <QrCodeIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    sx={{ 
                                                        '& .MuiInputBase-input': {
                                                            fontWeight: 'bold',
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>Marca</InputLabel>
                                                    <Controller
                                                        name="marca"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="Marca"
                                                                error={!!errors.marca}
                                                            >
                                                                {marcas.map(marca => (
                                                                    <MenuItem key={marca.value} value={marca.value}>
                                                                        {marca.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.marca && (
                                                        <FormHelperText error>
                                                            {errors.marca.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <TextField
                                                    label="Código Comercial"
                                                    {...register('codComercial', { required: 'Campo requerido' })}
                                                    size="small"
                                                    fullWidth
                                                    required
                                                    error={!!errors.codComercial}
                                                    helperText={errors.codComercial?.message}
                                                    placeholder="COD-001"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <TagIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Descripción y unidad */}
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            📝 Descripción y Medidas
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }} md={8}>
                                                <TextField
                                                    label="Descripción del Producto"
                                                    {...register('descripcion', { required: 'Campo requerido' })}
                                                    size="small"
                                                    fullWidth
                                                    required
                                                    error={!!errors.descripcion}
                                                    helperText={errors.descripcion?.message}
                                                    placeholder="Descripción detallada del producto..."
                                                    multiline
                                                    rows={3}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                                                <DescriptionIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>Unidad de Medida</InputLabel>
                                                    <Controller
                                                        name="unidadMedida"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="Unidad de Medida"
                                                                error={!!errors.unidadMedida}
                                                            >
                                                                {unidadesMedida.map(unidad => (
                                                                    <MenuItem key={unidad.value} value={unidad.value}>
                                                                        {unidad.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                </FormControl>
                                                
                                                <Box sx={{ mt: 2 }}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>Estado</InputLabel>
                                                        <Controller
                                                            name="estado"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select {...field} label="Estado">
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
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Paso 2: Clasificación */}
                {activeStep === 1 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <CategoryIcon sx={{ mr: 1 }} />
                                Clasificación del Producto
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            🗂️ Categorización
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>Clase</InputLabel>
                                                    <Controller
                                                        name="clase"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="Clase"
                                                                error={!!errors.clase}
                                                            >
                                                                {clases.map(clase => (
                                                                    <MenuItem key={clase.value} value={clase.value}>
                                                                        {clase.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.clase && (
                                                        <FormHelperText error>
                                                            {errors.clase.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>Sub-Clase</InputLabel>
                                                    <Controller
                                                        name="subClase"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="Sub-Clase"
                                                                error={!!errors.subClase}
                                                            >
                                                                {subClases.map(subClase => (
                                                                    <MenuItem key={subClase.value} value={subClase.value}>
                                                                        {subClase.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.subClase && (
                                                        <FormHelperText error>
                                                            {errors.subClase.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 4 }}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>Sub-Sub-Clase</InputLabel>
                                                    <Controller
                                                        name="subSubClase"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} label="Sub-Sub-Clase">
                                                                {subSubClases.map(subSubClase => (
                                                                    <MenuItem key={subSubClase.value} value={subSubClase.value}>
                                                                        {subSubClase.label}
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

                                {/* Servicios complementarios */}
                                <Grid size={{ xs: 12 }}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                ⚙️ Servicios Complementarios Disponibles
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Alert severity="info" sx={{ mb: 2 }}>
                                                Selecciona los servicios que pueden ofrecerse con este producto
                                            </Alert>
                                            <Grid container spacing={1}>
                                                {serviciosComplementarios.map((servicio, index) => (
                                                    <Grid size={{ xs: 12 }} sm={6} md={4} key={index}>
                                                        <Chip
                                                            label={servicio}
                                                            variant="outlined"
                                                            size="small"
                                                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Paso 3: Traducciones */}
                {activeStep === 2 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <LanguageIcon sx={{ mr: 1 }} />
                                Información en Otros Idiomas
                            </Typography>

                            <Alert severity="info" sx={{ mb: 3 }}>
                                Esta información es opcional y se utiliza para exportaciones o clientes internacionales
                            </Alert>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            🌍 Traducciones
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextField
                                                    label="Material (Traducción)"
                                                    {...register('materialTraduccion')}
                                                    size="small"
                                                    fullWidth
                                                    placeholder="Material in English"
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    label="Descripción (Traducción)"
                                                    {...register('descripcionTraduccion')}
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                    rows={3}
                                                    placeholder="Product description in English..."
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    label="Uso (Traducción)"
                                                    {...register('usoTraduccion')}
                                                    size="small"
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    placeholder="Product usage in English..."
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Paso 4: Información Fiscal */}
                {activeStep === 3 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <TaxIcon sx={{ mr: 1 }} />
                                Información Fiscal y SUNAT
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    <Paper sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                            📋 Clasificación SUNAT
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormControl fullWidth size="small" required>
                                                    <InputLabel>BBSS SUNAT</InputLabel>
                                                    <Controller
                                                        name="bbssSunat"
                                                        control={control}
                                                        rules={{ required: 'Campo requerido' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                label="BBSS SUNAT"
                                                                error={!!errors.bbssSunat}
                                                            >
                                                                {bbssSunat.map(item => (
                                                                    <MenuItem key={item.value} value={item.value}>
                                                                        {item.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.bbssSunat && (
                                                        <FormHelperText error>
                                                            {errors.bbssSunat.message}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Condiciones de pago */}
                                <Grid size={{ xs: 12 }}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                💳 Condiciones de Pago Disponibles
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Alert severity="info" sx={{ mb: 2 }}>
                                                Condiciones de pago que pueden aplicarse a este producto
                                            </Alert>
                                            <Grid container spacing={1}>
                                                {condicionesPago.map((condicion, index) => (
                                                    <Grid size={{ xs: 12 }} sm={6} md={4} key={index}>
                                                        <Chip
                                                            label={condicion}
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                            sx={{ width: '100%', justifyContent: 'flex-start' }}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Paso 5: Revisión Final */}
                {activeStep === 4 && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon sx={{ mr: 1 }} />
                                Revisión Final
                            </Typography>

                            <Alert severity="success" sx={{ mb: 3 }}>
                                Revisa toda la información antes de guardar el registro del producto.
                            </Alert>

                            <Grid container spacing={3}>
                                {/* Resumen de información básica */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                📦 Información Básica
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Código ERP"
                                                        secondary={watch('codERP')}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Marca"
                                                        secondary={marcas.find(m => m.value === watch('marca'))?.label}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Código Comercial"
                                                        secondary={watch('codComercial')}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Descripción"
                                                        secondary={watch('descripcion')}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Unidad de Medida"
                                                        secondary={unidadesMedida.find(u => u.value === watch('unidadMedida'))?.label}
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
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Resumen de clasificación */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                                                🗂️ Clasificación
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Clase"
                                                        secondary={clases.find(c => c.value === watch('clase'))?.label}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Sub-Clase"
                                                        secondary={subClases.find(s => s.value === watch('subClase'))?.label}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Sub-Sub-Clase"
                                                        secondary={subSubClases.find(s => s.value === watch('subSubClase'))?.label || 'No especificado'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="BBSS SUNAT"
                                                        secondary={bbssSunat.find(b => b.value === watch('bbssSunat'))?.label}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Resumen de traducciones */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                                                🌍 Traducciones
                                            </Typography>
                                            <List dense>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Modelo (Traducción)"
                                                        secondary={watch('modeloTraduccion') || 'No especificado'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Descripción (Traducción)"
                                                        secondary={watch('descripcionTraduccion') || 'No especificado'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Material (Traducción)"
                                                        secondary={watch('materialTraduccion') || 'No especificado'}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Uso (Traducción)"
                                                        secondary={watch('usoTraduccion') || 'No especificado'}
                                                    />
                                                </ListItem>
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Observaciones finales */}
                                <Grid size={{ xs: 12, md: 6 }}>
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
                                                placeholder="Agregar cualquier observación adicional sobre el producto..."
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
                {activeStep < 4 && (
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
                {activeStep === 4 && (
                    <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" color="primary">
                                    ¿Todo está correcto?
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Revisa la información antes de guardar el producto
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
                                            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                            boxShadow: '0 3px 5px 2px rgba(255, 107, 107, .3)',
                                            minWidth: 150,
                                        }}
                                    >
                                        {loading ? 'Guardando...' : 'Guardar Producto'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                        
                        {/* Barra de progreso durante guardado */}
                        {loading && (
                            <Box sx={{ mt: 2 }}>
                                <LinearProgress />
                                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                    Procesando registro del producto...
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
                    Vista Previa del Producto
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                                    <InventoryIcon fontSize="large" />
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{watch('descripcion')}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {watch('codERP')} | {watch('codComercial')}
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
                            <Typography variant="body2"><strong>Marca:</strong> {marcas.find(m => m.value === watch('marca'))?.label}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2"><strong>Unidad:</strong> {unidadesMedida.find(u => u.value === watch('unidadMedida'))?.label}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2"><strong>Clase:</strong> {clases.find(c => c.value === watch('clase'))?.label}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2"><strong>Sub-Clase:</strong> {subClases.find(s => s.value === watch('subClase'))?.label}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2"><strong>BBSS SUNAT:</strong> {bbssSunat.find(b => b.value === watch('bbssSunat'))?.label}</Typography>
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
                onClick={() => window.history.back()}
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
    );
};

export default ProductCreate;