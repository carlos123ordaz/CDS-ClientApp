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
  Grid,
  Link,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  SupportAgent as SalesIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  TrendingUp as PerformanceIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

// Interfaz para los datos del vendedor
interface Seller {
  id: string;
  tipoDocumento: 'DNI' | 'CE' | 'PASSPORT';
  nroDocumento: string;
  vendedor: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'VACACIONES';
  // Información adicional
  email?: string;
  telefono?: string;
  fechaIngreso?: Date;
  zona?: string;
  metaMensual?: number;
  ventasActuales?: number;
  clientesAsignados?: number;
  comision?: number;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  tipoDocumento: string;
  estado: string;
  zona: string;
}

const ListSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      tipoDocumento: '',
      estado: '',
      zona: '',
    }
  });

  const searchTerm = watch('searchTerm');
  const tipoDocumentoFilter = watch('tipoDocumento');
  const estadoFilter = watch('estado');
  const zonaFilter = watch('zona');

  // Datos de ejemplo
  const mockSellers: Seller[] = [
    {
      id: '1',
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      vendedor: 'Carlos Rodriguez Martinez',
      estado: 'ACTIVO',
      email: 'carlos.rodriguez@empresa.com',
      telefono: '+51 987654321',
      fechaIngreso: new Date('2020-01-15'),
      zona: 'Norte',
      metaMensual: 50000,
      ventasActuales: 45000,
      clientesAsignados: 25,
      comision: 3.5,
    },
    {
      id: '2',
      tipoDocumento: 'DNI',
      nroDocumento: '87654321',
      vendedor: 'Maria Elena Gonzales',
      estado: 'ACTIVO',
      email: 'maria.gonzales@empresa.com',
      telefono: '+51 987654322',
      fechaIngreso: new Date('2019-03-22'),
      zona: 'Centro',
      metaMensual: 60000,
      ventasActuales: 58000,
      clientesAsignados: 30,
      comision: 4.0,
    },
    {
      id: '3',
      tipoDocumento: 'CE',
      nroDocumento: '001234567',
      vendedor: 'Juan Carlos Perez',
      estado: 'VACACIONES',
      email: 'juan.perez@empresa.com',
      telefono: '+51 987654323',
      fechaIngreso: new Date('2021-06-10'),
      zona: 'Sur',
      metaMensual: 40000,
      ventasActuales: 35000,
      clientesAsignados: 20,
      comision: 3.0,
    },
    {
      id: '4',
      tipoDocumento: 'DNI',
      nroDocumento: '11223344',
      vendedor: 'Ana Sofia Mendoza',
      estado: 'ACTIVO',
      email: 'ana.mendoza@empresa.com',
      telefono: '+51 987654324',
      fechaIngreso: new Date('2018-11-05'),
      zona: 'Centro',
      metaMensual: 55000,
      ventasActuales: 52000,
      clientesAsignados: 28,
      comision: 3.8,
    },
    {
      id: '5',
      tipoDocumento: 'DNI',
      nroDocumento: '99887766',
      vendedor: 'Roberto Silva Castro',
      estado: 'SUSPENDIDO',
      email: 'roberto.silva@empresa.com',
      telefono: '+51 987654325',
      fechaIngreso: new Date('2022-02-28'),
      zona: 'Norte',
      metaMensual: 45000,
      ventasActuales: 30000,
      clientesAsignados: 15,
      comision: 2.5,
    },
    {
      id: '6',
      tipoDocumento: 'PASSPORT',
      nroDocumento: 'AB1234567',
      vendedor: 'Luis Fernando Torres',
      estado: 'ACTIVO',
      email: 'luis.torres@empresa.com',
      telefono: '+51 987654326',
      fechaIngreso: new Date('2020-07-14'),
      zona: 'Sur',
      metaMensual: 48000,
      ventasActuales: 46000,
      clientesAsignados: 22,
      comision: 3.2,
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setSellers(mockSellers);
      setFilteredSellers(mockSellers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar vendedores basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = sellers;

    if (searchTerm) {
      filtered = filtered.filter((seller) =>
        seller.nroDocumento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.vendedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoDocumentoFilter) {
      filtered = filtered.filter(seller => seller.tipoDocumento === tipoDocumentoFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter(seller => seller.estado === estadoFilter);
    }

    if (zonaFilter) {
      filtered = filtered.filter(seller => seller.zona === zonaFilter);
    }

    setFilteredSellers(filtered);
    setPage(0);
  }, [searchTerm, tipoDocumentoFilter, estadoFilter, zonaFilter, sellers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddSeller = () => {
   navigate('/vendor-create')
  };

  const handleEditSeller = (sellerId: string) => {
    console.log('Editar vendedor:', sellerId);
  };

  const handleViewSeller = (sellerId: string) => {
    console.log('Ver vendedor:', sellerId);
  };

  const handleDeleteSeller = (sellerId: string) => {
    console.log('Eliminar vendedor:', sellerId);
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
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'default';
      case 'SUSPENDIDO': return 'error';
      case 'VACACIONES': return 'warning';
      default: return 'default';
    }
  };

  const getPerformanceColor = (actual: number, meta: number) => {
    const porcentaje = (actual / meta) * 100;
    if (porcentaje >= 90) return 'success';
    if (porcentaje >= 70) return 'warning';
    return 'error';
  };

  const calculatePerformance = (actual: number, meta: number) => {
    return Math.round((actual / meta) * 100);
  };

  // Opciones para filtros
  const tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASSPORT', label: 'Pasaporte' },
  ];

  const estadosVendedor = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
    { value: 'VACACIONES', label: 'Vacaciones' },
  ];

  const zonas = [
    { value: 'Norte', label: 'Norte' },
    { value: 'Centro', label: 'Centro' },
    { value: 'Sur', label: 'Sur' },
    { value: 'Oriente', label: 'Oriente' },
  ];

  // Calcular estadísticas
  const vendedoresActivos = filteredSellers.filter(s => s.estado === 'ACTIVO').length;
  const metaTotal = filteredSellers.reduce((sum, seller) => sum + (seller.metaMensual || 0), 0);
  const ventasTotal = filteredSellers.reduce((sum, seller) => sum + (seller.ventasActuales || 0), 0);
  const rendimientoPromedio = metaTotal > 0 ? Math.round((ventasTotal / metaTotal) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
    

      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Gestión de Vendedores
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {filteredSellers.length} vendedor(es) registrado(s)
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
                <SalesIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Cards de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid sx={{ mb: 3, xs:12, sm:6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <SalesIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{vendedoresActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vendedores Activos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ mb: 3, xs:12, sm:6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <PerformanceIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{rendimientoPromedio}%</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rendimiento Promedio
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ mb: 3, xs:12, sm:6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    S/. {(ventasTotal / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas Actuales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ mb: 3, xs:12, sm:6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    S/. {(metaTotal / 1000).toFixed(0)}K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meta Total
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
              placeholder="Buscar por documento, nombre o email..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tipo Doc.</InputLabel>
              <Select
                {...register('tipoDocumento')}
                label="Tipo Doc."
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposDocumento.map(tipo => (
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
                {estadosVendedor.map(estado => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Zona</InputLabel>
              <Select
                {...register('zona')}
                label="Zona"
              >
                <MenuItem value="">Todas</MenuItem>
                {zonas.map(zona => (
                  <MenuItem key={zona.value} value={zona.value}>
                    {zona.label}
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
              onClick={handleAddSeller}
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              }}
            >
              Agregar Vendedor
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="tabla de vendedores">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Doc.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nro. Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vendedor</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zona</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contacto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clientes</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rendimiento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSellers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((seller) => (
                <TableRow
                  key={seller.id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Chip label={seller.tipoDocumento} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                    {seller.nroDocumento}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {seller.vendedor.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {seller.vendedor}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Desde {seller.fechaIngreso?.toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={seller.zona} size="small" variant="filled" />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="caption">{seller.telefono}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="caption">{seller.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Badge badgeContent={seller.clientesAsignados} color="primary">
                      <AssignmentIcon color="action" />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={`${calculatePerformance(seller.ventasActuales || 0, seller.metaMensual || 1)}%`}
                          color={getPerformanceColor(seller.ventasActuales || 0, seller.metaMensual || 1) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        S/. {(seller.ventasActuales || 0).toLocaleString()} / S/. {(seller.metaMensual || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={seller.estado}
                      color={getStatusColor(seller.estado) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewSeller(seller.id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditSeller(seller.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSeller(seller.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredSellers.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron vendedores que coincidan con los filtros
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
        count={filteredSellers.length}
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

export default ListSellers;