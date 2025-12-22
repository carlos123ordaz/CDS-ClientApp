import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Toolbar,
  Stack,
  Card,
  CardContent,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaz para los datos del servicio
interface Service {
  id: string;
  codERP: string;
  marca: string;
  codComercial: string;
  unidad: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  medida: string;
  descripcion?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  fechaCreacion: Date;
  tipoServicio?: string;
  duracionEstimada?: number;
  precio?: number;
  categoria?: string;
  especialista?: string;
  requisitos?: string;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  clase: string;
  estado: string;
  tipoServicio: string;
}

// Interfaz para el formulario de servicio
interface ServiceForm {
  codERP: string;
  marca: string;
  codComercial: string;
  unidad: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  descripcion: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  tipoServicio: string;
  duracionEstimada: number;
  precio: number;
  categoria: string;
  especialista: string;
  requisitos: string;
  incluirDetallesAdicionales: boolean;
}

const ListServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      clase: '',
      estado: '',
      tipoServicio: '',
    }
  });

  const {
    register: registerService,
    control: controlService,
    handleSubmit: handleSubmitService,
    reset: resetService,
    watch: watchService,
    formState: { errors }
  } = useForm<ServiceForm>({
    defaultValues: {
      codERP: '',
      marca: 'Consusa',
      codComercial: '',
      unidad: 'UND',
      clase: '03-SRV',
      subClase: '',
      subSubClase: '',
      descripcion: '',
      estado: 'ACTIVO',
      tipoServicio: 'MANTENIMIENTO',
      duracionEstimada: 1,
      precio: 0,
      categoria: '',
      especialista: '',
      requisitos: '',
      incluirDetallesAdicionales: false,
    }
  });

  const searchTerm = watch('searchTerm');
  const claseFilter = watch('clase');
  const estadoFilter = watch('estado');
  const tipoServicioFilter = watch('tipoServicio');
  const incluirDetallesAdicionales = watchService('incluirDetallesAdicionales');

  // Datos mock para ejemplo
  const mockServices: Service[] = [
    {
      id: '1',
      codERP: 'SRV0005',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.P.marcha.UNAU',
      unidad: 'UND',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      descripcion: 'Servicio de electricidad directo para puesta en marcha de equipos automatizados',
      estado: 'ACTIVO',
      tipoServicio: 'INSTALACION',
      duracionEstimada: 8,
      precio: 350.00,
      categoria: 'Automatización',
      especialista: 'Ing. Eléctrico',
      fechaCreacion: new Date('2024-01-15'),
    },
    {
      id: '2',
      codERP: 'SRV0006',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.P.marcha.UNAI',
      unidad: 'UND',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      descripcion: 'Servicio de electricidad directo para puesta en marcha de equipos industriales',
      estado: 'ACTIVO',
      tipoServicio: 'MANTENIMIENTO',
      duracionEstimada: 4,
      precio: 280.00,
      categoria: 'Automatización Industrial',
      especialista: 'Técnico Especializado',
      fechaCreacion: new Date('2024-01-16'),
    },
    {
      id: '3',
      codERP: 'SRV0007',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.Calib-Contrast.Otros',
      unidad: 'UND',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      descripcion: 'Servicio de calibración y contraste de equipos diversos',
      estado: 'INACTIVO',
      tipoServicio: 'CALIBRACION',
      duracionEstimada: 2,
      precio: 450.00,
      categoria: 'Calibración',
      especialista: 'Especialista en Metrología',
      fechaCreacion: new Date('2024-01-17'),
    },
  ];

  useEffect(() => {
    handleGetServices();
  }, []);

  const handleGetServices = () => {
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setServices(mockServices);
      setFilteredServices(mockServices);
      setLoading(false);
    }, 1000);
  };

  // Filtrar servicios basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.codComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (claseFilter) {
      filtered = filtered.filter(service => service.clase === claseFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter(service => service.estado === estadoFilter);
    }

    if (tipoServicioFilter) {
      filtered = filtered.filter(service => service.tipoServicio === tipoServicioFilter);
    }

    setFilteredServices(filtered);
    setPage(0);
  }, [searchTerm, claseFilter, estadoFilter, tipoServicioFilter, services]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddService = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetService();
  };

  const onSubmitService = async (data: ServiceForm) => {
    setSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newService: Service = {
        id: String(Date.now()),
        codERP: data.codERP,
        marca: data.marca,
        codComercial: data.codComercial,
        unidad: data.unidad,
        clase: data.clase,
        subClase: data.subClase,
        subSubClase: data.subSubClase,
        medida: '',
        descripcion: data.descripcion,
        estado: data.estado,
        tipoServicio: data.tipoServicio,
        duracionEstimada: data.duracionEstimada,
        precio: data.precio,
        categoria: data.incluirDetallesAdicionales ? data.categoria : undefined,
        especialista: data.incluirDetallesAdicionales ? data.especialista : undefined,
        requisitos: data.incluirDetallesAdicionales ? data.requisitos : undefined,
        fechaCreacion: new Date(),
      };

      setServices(prev => [newService, ...prev]);
      setFilteredServices(prev => [newService, ...prev]);
      handleCloseModal();

      alert('Servicio creado exitosamente');
    } catch (error) {
      alert('Error al crear el servicio');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewService = (serviceId: string) => {
    console.log('Ver servicio:', serviceId);
  };

  const handleEditService = (serviceId: string) => {
    console.log('Editar servicio:', serviceId);
  };

  const handleDeleteService = (serviceId: string) => {
    console.log('Eliminar servicio:', serviceId);
  };

  const handleClearFilters = () => {
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'default';
      case 'SUSPENDIDO': return 'error';
      default: return 'default';
    }
  };

  const getTipoServicioColor = (tipo: string) => {
    switch (tipo) {
      case 'MANTENIMIENTO': return 'primary';
      case 'INSTALACION': return 'info';
      case 'CALIBRACION': return 'warning';
      case 'REPARACION': return 'error';
      case 'CONSULTORIA': return 'secondary';
      default: return 'default';
    }
  };

  // Opciones para filtros y formulario
  const clases = [
    { value: '03-SRV', label: '03-SRV - Servicios' },
    { value: '04-CON', label: '04-CON - Consultoría' },
    { value: '05-MAN', label: '05-MAN - Mantenimiento' },
  ];

  const subClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '03-SRV': [
      { value: '3A-MAN', label: '3A-MAN - Mantenimiento' },
      { value: '3B-AU', label: '3B-AU - Automatización' },
      { value: '3C-INS', label: '3C-INS - Instalación' },
    ],
    '04-CON': [
      { value: '4A-TEC', label: '4A-TEC - Técnica' },
      { value: '4B-GER', label: '4B-GER - Gerencial' },
    ],
    '05-MAN': [
      { value: '5A-PRE', label: '5A-PRE - Preventivo' },
      { value: '5B-COR', label: '5B-COR - Correctivo' },
    ],
  };

  const subSubClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '3A-MAN': [
      { value: '3A1-EQU', label: '3A1-EQU - Equipos' },
      { value: '3A2-SIS', label: '3A2-SIS - Sistemas' },
    ],
    '3B-AU': [
      { value: '3B1-PLC', label: '3B1-PLC - PLC' },
      { value: '3B2-HMI', label: '3B2-HMI - HMI' },
      { value: '3B3-AEJ', label: '3B3-AEJ - Automatización de Ejecución' },
    ],
  };

  const estados = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
  ];

  const tiposServicio = [
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
    { value: 'INSTALACION', label: 'Instalación' },
    { value: 'CALIBRACION', label: 'Calibración' },
    { value: 'REPARACION', label: 'Reparación' },
    { value: 'CONSULTORIA', label: 'Consultoría' },
  ];

  const unidades = [
    { value: 'UND', label: 'Unidad' },
    { value: 'HRS', label: 'Horas' },
    { value: 'DIA', label: 'Días' },
    { value: 'SEM', label: 'Semanas' },
  ];

  const categorias = [
    { value: 'Automatización', label: 'Automatización' },
    { value: 'Automatización Industrial', label: 'Automatización Industrial' },
    { value: 'Calibración', label: 'Calibración' },
    { value: 'Mantenimiento Preventivo', label: 'Mantenimiento Preventivo' },
    { value: 'Soporte Técnico', label: 'Soporte Técnico' },
  ];

  // Calcular estadísticas
  const serviciosActivos = filteredServices.filter(s => s.estado === 'ACTIVO').length;
  const valorPromedio = filteredServices.length > 0 ?
    filteredServices.reduce((sum, service) => sum + (service.precio || 0), 0) / filteredServices.length : 0;
  const tiempoPromedio = filteredServices.length > 0 ?
    filteredServices.reduce((sum, service) => sum + (service.duracionEstimada || 0), 0) / filteredServices.length : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <SettingsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{serviciosActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servicios Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <EngineeringIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${valorPromedio.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Precio Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CalendarIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {tiempoPromedio.toFixed(1)}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duración Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toolbar con búsqueda y filtros */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ px: 2, py: 2 }}>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
            <TextField
              {...register('searchTerm')}
              placeholder="Buscar por código ERP, marca, código comercial o descripción..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 350 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Clase</InputLabel>
              <Select
                {...register('clase')}
                label="Clase"
              >
                <MenuItem value="">Todas</MenuItem>
                {clases.map(clase => (
                  <MenuItem key={clase.value} value={clase.value}>
                    {clase.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tipo Servicio</InputLabel>
              <Select
                {...register('tipoServicio')}
                label="Tipo Servicio"
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposServicio.map(tipo => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                {...register('estado')}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {estados.map(estado => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Limpiar filtros">
              <IconButton onClick={handleClearFilters} size="small">
                <FilterIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Actualizar">
              <IconButton onClick={handleGetServices} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar">
              <IconButton size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddService}
              size="small"
            >
              Agregar Servicio
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Modal para agregar servicio */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Agregar Nuevo Servicio
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmitService(onSubmitService)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Información básica */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información Básica
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerService('codERP', {
                    required: 'El código ERP es requerido',
                    pattern: { value: /^SRV\d{4}$/, message: 'Formato: SRV0000' }
                  })}
                  label="Código ERP"
                  fullWidth
                  placeholder="SRV0000"
                  error={!!errors.codERP}
                  helperText={errors.codERP?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerService('marca', { required: 'La marca es requerida' })}
                  label="Marca"
                  fullWidth
                  error={!!errors.marca}
                  helperText={errors.marca?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerService('codComercial', { required: 'El código comercial es requerido' })}
                  label="Código Comercial"
                  fullWidth
                  error={!!errors.codComercial}
                  helperText={errors.codComercial?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerService('descripcion', { required: 'La descripción es requerida' })}
                  label="Descripción del Servicio"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                />
              </Grid>

              {/* Clasificación */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Clasificación
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Unidad</InputLabel>
                  <Controller
                    name="unidad"
                    control={controlService}
                    render={({ field }) => (
                      <Select {...field} label="Unidad">
                        {unidades.map(unidad => (
                          <MenuItem key={unidad.value} value={unidad.value}>
                            {unidad.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.clase}>
                  <InputLabel>Clase</InputLabel>
                  <Controller
                    name="clase"
                    control={controlService}
                    rules={{ required: 'La clase es requerida' }}
                    render={({ field }) => (
                      <Select {...field} label="Clase">
                        {clases.map(clase => (
                          <MenuItem key={clase.value} value={clase.value}>
                            {clase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.clase && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.clase.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Servicio</InputLabel>
                  <Controller
                    name="tipoServicio"
                    control={controlService}
                    render={({ field }) => (
                      <Select {...field} label="Tipo de Servicio">
                        {tiposServicio.map(tipo => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sub Clase</InputLabel>
                  <Controller
                    name="subClase"
                    control={controlService}
                    render={({ field }) => (
                      <Select {...field} label="Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subClasesMap[watchService('clase')] || []).map(subClase => (
                          <MenuItem key={subClase.value} value={subClase.value}>
                            {subClase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sub Sub Clase</InputLabel>
                  <Controller
                    name="subSubClase"
                    control={controlService}
                    render={({ field }) => (
                      <Select {...field} label="Sub Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subSubClasesMap[watchService('subClase')] || []).map(subSubClase => (
                          <MenuItem key={subSubClase.value} value={subSubClase.value}>
                            {subSubClase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Información comercial */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Información Comercial
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...registerService('precio', {
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  label="Precio"
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.01", min: 0 }}
                  error={!!errors.precio}
                  helperText={errors.precio?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  {...registerService('duracionEstimada', {
                    required: 'La duración es requerida',
                    min: { value: 0.5, message: 'La duración debe ser mayor a 0.5 horas' }
                  })}
                  label="Duración Estimada (Horas)"
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.5", min: 0.5 }}
                  error={!!errors.duracionEstimada}
                  helperText={errors.duracionEstimada?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Controller
                    name="estado"
                    control={controlService}
                    render={({ field }) => (
                      <Select {...field} label="Estado">
                        {estados.map(estado => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Detalles adicionales */}
              <Grid size={12}>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="incluirDetallesAdicionales"
                        control={controlService}
                        render={({ field }) => (
                          <Switch {...field} checked={field.value} />
                        )}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon fontSize="small" />
                        <Typography>Incluir detalles adicionales</Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>

              {incluirDetallesAdicionales && (
                <>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Detalles Adicionales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel>Categoría</InputLabel>
                      <Controller
                        name="categoria"
                        control={controlService}
                        render={({ field }) => (
                          <Select {...field} label="Categoría">
                            {categorias.map(categoria => (
                              <MenuItem key={categoria.value} value={categoria.value}>
                                {categoria.label}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerService('especialista')}
                      label="Especialista Requerido"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...registerService('requisitos')}
                      label="Requisitos del Servicio"
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Describa los requisitos, herramientas o condiciones necesarias para el servicio..."
                    />
                  </Grid>
                </>
              )}

              {/* Información adicional */}
              <Grid size={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> Una vez creado el servicio, se generará automáticamente la fecha de creación
                    y estará disponible para su gestión en el sistema.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? undefined : <SaveIcon />}
            >
              {submitting ? 'Guardando...' : 'Guardar Servicio'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="tabla de servicios">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clasificación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duración</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((service) => (
                <TableRow
                  key={service.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BuildIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                        {service.codERP}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={service.marca} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography variant="body2" noWrap title={service.codComercial} sx={{ fontFamily: 'monospace' }}>
                      {service.codComercial}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={service.descripcion}>
                      {service.descripcion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.tipoServicio}
                      size="small"
                      variant="outlined"
                      color={getTipoServicioColor(service.tipoServicio || '') as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Chip label={service.clase} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {service.subClase} → {service.subSubClase}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {service.duracionEstimada}h
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      ${(service.precio || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={service.estado}
                      color={getStatusColor(service.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewService(service.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditService(service.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteService(service.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron servicios que coincidan con los filtros
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredServices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
      />
    </Box>
  );
};

export default ListServices;