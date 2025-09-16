import React, { useState, useEffect } from 'react';
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
  Autocomplete,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Engineering as ProjectIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  QrCode as QrCodeIcon,
  Description as DescriptionIcon,
  Preview as PreviewIcon,
  LocalOffer as TagIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  Group as TeamIcon,
} from '@mui/icons-material';
import { Controller, useForm } from "react-hook-form";

// Interfaces
interface ProjectFormData {
  // Información básica
  codERP: string;
  marca: string;
  codComercial: string;
  nombreProyecto: string;
  descripcion: string;
  unidadMedida: string;
  
  // Clasificación
  clase: string;
  subClase: string;
  subSubClase: string;
  tipoProyecto: string;
  
  // Cliente y ubicación
  cliente: string;
  contactoCliente: string;
  emailCliente: string;
  ubicacion: string;
  region: string;
  
  // Cronograma
  fechaInicio: string;
  fechaFinEstimada: string;
  duracionEstimada: string;
  prioridad: string;
  
  // Presupuesto y recursos
  presupuesto: string;
  moneda: string;
  responsable: string;
  equipoTrabajo: string[];
  
  // Estado y configuración
  estado: string;
  requiereAprobacion: boolean;
  observaciones: string;
}

// Catálogos específicos para proyectos
const marcasProyectos = [
  { value: 'Consusa', label: 'Consusa' },
  { value: 'Endress+Hauser', label: 'Endress+Hauser' },
  { value: 'Siemens', label: 'Siemens' },
  { value: 'ABB', label: 'ABB' },
  { value: 'Schneider Electric', label: 'Schneider Electric' },
  { value: 'Honeywell', label: 'Honeywell' },
];

const unidadesMedida = [
  { value: 'UND', label: 'Unidad' },
  { value: 'PROYECTO', label: 'Proyecto' },
  { value: 'FASE', label: 'Fase' },
  { value: 'ETAPA', label: 'Etapa' },
  { value: 'SERVICIO', label: 'Servicio' },
];

const clasesProyectos = [
  { value: '03-PROY', label: '03-PROY - Proyectos' },
  { value: '04-CONS', label: '04-CONS - Consultoría' },
  { value: '05-IMPL', label: '05-IMPL - Implementación' },
  { value: '06-MANT', label: '06-MANT - Mantenimiento' },
];

const subClasesProyectos = [
  { value: '3A-CONS', label: '3A-CONS - Consultoría' },
  { value: '3B-EJEC', label: '3B-EJEC - Ejecución' },
  { value: '3C-MAT', label: '3C-MAT - Material' },
  { value: '3D-MANT', label: '3D-MANT - Mantenimiento' },
  { value: '3E-MOD', label: '3E-MOD - Modernización' },
  { value: '3F-CAP', label: '3F-CAP - Capacitación' },
];

const subSubClasesProyectos = [
  { value: '3A1-TEC', label: '3A1-TEC - Técnica' },
  { value: '3B1-DIR', label: '3B1-DIR - Directa' },
  { value: '3C1-MEC', label: '3C1-MEC - Mecánicos' },
  { value: '3D1-PREV', label: '3D1-PREV - Preventivo' },
  { value: '3E1-CTRL', label: '3E1-CTRL - Control' },
  { value: '3F1-TEC', label: '3F1-TEC - Técnica' },
];

