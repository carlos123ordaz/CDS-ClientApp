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
  Breadcrumbs,
  Link,
  Grid,
  LinearProgress,
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
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

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
  // Información adicional específica de proyectos
  nombreProyecto: string;
  cliente: string;
  fechaInicio: Date;
  fechaFin?: Date;
  presupuesto: number;
  progreso: number;
  estado: 'PLANIFICACION' | 'EN_PROGRESO' | 'PAUSADO' | 'COMPLETADO' | 'CANCELADO';
  responsable: string;
  descripcion: string;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  marca: string;
  clase: string;
  estado: string;
  responsable: string;
}

const ListProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      marca: '',
      clase: '',
      estado: '',
      responsable: '',
    }
  });

  const searchTerm = watch('searchTerm');
  const marcaFilter = watch('marca');
  const claseFilter = watch('clase');
  const estadoFilter = watch('estado');
  const responsableFilter = watch('responsable');

  // Datos de ejemplo basados en la imagen
  const mockProjects: Project[] = [
    {
      id: '1',
      codERP: 'SRV0005',
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
    },
    {
      id: '2',
      codERP: 'SRV0005',
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
    },
    {
      id: '3',
      codERP: 'SRV0005',
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
    },
    {
      id: '4',
      codERP: 'SRV0006',
      marca: 'Consusa',
      codComercial: 'Proy.Mantenimiento.Preventivo',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3D-MANT',
      subSubClase: '3D1-PREV',
      nombreProyecto: 'Mantenimiento Preventivo Anual',
      cliente: 'Southern Copper',
      fechaInicio: new Date('2024-03-01'),
      fechaFin: new Date('2024-12-31'),
      presupuesto: 120000,
      progreso: 25,
      estado: 'EN_PROGRESO',
      responsable: 'Ana Silva',
      descripcion: 'Programa anual de mantenimiento preventivo para equipos críticos',
    },
    {
      id: '5',
      codERP: 'SRV0007',
      marca: 'Consusa',
      codComercial: 'Proy.Modernizacion.Control',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3E-MOD',
      subSubClase: '3E1-CTRL',
      nombreProyecto: 'Modernización Sistema de Control',
      cliente: 'Buenaventura',
      fechaInicio: new Date('2024-05-01'),
      fechaFin: new Date('2024-10-31'),
      presupuesto: 300000,
      progreso: 10,
      estado: 'PLANIFICACION',
      responsable: 'Roberto Silva',
      descripcion: 'Actualización completa del sistema de control de planta',
    },
    {
      id: '6',
      codERP: 'SRV0008',
      marca: 'Consusa',
      codComercial: 'Proy.Capacitacion.Personal',
      unidadMedida: 'UND',
      clase: '03-PROY',
      subClase: '3F-CAP',
      subSubClase: '3F1-TEC',
      nombreProyecto: 'Capacitación Técnica Especializada',
      cliente: 'Volcan Compañía Minera',
      fechaInicio: new Date('2024-01-10'),
      fechaFin: new Date('2024-03-10'),
      presupuesto: 45000,
      progreso: 90,
      estado: 'PAUSADO',
      responsable: 'Patricia Mendoza',
      descripcion: 'Programa de capacitación técnica para operadores de planta',
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar proyectos basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.codComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.nombreProyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.cliente.toLowerCase().includes(searchTerm.toLowerCase())
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
    navigate('/project-create');
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

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  // Opciones para filtros
  const marcas = Array.from(new Set(projects.map(p => p.marca))).map(marca => ({ value: marca, label: marca }));

  const clases = [
    { value: '03-PROY', label: '03-PROY - Proyectos' },
    { value: '04-CONS', label: '04-CONS - Consultoría' },
    { value: '05-SERV', label: '05-SERV - Servicios Especiales' },
  ];

  const estadosProyecto = [
    { value: 'PLANIFICACION', label: 'Planificación' },
    { value: 'EN_PROGRESO', label: 'En Progreso' },
    { value: 'PAUSADO', label: 'Pausado' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'CANCELADO', label: 'Cancelado' },
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
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Gestión de Proyectos
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {filteredProjects.length} proyecto(s) registrado(s)
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
        </CardContent>
      </Card>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3, sm: 6}}>
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
        <Grid size={{ xs: 12, md: 3, sm: 6}}>
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
        <Grid size={{ xs: 12, md: 3, sm: 6}}>
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
        <Grid size={{ xs: 12, md: 3, sm: 6}}>
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
              placeholder="Buscar por código ERP, nombre de proyecto o cliente..."
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
              <IconButton onClick={handleRefresh} size="small">
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
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              }}
            >
              Agregar Proyecto
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1600 }} aria-label="tabla de proyectos">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proyecto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clasificación</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Progreso</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Presupuesto</TableCell>
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
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                      {project.codERP}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={project.marca} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={project.codComercial} sx={{ fontFamily: 'monospace' }}>
                      {project.codComercial}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }} noWrap title={project.nombreProyecto}>
                        {project.nombreProyecto}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.responsable}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <BusinessIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {project.cliente}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Chip label={project.clase} size="small" variant="outlined" />
                      <Typography variant="caption" color="text.secondary">
                        {project.subClase} → {project.subSubClase}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ minWidth: 100 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {project.progreso}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.progreso}
                        color={getProgressColor(project.progreso) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        ${project.presupuesto.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        USD
                      </Typography>
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