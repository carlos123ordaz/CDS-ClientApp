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
} from '@mui/material';
import {
  Build as BuildIcon,
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
  Settings as SettingsIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { Controller, useForm } from "react-hook-form";

// Interfaces
interface ServiceFormData {
  codERP: string;
  marca: string;
  codComercial: string;
  descripcion: string;
  unidadMedida: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  medida: string;
  tipoServicio: string;
  duracionEstimada: string;
  nivelComplejidad: string;
  certificacionRequerida: string;
  equipoNecesario: string;
  estado: string;
  observaciones: string;
}

// Catálogos de servicios
const marcasServicios = [
  { value: 'CONSUSA', label: 'Consusa' },
  { value: 'CATERPILLAR', label: 'Caterpillar' },
  { value: 'KOMATSU', label: 'Komatsu' },
  { value: 'VOLVO', label: 'Volvo' },
  { value: 'JOHN_DEERE', label: 'John Deere' },
  { value: 'GENERICO', label: 'Genérico' },
];

const unidadesMedida = [
  { value: 'UND', label: 'Unidad' },
  { value: 'HORA', label: 'Hora' },
  { value: 'DIA', label: 'Día' },
  { value: 'SERVICIO', label: 'Servicio' },
  { value: 'METRO', label: 'Metro' },
  { value: 'KM', label: 'Kilómetro' },
  { value: 'VISITA', label: 'Visita' },
];

const clasesServicios = [
  { value: '03-SRV', label: '03-SRV - Servicios Generales' },
  { value: '03-MAN', label: '03-MAN - Mantenimiento' },
  { value: '03-REP', label: '03-REP - Reparación' },
  { value: '03-CAL', label: '03-CAL - Calibración' },
  { value: '03-INS', label: '03-INS - Instalación' },
];

const subClasesServicios = [
  { value: '3A-MEC', label: '3A-MEC - Mecánico' },
  { value: '3B-AU', label: '3B-AU - Automotriz' },
  { value: '3C-ELEC', label: '3C-ELEC - Eléctrico' },
  { value: '3D-HIDR', label: '3D-HIDR - Hidráulico' },
  { value: '3E-INST', label: '3E-INST - Instrumentación' },
];

const subSubClasesServicios = [
  { value: '3B1-MOT', label: '3B1-MOT - Motor' },
  { value: '3B2-TRANS', label: '3B2-TRANS - Transmisión' },
  { value: '3B3-AEJ', label: '3B3-AEJ - Eje' },
  { value: '3B4-FRENOS', label: '3B4-FRENOS - Frenos' },
  { value: '3B5-SUSP', label: '3B5-SUSP - Suspensión' },
  { value: '3C1-MOTOR', label: '3C1-MOTOR - Motor Eléctrico' },
  { value: '3C2-CONTROL', label: '3C2-CONTROL - Control' },
];

const tiposServicio = [
  { value: 'PREVENTIVO', label: 'Mantenimiento Preventivo' },
  { value: 'CORRECTIVO', label: 'Mantenimiento Correctivo' },
  { value: 'PREDICTIVO', label: 'Mantenimiento Predictivo' },
  { value: 'CALIBRACION', label: 'Calibración' },
  { value: 'INSTALACION', label: 'Instalación' },
  { value: 'REPARACION', label: 'Reparación' },
  { value: 'DIAGNOSTICO', label: 'Diagnóstico' },
  { value: 'CONSULTORIA', label: 'Consultoría' },
];

const nivelesComplejidad = [
  { value: 'BASICO', label: 'Básico', color: 'success' },
  { value: 'INTERMEDIO', label: 'Intermedio', color: 'warning' },
  { value: 'AVANZADO', label: 'Avanzado', color: 'error' },
  { value: 'ESPECIALIZADO', label: 'Especializado', color: 'info' },
];

const duracionesEstimadas = [
  { value: '1-2H', label: '1-2 Horas' },
  { value: '2-4H', label: '2-4 Horas' },
  { value: '4-8H', label: '4-8 Horas (Día completo)' },
  { value: '1-2D', label: '1-2 Días' },
  { value: '3-5D', label: '3-5 Días (Semana)' },
  { value: '1-2S', label: '1-2 Semanas' },
  { value: 'MAS_2S', label: 'Más de 2 semanas' },
];

const certificacionesRequeridas = [
  'Certificación ISO 9001',
  'Certificación de soldadura',
  'Licencia de manejo de grúas',
  'Certificación eléctrica',
  'Certificación hidráulica',
  'Certificación en altura',
  'Certificación OHSAS 18001',
  'Sin certificación especial',
];

const equiposNecesarios = [
  'Herramientas básicas',
  'Equipos de medición',
  'Grúa móvil',
  'Soldadora',
  'Compresor',
  'Equipo hidráulico',
  'Instrumentos de calibración',
  'Equipos de diagnóstico',
  'Herramientas especiales',
];

const estados = [
  { value: 'ACTIVO', label: 'Activo', color: 'success' },
  { value: 'INACTIVO', label: 'Inactivo', color: 'error' },
  { value: 'EN_DESARROLLO', label: 'En Desarrollo', color: 'info' },
  { value: 'DESCONTINUADO', label: 'Descontinuado', color: 'warning' },
];

const CreateService: React.FC = () => {
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
  } = useForm<ServiceFormData>({
    defaultValues: {
      estado: 'ACTIVO',
      unidadMedida: 'HORA',
      clase: '',
      subClase: '',
      subSubClase: '',
      marca: '',
      codERP: '',
      codComercial: '',
      descripcion: '',
      medida: '',
      tipoServicio: '',
      duracionEstimada: '',
      nivelComplejidad: 'BASICO',
      certificacionRequerida: '',
      equipoNecesario: '',
      observaciones: ''
    }
  });

  // Watch para campos dependientes
  const watchClase = watch('clase');
  const watchSubClase = watch('subClase');
  const watchMarca = watch('marca');
  const watchTipoServicio = watch('tipoServicio');

  // Stepper steps
  const steps = [
    {
      label: 'Información Básica',
      description: 'Códigos y descripción del servicio',
      icon: <BuildIcon />,
    },
    {
      label: 'Clasificación',
      description: 'Categorización del servicio',
      icon: <CategoryIcon />,
    },
    {
      label: 'Especificaciones',
      description: 'Detalles técnicos del servicio',
      icon: <SettingsIcon />,
    },
    {
      label: 'Requisitos',
      description: 'Certificaciones y equipos',
      icon: <SpeedIcon />,
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
    const tipoServicio = watch('tipoServicio');
    
    if (marca && clase) {
      const timestamp = Date.now().toString().slice(-6);
      const prefijo = tipoServicio ? tipoServicio.substring(0, 3) : 'SRV';
      const codigo = `${prefijo}-${marca.substring(0, 3)}-${timestamp}`.toUpperCase();
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
    const fieldsToValidate: Record<number, (keyof ServiceFormData)[]> = {
      0: ['codERP', 'marca', 'codComercial', 'descripcion', 'unidadMedida'],
      1: ['clase', 'subClase', 'tipoServicio'],
      2: ['duracionEstimada', 'nivelComplejidad'],
      3: [], // Requisitos son opcionales
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

  // Guardar servicio
  const guardarServicio = (data: ServiceFormData) => {
    setLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Servicio guardado:', data);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Servicio registrado correctamente',
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
  useEffect(() => {
    generarCodigoERP();
  }, [watchMarca, watchClase, watchTipoServicio]);

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
          <BuildIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Servicios
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Nuevo Servicio
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Registro de Nuevo Servicio
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
                <BuildIcon sx={{ fontSize: 40 }} />
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

      <form onSubmit={handleSubmit(guardarServicio)}>
        {/* Paso 1: Información Básica */}
        {activeStep === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <BuildIcon sx={{ mr: 1 }} />
                Información Básica del Servicio
              </Typography>

              <Grid container spacing={3}>
                {/* Códigos de identificación */}
                <Grid size={{ xs: 12}} >
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
                                {marcasServicios.map(marca => (
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
                          label="Código Comercial"
                          {...register('codComercial', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.codComercial}
                          helperText={errors.codComercial?.message}
                          placeholder="Serv-ElDir.P.marcha.UNAU"
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
                <Grid size={{ xs: 12}} >
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Descripción y Medidas
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 8}}>
                        <TextField
                          label="Descripción del Servicio"
                          {...register('descripcion', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.descripcion}
                          helperText={errors.descripcion?.message}
                          placeholder="Descripción detallada del servicio a realizar..."
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
                        
                        <Box sx={{ mt: 2 }}>
                          <TextField
                            label="Medidas Específicas"
                            {...register('medida')}
                            size="small"
                            fullWidth
                            placeholder="Detalles adicionales"
                          />
                        </Box>

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
                Clasificación del Servicio
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}} >
                  <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Categorización
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Tipo de Servicio</InputLabel>
                          <Controller
                            name="tipoServicio"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Tipo de Servicio"
                                error={!!errors.tipoServicio}
                              >
                                {tiposServicio.map(tipo => (
                                  <MenuItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.tipoServicio && (
                            <FormHelperText error>
                              {errors.tipoServicio.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      
                      <Grid size={{ xs: 12, md:6}} >
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
                                {clasesServicios.map(clase => (
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

                      <Grid size={{ xs: 12, md:6}} >
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
                                {subClasesServicios.map(subClase => (
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

                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small">
                          <InputLabel>Sub-Sub-Clase</InputLabel>
                          <Controller
                            name="subSubClase"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Sub-Sub-Clase">
                                {subSubClasesServicios.map(subSubClase => (
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

        {/* Paso 3: Especificaciones */}
        {activeStep === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                Especificaciones del Servicio
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}} >
                  <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Características Técnicas
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Duración Estimada</InputLabel>
                          <Controller
                            name="duracionEstimada"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Duración Estimada"
                                error={!!errors.duracionEstimada}
                              >
                                {duracionesEstimadas.map(duracion => (
                                  <MenuItem key={duracion.value} value={duracion.value}>
                                    {duracion.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.duracionEstimada && (
                            <FormHelperText error>
                              {errors.duracionEstimada.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Nivel de Complejidad</InputLabel>
                          <Controller
                            name="nivelComplejidad"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Nivel de Complejidad"
                                error={!!errors.nivelComplejidad}
                              >
                                {nivelesComplejidad.map(nivel => (
                                  <MenuItem key={nivel.value} value={nivel.value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip 
                                        label={nivel.label} 
                                        color={nivel.color as any} 
                                        size="small" 
                                      />
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.nivelComplejidad && (
                            <FormHelperText error>
                              {errors.nivelComplejidad.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Paso 4: Requisitos */}
        {activeStep === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <SpeedIcon sx={{ mr: 1 }} />
                Requisitos y Equipos
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                Esta información ayuda a determinar los recursos necesarios para el servicio
              </Alert>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}} >
                  <Paper sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Certificaciones y Equipos
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small">
                          <InputLabel>Certificación Requerida</InputLabel>
                          <Controller
                            name="certificacionRequerida"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Certificación Requerida">
                                {certificacionesRequeridas.map(cert => (
                                  <MenuItem key={cert} value={cert}>
                                    {cert}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, md:6}} >
                        <FormControl fullWidth size="small">
                          <InputLabel>Equipo Necesario</InputLabel>
                          <Controller
                            name="equipoNecesario"
                            control={control}
                            render={({ field }) => (
                              <Select {...field} label="Equipo Necesario">
                                {equiposNecesarios.map(equipo => (
                                  <MenuItem key={equipo} value={equipo}>
                                    {equipo}
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

                {/* Certificaciones disponibles */}
                <Grid size={{ xs: 12}} >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Certificaciones Disponibles
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Certificaciones que pueden ser requeridas para este tipo de servicio
                      </Alert>
                      <Grid container spacing={1}>
                        {certificacionesRequeridas.map((cert, index) => (
                          <Grid size={{ xs: 12, md:4, sm: 6}}  key={index}>
                            <Chip
                              label={cert}
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

                {/* Equipos disponibles */}
                <Grid size={{ xs: 12}} >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Equipos Disponibles
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Equipos que pueden ser necesarios para realizar este servicio
                      </Alert>
                      <Grid container spacing={1}>
                        {equiposNecesarios.map((equipo, index) => (
                          <Grid size={{ xs: 12, md:4, sm: 6}}  key={index}>
                            <Chip
                              label={equipo}
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
                Revisa toda la información antes de guardar el registro del servicio.
              </Alert>

              <Grid container spacing={3}>
                {/* Resumen de información básica */}
                <Grid size={{ xs: 12, md:6}} >
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
                            secondary={marcasServicios.find(m => m.value === watch('marca'))?.label}
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
                <Grid size={{ xs: 12, md:6}} >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                        Clasificación
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Tipo de Servicio"
                            secondary={tiposServicio.find(t => t.value === watch('tipoServicio'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Clase"
                            secondary={clasesServicios.find(c => c.value === watch('clase'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sub-Clase"
                            secondary={subClasesServicios.find(s => s.value === watch('subClase'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sub-Sub-Clase"
                            secondary={subSubClasesServicios.find(s => s.value === watch('subSubClase'))?.label || 'No especificado'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen de especificaciones */}
                <Grid size={{ xs: 12, md:6}} >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                        Especificaciones
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Duración Estimada"
                            secondary={duracionesEstimadas.find(d => d.value === watch('duracionEstimada'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Nivel de Complejidad"
                            secondary={
                              <Chip
                                label={nivelesComplejidad.find(n => n.value === watch('nivelComplejidad'))?.label}
                                color={nivelesComplejidad.find(n => n.value === watch('nivelComplejidad'))?.color as any}
                                size="small"
                              />
                            }
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Medidas Específicas"
                            secondary={watch('medida') || 'No especificado'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen de requisitos */}
                <Grid size={{ xs: 12, md:6}} >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                        Requisitos
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Certificación Requerida"
                            secondary={watch('certificacionRequerida') || 'No especificado'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Equipo Necesario"
                            secondary={watch('equipoNecesario') || 'No especificado'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Observaciones finales */}
                <Grid size={{ xs: 12}} >
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                        Observaciones Adicionales
                      </Typography>
                      <TextField
                        label="Observaciones del registro"
                        {...register('observaciones')}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Agregar cualquier observación adicional sobre el servicio..."
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
              <Grid size={{ xs: 12, md:6}} >
                <Typography variant="h6" color="primary">
                  ¿Todo está correcto?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisa la información antes de guardar el servicio
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md:6}} >
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
                    {loading ? 'Guardando...' : 'Guardar Servicio'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Barra de progreso durante guardado */}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Procesando registro del servicio...
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
          Vista Previa del Servicio
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12}} >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  <BuildIcon fontSize="large" />
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
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Marca:</strong> {marcasServicios.find(m => m.value === watch('marca'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Unidad:</strong> {unidadesMedida.find(u => u.value === watch('unidadMedida'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Tipo:</strong> {tiposServicio.find(t => t.value === watch('tipoServicio'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Duración:</strong> {duracionesEstimadas.find(d => d.value === watch('duracionEstimada'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Clase:</strong> {clasesServicios.find(c => c.value === watch('clase'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Complejidad:</strong> {nivelesComplejidad.find(n => n.value === watch('nivelComplejidad'))?.label}</Typography>
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

export default CreateService;