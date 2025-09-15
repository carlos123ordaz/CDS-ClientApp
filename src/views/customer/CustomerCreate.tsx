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
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Preview as PreviewIcon,
  AccountBox as DocumentIcon,
  Work as IndustryIcon,
  Public as GlobalIcon,
} from '@mui/icons-material';
import { Controller, useForm } from "react-hook-form";

// Interfaces
interface ClientFormData {
  tipoDocumento: string;
  nroDocumento: string;
  razonSocial: string;
  nombreCliente: string;
  tipoCliente: string;
  industria: string;
  sector: string;
  zona: string;
  pais: string;
  estado: string;
  // Información de contacto
  contactoPrincipal: string;
  cargoContacto: string;
  telefono: string;
  email: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  codigoPostal: string;
  // Información comercial
  condicionPago: string;
  limitCredito: string;
  vendedorAsignado: string;
  canalVenta: string;
  // Información adicional
  sitioWeb: string;
  observaciones: string;
}

// Catálogos
const tiposDocumento = [
  { value: 'RUC', label: 'RUC - Registro Único de Contribuyentes' },
  { value: 'DNI', label: 'DNI - Documento Nacional de Identidad' },
  { value: 'CE', label: 'CE - Carnet de Extranjería' },
  { value: 'PASSPORT', label: 'Pasaporte' },
];

const tiposCliente = [
  { value: 'EMPRESA', label: 'Empresa' },
  { value: 'PERSONA', label: 'Persona Natural' },
  { value: 'GOBIERNO', label: 'Entidad Gubernamental' },
  { value: 'ONG', label: 'Organización sin Fines de Lucro' },
];

