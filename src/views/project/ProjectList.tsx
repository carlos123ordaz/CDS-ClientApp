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
  LinearProgress,
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
  Engineering as ProjectIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CompleteIcon,
  PlayArrow as ActiveIcon,
  Pause as PausedIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaz para los datos del proyecto
interface Project {
  id: string;
  codERP: string;
  marca: string;
  codComercial: string;
  unidadMedida: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  nombreProyecto: string;
  cliente: string;
  fechaInicio: Date;
  fechaFin?: Date;
  presupuesto: number;
  progreso: number;
  estado: 'PLANIFICACION' | 'EN_PROGRESO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  responsable: string;
  descripcion: string;
  tipoProyecto?: string;
  prioridad?: string;
  ubicacion?: string;
  equipoTrabajo?: string;
  riesgos?: string;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  marca: string;
  clase: string;
  estado: string;
  responsable: string;
}

// Interfaz para el formulario de proyecto
interface ProjectForm {
  codERP: string;
  marca: string;
  codComercial: string;
  unidadMedida: string;
  clase: string;
  subClase: string;
  subSubClase: string;
  nombreProyecto: string;
  cliente: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  estado: 'PLANIFICACION' | 'EN_PROGRESO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  responsable: string;
  descripcion: string;
  tipoProyecto: string;
  prioridad: string;
  ubicacion: string;
  equipoTrabajo: string;
  riesgos: string;
  incluirDetallesAdicionales: boolean;
}

const ListProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      marca: '',
      clase: '',
      estado: '',
      responsable: '',
    }
  });

  const {
    register: registerProject,
    control: controlProject,
    handleSubmit: handleSubmitProject,
    reset: resetProject,
    watch: watchProject,
    formState: { errors }
  } = useForm<ProjectForm>({
    defaultValues: {
      codERP: '',
      marca: 'Consusa',
      codComercial: '',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '',
      subSubClase: '',
      nombreProyecto: '',
      cliente: '',
      fechaInicio: '',
      fechaFin: '',
      presupuesto: 0,
      estado: 'PLANIFICACION',
      responsable: '',
      descripcion: '',
      tipoProyecto: 'CONSULTORIA',
      prioridad: 'MEDIA',
      ubicacion: '',
      equipoTrabajo: '',
      riesgos: '',
      incluirDetallesAdicionales: false,
    }
  });

  const searchTerm = watch('searchTerm');
  const marcaFilter = watch('marca');
  const claseFilter = watch('clase');
  const estadoFilter = watch('estado');
  const responsableFilter = watch('responsable');
  const incluirDetallesAdicionales = watchProject('incluirDetallesAdicionales');

  // Datos mock para ejemplo
  const mockProjects: Project[] = [
    {
      id: '1',
      codERP: 'PRY0001',
      marca: 'Consusa',
      codComercial: 'Proy.PTC.Consultoria.Otros',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3A-CONS',
      subSubClase: '3A1-TEC',
      nombreProyecto: 'Consultoría Técnica - Sistema de Control',
      cliente: 'Minera Las Bambas',
      fechaInicio: new Date('2024-01-15'),
      fechaFin: new Date('2024-04-15'),
      presupuesto: 150000,
      progreso: 75,
      estado: 'EN_PROGRESO',
      responsable: 'Carlos Rodriguez',
      descripcion: 'Consultoría técnica para implementación de sistema de control automatizado',
      tipoProyecto: 'CONSULTORIA',
      prioridad: 'ALTA',
    },
    {
      id: '2',
      codERP: 'PRY0002',
      marca: 'Consusa',
      codComercial: 'Proy.Servicio.Ejec.Directa',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3B-EJEC',
      subSubClase: '3B1-DIR',
      nombreProyecto: 'Ejecución Directa - Instalación de Equipos',
      cliente: 'Antamina S.A.',
      fechaInicio: new Date('2024-02-01'),
      fechaFin: new Date('2024-06-30'),
      presupuesto: 250000,
      progreso: 45,
      estado: 'EN_PROGRESO',
      responsable: 'Maria Gonzales',
      descripcion: 'Proyecto de instalación y puesta en marcha de equipos de instrumentación',
      tipoProyecto: 'INSTALACION',
      prioridad: 'MEDIA',
    },
    {
      id: '3',
      codERP: 'PRY0003',
      marca: 'Consusa',
      codComercial: 'Proy.PTC.Material.Mecanicos',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3C-MAT',
      subSubClase: '3C1-MEC',
      nombreProyecto: 'Suministro de Materiales Mecánicos',
      cliente: 'Cerro Verde S.A.',
      fechaInicio: new Date('2023-11-01'),
      fechaFin: new Date('2024-01-31'),
      presupuesto: 80000,
      progreso: 100,
      estado: 'COMPLETADO',
      responsable: 'Luis Torres',
      descripcion: 'Suministro e instalación de componentes mecánicos para planta concentradora',
      tipoProyecto: 'SUMINISTRO',
      prioridad: 'BAJA',
    },
  ];

  useEffect(() => {
    handleGetProjects();
  }, []);

  const handleGetProjects = () => {
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    }, 1000);
  };

  // Filtrar proyectos basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.codComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.responsable.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (marcaFilter) {
      filtered = filtered.filter(project => project.marca === marcaFilter);
    }

    if (claseFilter) {
      filtered = filtered.filter(project => project.clase === claseFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter(project => project.estado === estadoFilter);
    }

    if (responsableFilter) {
      filtered = filtered.filter(project =>
        project.responsable.toLowerCase().includes(responsableFilter.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
    setPage(0);
  }, [searchTerm, marcaFilter, claseFilter, estadoFilter, responsableFilter, projects]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProject = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetProject();
  };

  const onSubmitProject = async (data: ProjectForm) => {
    setSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newProject: Project = {
        id: String(Date.now()),
        codERP: data.codERP,
        marca: data.marca,
        codComercial: data.codComercial,
        unidadMedida: data.unidadMedida,
        clase: data.clase,
        subClase: data.subClase,
        subSubClase: data.subSubClase,
        nombreProyecto: data.nombreProyecto,
        cliente: data.cliente,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: data.fechaFin ? new Date(data.fechaFin) : undefined,
        presupuesto: data.presupuesto,
        progreso: 0,
        estado: data.estado,
        responsable: data.responsable,
        descripcion: data.descripcion,
        tipoProyecto: data.tipoProyecto,
        prioridad: data.incluirDetallesAdicionales ? data.prioridad : undefined,
        ubicacion: data.incluirDetallesAdicionales ? data.ubicacion : undefined,
        equipoTrabajo: data.incluirDetallesAdicionales ? data.equipoTrabajo : undefined,
        riesgos: data.incluirDetallesAdicionales ? data.riesgos : undefined,
      };

      setProjects(prev => [newProject, ...prev]);
      setFilteredProjects(prev => [newProject, ...prev]);
      handleCloseModal();

      alert('Proyecto creado exitosamente');
    } catch (error) {
      alert('Error al crear el proyecto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (projectId: string) => {
    console.log('Editar proyecto:', projectId);
  };

  const handleViewProject = (projectId: string) => {
    console.log('Ver proyecto:', projectId);
  };

  const handleDeleteProject = (projectId: string) => {
    console.log('Eliminar proyecto:', projectId);
  };

  const handleClearFilters = () => {
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANIFICACION': return 'info';
      case 'EN_PROGRESO': return 'success';
      case 'PAUSADO': return 'warning';
      case 'COMPLETADO': return 'primary';
      case 'CANCELADO': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLANIFICACION': return <ScheduleIcon fontSize="small" />;
      case 'EN_PROGRESO': return <ActiveIcon fontSize="small" />;
      case 'PAUSADO': return <PausedIcon fontSize="small" />;
      case 'COMPLETADO': return <CompleteIcon fontSize="small" />;
      case 'CANCELADO': return <DeleteIcon fontSize="small" />;
      default: return <AssignmentIcon fontSize="small" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': return 'error';
      case 'MEDIA': return 'warning';
      case 'BAJA': return 'success';
      default: return 'default';
    }
  };

  // Opciones para filtros y formulario
  const marcas = Array.from(new Set(projects.map(p => p.marca))).map(marca => ({ value: marca, label: marca }));

  const clases = [
    { value: '03-PROY', label: '03-PROY - Proyectos' },
    { value: '04-CONS', label: '04-CONS - Consultoría' },
    { value: '05-SERV', label: '05-SERV - Servicios Especiales' },
  ];

  const subClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '03-PROY': [
      { value: '3A-CONS', label: '3A-CONS - Consultoría' },
      { value: '3B-EJEC', label: '3B-EJEC - Ejecución' },
      { value: '3C-MAT', label: '3C-MAT - Materiales' },
      { value: '3D-MANT', label: '3D-MANT - Mantenimiento' },
      { value: '3E-MOD', label: '3E-MOD - Modernización' },
      { value: '3F-CAP', label: '3F-CAP - Capacitación' },
    ],
    '04-CONS': [
      { value: '4A-TEC', label: '4A-TEC - Técnica' },
      { value: '4B-GER', label: '4B-GER - Gerencial' },
    ],
    '05-SERV': [
      { value: '5A-ESP', label: '5A-ESP - Especializado' },
      { value: '5B-GEN', label: '5B-GEN - General' },
    ],
  };

  const subSubClasesMap: Record<string, Array<{ value: string; label: string }>> = {
    '3A-CONS': [
      { value: '3A1-TEC', label: '3A1-TEC - Técnica' },
      { value: '3A2-GER', label: '3A2-GER - Gerencial' },
    ],
    '3B-EJEC': [
      { value: '3B1-DIR', label: '3B1-DIR - Directa' },
      { value: '3B2-SUP', label: '3B2-SUP - Supervisión' },
    ],
  };

  const estadosProyecto = [
    { value: 'PLANIFICACION', label: 'Planificación' },
    { value: 'EN_PROGRESO', label: 'En Progreso' },
    { value: 'PAUSADO', label: 'Pausado' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'CANCELADO', label: 'Cancelado' },
  ];

  const tiposProyecto = [
    { value: 'CONSULTORIA', label: 'Consultoría' },
    { value: 'INSTALACION', label: 'Instalación' },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
    { value: 'SUMINISTRO', label: 'Suministro' },
    { value: 'MODERNIZACION', label: 'Modernización' },
    { value: 'CAPACITACION', label: 'Capacitación' },
  ];

  const prioridades = [
    { value: 'ALTA', label: 'Alta' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'BAJA', label: 'Baja' },
  ];

  const unidadesMedida = [
    { value: 'UND', label: 'Unidad' },
    { value: 'PROY', label: 'Proyecto' },
    { value: 'FASE', label: 'Fase' },
  ];

  const responsables = Array.from(new Set(projects.map(p => p.responsable))).map(resp => ({ value: resp, label: resp }));

  // Calcular estadísticas
  const proyectosActivos = filteredProjects.filter(p => p.estado === 'EN_PROGRESO').length;
  const presupuestoTotal = filteredProjects.reduce((sum, project) => sum + project.presupuesto, 0);
  const progresoPromedio = filteredProjects.length > 0 ?
    Math.round(filteredProjects.reduce((sum, project) => sum + project.progreso, 0) / filteredProjects.length) : 0;
  const proyectosCompletados = filteredProjects.filter(p => p.estado === 'COMPLETADO').length;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ActiveIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{proyectosActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Proyectos Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${(presupuestoTotal / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Presupuesto Total
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{progresoPromedio}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Progreso Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3, sm: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <CompleteIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{proyectosCompletados}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completados
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
              placeholder="Buscar por código ERP, nombre de proyecto, cliente o responsable..."
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

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Marca</InputLabel>
              <Select
                {...register('marca')}
                label="Marca"
              >
                <MenuItem value="">Todas</MenuItem>
                {marcas.map(marca => (
                  <MenuItem key={marca.value} value={marca.value}>
                    {marca.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                {...register('estado')}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {estadosProyecto.map(estado => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Responsable</InputLabel>
              <Select
                {...register('responsable')}
                label="Responsable"
              >
                <MenuItem value="">Todos</MenuItem>
                {responsables.map(resp => (
                  <MenuItem key={resp.value} value={resp.value}>
                    {resp.label}
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
              <IconButton onClick={handleGetProjects} size="small">
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
              onClick={handleAddProject}
              size="small"
            >
              Agregar Proyecto
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Modal para agregar proyecto */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Agregar Nuevo Proyecto
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmitProject(onSubmitProject)}>
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
                  {...registerProject('codERP', {
                    required: 'El código ERP es requerido',
                    pattern: { value: /^PRY\d{4}$/, message: 'Formato: PRY0000' }
                  })}
                  label="Código ERP"
                  fullWidth
                  placeholder="PRY0000"
                  error={!!errors.codERP}
                  helperText={errors.codERP?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerProject('marca', { required: 'La marca es requerida' })}
                  label="Marca"
                  fullWidth
                  error={!!errors.marca}
                  helperText={errors.marca?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerProject('codComercial', { required: 'El código comercial es requerido' })}
                  label="Código Comercial"
                  fullWidth
                  error={!!errors.codComercial}
                  helperText={errors.codComercial?.message}
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
                  <InputLabel>Unidad de Medida</InputLabel>
                  <Controller
                    name="unidadMedida"
                    control={controlProject}
                    render={({ field }) => (
                      <Select {...field} label="Unidad de Medida">
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

              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth error={!!errors.clase}>
                  <InputLabel>Clase</InputLabel>
                  <Controller
                    name="clase"
                    control={controlProject}
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
                  <InputLabel>Estado</InputLabel>
                  <Controller
                    name="estado"
                    control={controlProject}
                    render={({ field }) => (
                      <Select {...field} label="Estado">
                        {estadosProyecto.map(estado => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
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
                    control={controlProject}
                    render={({ field }) => (
                      <Select {...field} label="Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subClasesMap[watchProject('clase')] || []).map(subClase => (
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
                    control={controlProject}
                    render={({ field }) => (
                      <Select {...field} label="Sub Sub Clase">
                        <MenuItem value="">Seleccionar</MenuItem>
                        {(subSubClasesMap[watchProject('subClase')] || []).map(subSubClase => (
                          <MenuItem key={subSubClase.value} value={subSubClase.value}>
                            {subSubClase.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Información adicional */}
              <Grid size={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> Una vez creado el proyecto, se establecerá el progreso inicial en 0%
                    y estará disponible para su gestión y seguimiento en el sistema.
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
              {submitting ? 'Guardando...' : 'Guardar Proyecto'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1600 }} aria-label="tabla de proyectos">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unidad de medida</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clase</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sub-Clase</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sub_Sub-Clase</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow
                  key={project.id}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ProjectIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                        {project.codERP}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={project.codComercial} sx={{ fontFamily: 'monospace' }}>
                      {project.marca}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>123</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={project.codComercial} sx={{ fontFamily: 'monospace' }}>
                      {project.codComercial}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>123</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>123</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 100 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>123</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(project.estado)}
                      label={project.estado.replace('_', ' ')}
                      color={getStatusColor(project.estado) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditProject(project.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProject(project.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron proyectos que coincidan con los filtros
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
        count={filteredProjects.length}
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

export default ListProjects;