const tiposProyecto = [
  { value: 'CONSULTORIA', label: 'Consultoría' },
  { value: 'IMPLEMENTACION', label: 'Implementación' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  { value: 'MODERNIZACION', label: 'Modernización' },
  { value: 'CAPACITACION', label: 'Capacitación' },
  { value: 'SUMINISTRO', label: 'Suministro' },
  { value: 'INSTALACION', label: 'Instalación' },
];

const clientes = [
  'Minera Las Bambas',
  'Antamina S.A.',
  'Cerro Verde S.A.',
  'Southern Copper',
  'Buenaventura',
  'Volcan Compañía Minera',
  'Chinalco Perú',
  'Hudbay Perú',
  'Pan American Silver',
  'Minsur S.A.',
];

const regiones = [
  'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque',
  'Cajamarca', 'Junín', 'Ica', 'Huánuco', 'Ancash', 'Ayacucho',
  'Loreto', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali', 'Amazonas',
  'Apurímac', 'Huancavelica', 'Moquegua', 'Pasco', 'Madre de Dios', 'Puno'
];

const prioridades = [
  { value: 'BAJA', label: 'Baja', color: 'success' },
  { value: 'MEDIA', label: 'Media', color: 'warning' },
  { value: 'ALTA', label: 'Alta', color: 'error' },
  { value: 'CRITICA', label: 'Crítica', color: 'error' },
];

const estados = [
  { value: 'PLANIFICACION', label: 'Planificación', color: 'info' },
  { value: 'EN_PROGRESO', label: 'En Progreso', color: 'success' },
  { value: 'PAUSADO', label: 'Pausado', color: 'warning' },
  { value: 'COMPLETADO', label: 'Completado', color: 'primary' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'error' },
];

const monedas = [
  { value: 'USD', label: 'Dólares (USD)' },
  { value: 'PEN', label: 'Soles (PEN)' },
  { value: 'EUR', label: 'Euros (EUR)' },
];

const responsables = [
  'Carlos Rodriguez',
  'Maria Gonzales',
  'Luis Torres',
  'Ana Silva',
  'Roberto Silva',
  'Patricia Mendoza',
  'Jorge Ramirez',
  'Carmen Vargas',
];

const equipoTrabajo = [
  'Ing. Carlos Rodriguez - Jefe de Proyecto',
  'Ing. Maria Gonzales - Especialista en Control',
  'Tec. Luis Torres - Técnico de Campo',
  'Ing. Ana Silva - Especialista en Instrumentación',
  'Tec. Roberto Silva - Técnico Eléctrico',
  'Ing. Patricia Mendoza - Especialista en Automatización',
  'Tec. Jorge Ramirez - Técnico Mecánico',
  'Ing. Carmen Vargas - Supervisora de Calidad',
];

const CreateProject: React.FC = () => {
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
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
  } = useForm<ProjectFormData>({
    defaultValues: {
      codERP: '',
      marca: 'Consusa',
      codComercial: '',
      nombreProyecto: '',
      descripcion: '',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '',
      subSubClase: '',
      tipoProyecto: '',
      cliente: '',
      contactoCliente: '',
      emailCliente: '',
      ubicacion: '',
      region: 'Lima',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFinEstimada: '',
      duracionEstimada: '',
      prioridad: 'MEDIA',
      presupuesto: '',
      moneda: 'USD',
      responsable: '',
      equipoTrabajo: [],
      estado: 'PLANIFICACION',
      requiereAprobacion: true,
      observaciones: ''
    }
  });

  // Watch para campos dependientes
  const watchClase = watch('clase');
  const watchSubClase = watch('subClase');
  const watchMarca = watch('marca');
  const watchTipoProyecto = watch('tipoProyecto');
  const watchNombreProyecto = watch('nombreProyecto');

  // Stepper steps
  const steps = [
    {
      label: 'Información Básica',
      description: 'Códigos y descripción del proyecto',
      icon: <QrCodeIcon />,
    },
    {
      label: 'Clasificación',
      description: 'Tipo y categorización',
      icon: <CategoryIcon />,
    },
    {
      label: 'Cliente y Ubicación',
      description: 'Información del cliente',
      icon: <BusinessIcon />,
    },
    {
      label: 'Cronograma y Recursos',
      description: 'Fechas, presupuesto y equipo',
      icon: <ScheduleIcon />,
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
    const tipoProyecto = watch('tipoProyecto');
    
    if (marca && tipoProyecto) {
      const timestamp = Date.now().toString().slice(-6);
      const prefijo = tipoProyecto.substring(0, 3);
      const codigo = `${prefijo}-${marca.substring(0, 3)}-${timestamp}`.toUpperCase();
      setValue('codERP', codigo);
    }
  };

  // Generar código comercial automáticamente
  const generarCodigoComercial = () => {
    const tipoProyecto = watch('tipoProyecto');
    const nombreProyecto = watch('nombreProyecto');
    
    if (tipoProyecto && nombreProyecto) {
      const palabrasClave = nombreProyecto.split(' ').slice(0, 3);
      const codigo = `Proy.${tipoProyecto.substring(0, 3)}.${palabrasClave.join('.')}`;
      setValue('codComercial', codigo);
    }
  };

  // Validaciones personalizadas
  const validateCodERP = (value: string) => {
    if (!value) return 'Campo requerido';
    if (value.length < 5) return 'Mínimo 5 caracteres';
    return true;
  };

  const validatePresupuesto = (value: string) => {
    if (!value) return 'Campo requerido';
    const presupuesto = parseFloat(value);
    if (isNaN(presupuesto) || presupuesto <= 0) return 'Presupuesto debe ser mayor a 0';
    return true;
  };

  const validateFechas = (fechaFin: string) => {
    const fechaInicio = watch('fechaInicio');
    if (!fechaFin) return 'Campo requerido';
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      return 'Fecha fin debe ser posterior a fecha inicio';
    }
    return true;
  };

  // Validar paso actual
  const validateStep = async (step: number) => {
    const fieldsToValidate: Record<number, (keyof ProjectFormData)[]> = {
      0: ['codERP', 'marca', 'codComercial', 'nombreProyecto', 'descripcion'],
      1: ['clase', 'subClase', 'tipoProyecto'],
      2: ['cliente', 'contactoCliente', 'emailCliente', 'ubicacion'],
      3: ['fechaInicio', 'fechaFinEstimada', 'presupuesto', 'responsable'],
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

  // Guardar proyecto
  const guardarProyecto = (data: ProjectFormData) => {
    setLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Proyecto guardado:', data);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Proyecto registrado correctamente',
        severity: 'success'
      });
    }, 2000);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    reset();
    setActiveStep(0);
  };

  // Efectos para generar campos automáticamente
  useEffect(() => {
    generarCodigoERP();
  }, [watchMarca, watchTipoProyecto]);

  useEffect(() => {
    generarCodigoComercial();
  }, [watchTipoProyecto, watchNombreProyecto]);

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
          <ProjectIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Proyectos
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Nuevo Proyecto
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Registro de Nuevo Proyecto
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
                <ProjectIcon sx={{ fontSize: 40 }} />
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

      <form onSubmit={handleSubmit(guardarProyecto)}>
        {/* Paso 1: Información Básica */}
        {activeStep === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <QrCodeIcon sx={{ mr: 1 }} />
                Información Básica del Proyecto
              </Typography>

              <Grid container spacing={3}>
                {/* Códigos de identificación */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Códigos de Identificación
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4}}>
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
                      <Grid size={{ xs: 12, md: 4}}>
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
                                {marcasProyectos.map(marca => (
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
                      <Grid size={{ xs: 12, md: 4}}>
                        <TextField
                          label="Código Comercial (Generado automáticamente)"
                          {...register('codComercial', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.codComercial}
                          helperText={errors.codComercial?.message || 'Se genera automáticamente'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <TagIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ 
                            '& .MuiInputBase-input': {
                              color: 'secondary.main'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Información del proyecto */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Información del Proyecto
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 8}}>
                        <TextField
                          label="Nombre del Proyecto"
                          {...register('nombreProyecto', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.nombreProyecto}
                          helperText={errors.nombreProyecto?.message}
                          placeholder="Consultoría Técnica - Sistema de Control"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AssignmentIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
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
                      </Grid>
                      <Grid size={{ xs: 12}}>
                        <TextField
                          label="Descripción del Proyecto"
                          {...register('descripcion', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.descripcion}
                          helperText={errors.descripcion?.message}
                          placeholder="Descripción detallada del alcance y objetivos del proyecto..."
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
                Clasificación del Proyecto
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Categorización
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Sub-Sub-Clase</InputLabel>
                          <Controller
                            name="subSubClase"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Sub-Sub-Clase">
                                {subSubClasesProyectos.map(subSubClase => (
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
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Cliente y Ubicación */}
        {activeStep === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Información del Cliente y Ubicación
              </Typography>

              <Grid container spacing={3}>
                {/* Información del cliente */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Información del Cliente
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <Controller
                          name="cliente"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={clientes}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Cliente"
                                  required
                                  error={!!errors.cliente}
                                  helperText={errors.cliente?.message}
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <BusinessIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || '')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Contacto Principal del Cliente"
                          {...register('contactoCliente', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.contactoCliente}
                          helperText={errors.contactoCliente?.message}
                          placeholder="Ing. Juan Pérez"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Email del Contacto"
                          {...register('emailCliente', { 
                            required: 'Campo requerido',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Email inválido'
                            }
                          })}
                          size="small"
                          fullWidth
                          required
                          type="email"
                          error={!!errors.emailCliente}
                          helperText={errors.emailCliente?.message}
                          placeholder="juan.perez@cliente.com"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Ubicación del proyecto */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Ubicación del Proyecto
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 8}}>
                        <TextField
                          label="Ubicación / Dirección"
                          {...register('ubicacion', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.ubicacion}
                          helperText={errors.ubicacion?.message}
                          placeholder="Av. Industrial 123, Planta Concentradora"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
                        <Controller
                          name="region"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={regiones}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Región"
                                  required
                                  error={!!errors.region}
                                  helperText={errors.region?.message}
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || '')}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Paso 4: Cronograma y Recursos */}
        {activeStep === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 1 }} />
                Cronograma y Recursos
              </Typography>

              <Grid container spacing={3}>
                {/* Cronograma */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Cronograma del Proyecto
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4}}>
                        <TextField
                          label="Fecha de Inicio"
                          {...register('fechaInicio', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          type="date"
                          error={!!errors.fechaInicio}
                          helperText={errors.fechaInicio?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
                        <TextField
                          label="Fecha Fin Estimada"
                          {...register('fechaFinEstimada', { 
                            required: 'Campo requerido',
                            validate: validateFechas
                          })}
                          size="small"
                          fullWidth
                          required
                          type="date"
                          error={!!errors.fechaFinEstimada}
                          helperText={errors.fechaFinEstimada?.message}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
                        <TextField
                          label="Duración Estimada"
                          {...register('duracionEstimada')}
                          size="small"
                          fullWidth
                          placeholder="3 meses"
                          helperText="Duración aproximada del proyecto"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Prioridad</InputLabel>
                          <Controller
                            name="prioridad"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Prioridad">
                                {prioridades.map(prioridad => (
                                  <MenuItem key={prioridad.value} value={prioridad.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip 
                                        label={prioridad.label} 
                                        color={prioridad.color as any} 
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
                      <Grid size={{ xs: 12, md: 6}}>
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
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Presupuesto */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Presupuesto
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Presupuesto"
                          {...register('presupuesto', { 
                            required: 'Campo requerido',
                            validate: validatePresupuesto
                          })}
                          size="small"
                          fullWidth
                          required
                          type="number"
                          error={!!errors.presupuesto}
                          helperText={errors.presupuesto?.message}
                          placeholder="150000"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MoneyIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Moneda</InputLabel>
                          <Controller
                            name="moneda"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Moneda">
                                {monedas.map(moneda => (
                                  <MenuItem key={moneda.value} value={moneda.value}>
                                    {moneda.label}
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

                {/* Equipo de trabajo */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Equipo de Trabajo
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <Controller
                          name="responsable"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={responsables}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Responsable del Proyecto"
                                  required
                                  error={!!errors.responsable}
                                  helperText={errors.responsable?.message}
                                  InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <TeamIcon />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || '')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <Controller
                          name="equipoTrabajo"
                          control={control}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              multiple
                              options={equipoTrabajo}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Equipo de Trabajo"
                                  placeholder="Seleccionar miembros del equipo"
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || [])}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12}}>
                        <Controller
                          name="requiereAprobacion"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                  color="primary"
                                />
                              }
                              label="Requiere aprobación gerencial"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
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
                Revisa toda la información antes de guardar el registro del proyecto.
              </Alert>

              <Grid container spacing={3}>
                {/* Resumen información básica */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Información Básica
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
                            secondary={marcasProyectos.find(m => m.value === watch('marca'))?.label}
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
                            primary="Nombre del Proyecto"
                            secondary={watch('nombreProyecto')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Descripción"
                            secondary={watch('descripcion')}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen clasificación */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                        Clasificación
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Tipo de Proyecto"
                            secondary={tiposProyecto.find(t => t.value === watch('tipoProyecto'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Clase"
                            secondary={clasesProyectos.find(c => c.value === watch('clase'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sub-Clase"
                            secondary={subClasesProyectos.find(s => s.value === watch('subClase'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sub-Sub-Clase"
                            secondary={subSubClasesProyectos.find(s => s.value === watch('subSubClase'))?.label || 'No especificado'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen cliente */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                        Cliente y Ubicación
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Cliente"
                            secondary={watch('cliente')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Contacto Principal"
                            secondary={watch('contactoCliente')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Email de Contacto"
                            secondary={watch('emailCliente')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Ubicación"
                            secondary={`${watch('ubicacion')}, ${watch('region')}`}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen cronograma */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                        Cronograma y Recursos
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Fecha de Inicio"
                            secondary={watch('fechaInicio')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Fecha Fin Estimada"
                            secondary={watch('fechaFinEstimada')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Presupuesto"
                            secondary={`${watch('presupuesto')} ${watch('moneda')}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Responsable"
                            secondary={watch('responsable')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Prioridad"
                            secondary={
                              <Chip
                                label={prioridades.find(p => p.value === watch('prioridad'))?.label}
                                color={prioridades.find(p => p.value === watch('prioridad'))?.color as any}
                                size="small"
                              />
                            }
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

                {/* Observaciones finales */}
                <Grid size={{ xs: 12}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                        Observaciones Adicionales
                      </Typography>
                      <TextField
                        label="Observaciones del proyecto"
                        {...register('observaciones')}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Agregar cualquier observación adicional sobre el proyecto..."
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
              <Grid size={{ xs: 12, md: 6}}>
                <Typography variant="h6" color="primary">
                  ¿Todo está correcto?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisa la información antes de guardar el proyecto
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6}}>
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
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                      minWidth: 150,
                    }}
                  >
                    {loading ? 'Guardando...' : 'Guardar Proyecto'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Barra de progreso durante guardado */}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Procesando registro del proyecto...
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
          Vista Previa del Proyecto
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  <ProjectIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6">{watch('nombreProyecto')}</Typography>
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
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Cliente:</strong> {watch('cliente')}</Typography>
            </Grid>
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Responsable:</strong> {watch('responsable')}</Typography>
            </Grid>
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Tipo:</strong> {tiposProyecto.find(t => t.value === watch('tipoProyecto'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Presupuesto:</strong> {watch('presupuesto')} {watch('moneda')}</Typography>
            </Grid>
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Inicio:</strong> {watch('fechaInicio')}</Typography>
            </Grid>
            <Grid size={{ xs: 6}}>
              <Typography variant="body2"><strong>Fin Estimado:</strong> {watch('fechaFinEstimada')}</Typography>
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

export default CreateProject;