const industrias = [
  { value: 'Minería', label: 'Minería' },
  { value: 'Manufactura', label: 'Manufactura' },
  { value: 'Automotriz', label: 'Automotriz' },
  { value: 'Alimentos', label: 'Alimentos y Bebidas' },
  { value: 'Construcción', label: 'Construcción' },
  { value: 'Servicios', label: 'Servicios' },
  { value: 'Tecnología', label: 'Tecnología' },
  { value: 'Salud', label: 'Salud' },
  { value: 'Educación', label: 'Educación' },
  { value: 'Financiero', label: 'Financiero' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Agricultura', label: 'Agricultura' },
];

const sectores = [
  { value: 'Extractivo', label: 'Extractivo' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Consumo', label: 'Consumo' },
  { value: 'Servicios', label: 'Servicios' },
  { value: 'Tecnológico', label: 'Tecnológico' },
  { value: 'Financiero', label: 'Financiero' },
];

const zonas = [
  { value: 'Norte', label: 'Norte' },
  { value: 'Centro', label: 'Centro' },
  { value: 'Sur', label: 'Sur' },
  { value: 'Oriente', label: 'Oriente' },
  { value: 'Occidente', label: 'Occidente' },
];

const paises = [
  { value: 'Perú', label: 'Perú' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Brasil', label: 'Brasil' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'México', label: 'México' },
  { value: 'Estados Unidos', label: 'Estados Unidos' },
  { value: 'Canadá', label: 'Canadá' },
];

const estados = [
  { value: 'ACTIVO', label: 'Activo', color: 'success' },
  { value: 'INACTIVO', label: 'Inactivo', color: 'default' },
  { value: 'SUSPENDIDO', label: 'Suspendido', color: 'warning' },
  { value: 'PROSPECTO', label: 'Prospecto', color: 'info' },
];

const condicionesPago = [
  'Contado',
  'Crédito 15 días',
  'Crédito 30 días',
  'Crédito 45 días',
  'Crédito 60 días',
  'Crédito 90 días',
  'Letra 30 días',
  'Letra 60 días',
  'Letra 90 días',
];

const canalesVenta = [
  'Venta directa',
  'Distribuidor',
  'Online',
  'Retail',
  'Mayorista',
  'Exportación',
];

const departamentos = [
  'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura', 'Lambayeque',
  'Cajamarca', 'Junín', 'Ica', 'Huánuco', 'Ancash', 'Ayacucho',
  'Loreto', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali', 'Amazonas',
  'Apurímac', 'Huancavelica', 'Moquegua', 'Pasco', 'Madre de Dios', 'Puno'
];

const CreateClient: React.FC = () => {
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
  } = useForm<ClientFormData>({
    defaultValues: {
      tipoDocumento: 'RUC',
      nroDocumento: '',
      razonSocial: '',
      nombreCliente: '',
      tipoCliente: 'EMPRESA',
      industria: '',
      sector: '',
      zona: 'Centro',
      pais: 'Perú',
      estado: 'ACTIVO',
      contactoPrincipal: '',
      cargoContacto: '',
      telefono: '',
      email: '',
      direccion: '',
      distrito: '',
      provincia: '',
      departamento: 'Lima',
      codigoPostal: '',
      condicionPago: 'Crédito 30 días',
      limitCredito: '',
      vendedorAsignado: '',
      canalVenta: 'Venta directa',
      sitioWeb: '',
      observaciones: ''
    }
  });

  // Watch para campos dependientes
  const watchTipoDocumento = watch('tipoDocumento');
  const watchTipoCliente = watch('tipoCliente');
  const watchPais = watch('pais');

  // Stepper steps
  const steps = [
    {
      label: 'Información Básica',
      description: 'Documento e identificación',
      icon: <DocumentIcon />,
    },
    {
      label: 'Clasificación',
      description: 'Tipo, industria y ubicación',
      icon: <IndustryIcon />,
    },
    {
      label: 'Información de Contacto',
      description: 'Datos de contacto y dirección',
      icon: <ContactIcon />,
    },
    {
      label: 'Información Comercial',
      description: 'Condiciones comerciales',
      icon: <BusinessIcon />,
    },
    {
      label: 'Revisión Final',
      description: 'Confirmar información',
      icon: <CheckCircleIcon />,
    },
  ];

  // Validaciones personalizadas
  const validateDocumento = (value: string) => {
    const tipoDoc = watch('tipoDocumento');
    if (!value) return 'Campo requerido';
    
    switch (tipoDoc) {
      case 'RUC':
        if (value.length !== 11) return 'RUC debe tener 11 dígitos';
        if (!/^\d+$/.test(value)) return 'RUC solo debe contener números';
        break;
      case 'DNI':
        if (value.length !== 8) return 'DNI debe tener 8 dígitos';
        if (!/^\d+$/.test(value)) return 'DNI solo debe contener números';
        break;
    }
    return true;
  };

  const validateEmail = (value: string) => {
    if (!value) return 'Campo requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email inválido';
    return true;
  };

  // Validar paso actual
  const validateStep = async (step: number) => {
    const fieldsToValidate: Record<number, (keyof ClientFormData)[]> = {
      0: ['tipoDocumento', 'nroDocumento', 'razonSocial', 'nombreCliente'],
      1: ['tipoCliente', 'industria', 'sector', 'zona', 'pais'],
      2: ['contactoPrincipal', 'telefono', 'email', 'direccion', 'departamento'],
      3: ['condicionPago', 'canalVenta'],
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

  // Guardar cliente
  const guardarCliente = (data: ClientFormData) => {
    setLoading(true);
    
    // Simular guardado
    setTimeout(() => {
      console.log('Cliente guardado:', data);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Cliente registrado correctamente',
        severity: 'success'
      });
    }, 2000);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    reset();
    setActiveStep(0);
  };

  // Generar nombre cliente automáticamente
  const generarNombreCliente = () => {
    const razonSocial = watch('razonSocial');
    if (razonSocial) {
      // Extraer palabras clave para generar nombre corto
      const palabras = razonSocial.split(' ');
      let nombreCorto = '';
      
      for (const palabra of palabras) {
        if (palabra.length > 3 && !['SAA', 'SRL', 'SA', 'EIRL', 'del', 'de', 'la', 'las', 'los'].includes(palabra.toUpperCase())) {
          nombreCorto = palabra;
          break;
        }
      }
      
      if (nombreCorto) {
        setValue('nombreCliente', nombreCorto);
      }
    }
  };

  // Efecto para generar nombre cliente automáticamente
  useEffect(() => {
    generarNombreCliente();
  }, [watch('razonSocial')]);

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Registro de Nuevo Cliente
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
                <BusinessIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
          </Box>
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
      <form onSubmit={handleSubmit(guardarCliente)}>
        {activeStep === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <DocumentIcon sx={{ mr: 1 }} />
                Información Básica del Cliente
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Documento de Identificación
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4}}>
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
                      <Grid size={{ xs: 12, md: 8}}>
                        <TextField
                          label="Número de Documento"
                          {...register('nroDocumento', { 
                            required: 'Campo requerido',
                            validate: validateDocumento
                          })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.nroDocumento}
                          helperText={errors.nroDocumento?.message}
                          placeholder={watchTipoDocumento === 'RUC' ? '20123456789' : '12345678'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DocumentIcon />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ 
                            '& .MuiInputBase-input': {
                              fontWeight: 'bold',
                              fontFamily: 'monospace'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Información del Cliente
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12}}>
                        <TextField
                          label={watchTipoCliente === 'PERSONA' ? 'Nombres y Apellidos' : 'Razón Social'}
                          {...register('razonSocial', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.razonSocial}
                          helperText={errors.razonSocial?.message}
                          placeholder={watchTipoCliente === 'PERSONA' ? 'Juan Pérez García' : 'Sociedad Minera Ejemplo SAA'}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DescriptionIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Nombre Comercial/Corto"
                          {...register('nombreCliente', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.nombreCliente}
                          helperText={errors.nombreCliente?.message || 'Nombre corto para identificación rápida'}
                          placeholder="Ejemplo SA"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Tipo de Cliente</InputLabel>
                          <Controller
                            name="tipoCliente"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Tipo de Cliente"
                                error={!!errors.tipoCliente}
                              >
                                {tiposCliente.map(tipo => (
                                  <MenuItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.tipoCliente && (
                            <FormHelperText error>
                              {errors.tipoCliente.message}
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
        {activeStep === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IndustryIcon sx={{ mr: 1 }} />
                Clasificación del Cliente
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Clasificación Comercial
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Industria</InputLabel>
                          <Controller
                            name="industria"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Industria"
                                error={!!errors.industria}
                              >
                                {industrias.map(industria => (
                                  <MenuItem key={industria.value} value={industria.value}>
                                    {industria.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.industria && (
                            <FormHelperText error>
                              {errors.industria.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Sector</InputLabel>
                          <Controller
                            name="sector"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Sector"
                                error={!!errors.sector}
                              >
                                {sectores.map(sector => (
                                  <MenuItem key={sector.value} value={sector.value}>
                                    {sector.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.sector && (
                            <FormHelperText error>
                              {errors.sector.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Ubicación Geográfica
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 4}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>País</InputLabel>
                          <Controller
                            name="pais"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="País"
                                error={!!errors.pais}
                              >
                                {paises.map(pais => (
                                  <MenuItem key={pais.value} value={pais.value}>
                                    {pais.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.pais && (
                            <FormHelperText error>
                              {errors.pais.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
                        <FormControl fullWidth size="small" required>
                          <InputLabel>Zona</InputLabel>
                          <Controller
                            name="zona"
                            control={control}
                            rules={{ required: 'Campo requerido' }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Zona"
                                error={!!errors.zona}
                              >
                                {zonas.map(zona => (
                                  <MenuItem key={zona.value} value={zona.value}>
                                    {zona.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />
                          {errors.zona && (
                            <FormHelperText error>
                              {errors.zona.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4}}>
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
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Información de Contacto */}
        {activeStep === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <ContactIcon sx={{ mr: 1 }} />
                Información de Contacto
              </Typography>

              <Grid container spacing={3}>
                {/* Contacto principal */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Contacto Principal
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Nombre del Contacto"
                          {...register('contactoPrincipal', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.contactoPrincipal}
                          helperText={errors.contactoPrincipal?.message}
                          placeholder="Juan Pérez García"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Cargo del Contacto"
                          {...register('cargoContacto')}
                          size="small"
                          fullWidth
                          placeholder="Gerente de Compras"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Teléfono"
                          {...register('telefono', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.telefono}
                          helperText={errors.telefono?.message}
                          placeholder="+51 1 1234567"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ContactIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Email"
                          {...register('email', { 
                            required: 'Campo requerido',
                            validate: validateEmail
                          })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          placeholder="contacto@empresa.com"
                          type="email"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Dirección */}
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Dirección
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12}}>
                        <TextField
                          label="Dirección"
                          {...register('direccion', { required: 'Campo requerido' })}
                          size="small"
                          fullWidth
                          required
                          error={!!errors.direccion}
                          helperText={errors.direccion?.message}
                          placeholder="Av. Principal 123, Piso 5"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3}}>
                        <TextField
                          label="Distrito"
                          {...register('distrito')}
                          size="small"
                          fullWidth
                          placeholder="San Isidro"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3}}>
                        <TextField
                          label="Provincia"
                          {...register('provincia')}
                          size="small"
                          fullWidth
                          placeholder="Lima"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3}}>
                        <Controller
                          name="departamento"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={departamentos}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Departamento"
                                  required
                                  error={!!errors.departamento}
                                  helperText={errors.departamento?.message}
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || '')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 3}}>
                        <TextField
                          label="Código Postal"
                          {...register('codigoPostal')}
                          size="small"
                          fullWidth
                          placeholder="15036"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Paso 4: Información Comercial */}
        {activeStep === 3 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Información Comercial
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12}}>
                  <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Condiciones Comerciales
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6}}>
                        <Controller
                          name="condicionPago"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={condicionesPago}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Condición de Pago"
                                  required
                                  error={!!errors.condicionPago}
                                  helperText={errors.condicionPago?.message}
                                />
                              )}
                              onChange={(_, value) => field.onChange(value || '')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Límite de Crédito"
                          {...register('limitCredito')}
                          size="small"
                          fullWidth
                          placeholder="50000"
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                S/.
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <TextField
                          label="Vendedor Asignado"
                          {...register('vendedorAsignado')}
                          size="small"
                          fullWidth
                          placeholder="Carlos Rodriguez"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6}}>
                        <Controller
                          name="canalVenta"
                          control={control}
                          rules={{ required: 'Campo requerido' }}
                          render={({ field }) => (
                            <Autocomplete
                              {...field}
                              options={canalesVenta}
                              size="small"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Canal de Venta"
                                  required
                                  error={!!errors.canalVenta}
                                  helperText={errors.canalVenta?.message}
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

                {/* Información adicional */}
                <Grid size={{ xs: 12}}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Información Adicional
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6}}>
                          <TextField
                            label="Sitio Web"
                            {...register('sitioWeb')}
                            size="small"
                            fullWidth
                            placeholder="https://www.empresa.com"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <GlobalIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12}}>
                          <TextField
                            label="Observaciones"
                            {...register('observaciones')}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Información adicional relevante sobre el cliente..."
                          />
                        </Grid>
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
                Revisa toda la información antes de guardar el registro del cliente.
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
                            primary="Tipo de Documento"
                            secondary={tiposDocumento.find(t => t.value === watch('tipoDocumento'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Número de Documento"
                            secondary={watch('nroDocumento')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Razón Social"
                            secondary={watch('razonSocial')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Nombre Cliente"
                            secondary={watch('nombreCliente')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tipo de Cliente"
                            secondary={tiposCliente.find(t => t.value === watch('tipoCliente'))?.label}
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
                            primary="Industria"
                            secondary={industrias.find(i => i.value === watch('industria'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sector"
                            secondary={sectores.find(s => s.value === watch('sector'))?.label}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="País"
                            secondary={watch('pais')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Zona"
                            secondary={watch('zona')}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen contacto */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'info.main' }}>
                        Información de Contacto
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Contacto Principal"
                            secondary={watch('contactoPrincipal')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Cargo"
                            secondary={watch('cargoContacto') || 'No especificado'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Teléfono"
                            secondary={watch('telefono')}
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
                            primary="Dirección"
                            secondary={`${watch('direccion')}, ${watch('distrito')} - ${watch('departamento')}`}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Resumen comercial */}
                <Grid size={{ xs: 12, md: 6}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                        Información Comercial
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Condición de Pago"
                            secondary={watch('condicionPago')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Límite de Crédito"
                            secondary={watch('limitCredito') ? `S/. ${watch('limitCredito')}` : 'No definido'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Vendedor Asignado"
                            secondary={watch('vendedorAsignado') || 'No asignado'}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Canal de Venta"
                            secondary={watch('canalVenta')}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Sitio Web"
                            secondary={watch('sitioWeb') || 'No especificado'}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Observaciones */}
                <Grid size={{ xs: 12}}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                        Observaciones
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {watch('observaciones') || 'Sin observaciones adicionales'}
                      </Typography>
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
                  Revisa la información antes de guardar el cliente
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
                    {loading ? 'Guardando...' : 'Guardar Cliente'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {/* Barra de progreso durante guardado */}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Procesando registro del cliente...
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
          Vista Previa del Cliente
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12}}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}>
                  <BusinessIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h6">{watch('razonSocial')}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watch('nroDocumento')} | {watch('nombreCliente')}
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
              <Typography variant="body2"><strong>Tipo:</strong> {tiposCliente.find(t => t.value === watch('tipoCliente'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Industria:</strong> {industrias.find(i => i.value === watch('industria'))?.label}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Contacto:</strong> {watch('contactoPrincipal')}</Typography>
            </Grid>
            <Grid size={{ xs: 6}} >
              <Typography variant="body2"><strong>Teléfono:</strong> {watch('telefono')}</Typography>
            </Grid>
            <Grid size={{ xs: 12}}>
              <Typography variant="body2"><strong>Email:</strong> {watch('email')}</Typography>
            </Grid>
            <Grid size={{ xs: 12}}>
              <Typography variant="body2"><strong>Dirección:</strong> {watch('direccion')}</Typography>
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

export default CreateClient;