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
  CircularProgress,
  Snackbar,
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  SupportAgent as SalesIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Interfaz para los datos del vendedor
interface Seller {
  id: string;
  tipoDocumento: 'DNI' | 'CE' | 'PASSPORT';
  nroDocumento: string;
  nombres: string;
  apellidos: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO' | 'VACACIONES';
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  genero?: 'M' | 'F';
}

// Interfaz para el formulario de nuevo vendedor
interface NewSellerForm {
  tipoDocumento: string;
  nroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaNacimiento: string;
  genero: string;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  tipoDocumento: string;
  estado: string;
}

const ListSellers: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<NewSellerForm>({
    tipoDocumento: '',
    nroDocumento: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: '',
    genero: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<NewSellerForm>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [searchFilters, setSearchFilters] = useState<SearchForm>({
    searchTerm: '',
    tipoDocumento: '',
    estado: ''
  });

  // Datos de ejemplo
  const mockSellers: Seller[] = [
    {
      id: '1',
      tipoDocumento: 'DNI',
      nroDocumento: '12345678',
      nombres: 'Carlos Rodriguez',
      apellidos: 'Martinez',
      estado: 'ACTIVO',
      email: 'carlos.rodriguez@empresa.com',
      telefono: '+51 987654321',
      direccion: 'Av. Los Olivos 123, Lima',
      fechaNacimiento: new Date('1985-03-15'),
      genero: 'M'
    },
    {
      id: '2',
      tipoDocumento: 'DNI',
      nroDocumento: '87654321',
      nombres: 'Maria Elena',
      apellidos: 'Gonzales',
      estado: 'ACTIVO',
      email: 'maria.gonzales@empresa.com',
      telefono: '+51 987654322',
      direccion: 'Jr. Huancayo 456, Lima',
      fechaNacimiento: new Date('1990-07-22'),
      genero: 'F'
    },
    {
      id: '3',
      tipoDocumento: 'CE',
      nroDocumento: '001234567',
      nombres: 'Juan Carlos',
      apellidos: 'Perez',
      estado: 'VACACIONES',
      email: 'juan.perez@empresa.com',
      telefono: '+51 987654323',
      direccion: 'Calle Las Flores 789, Lima',
      fechaNacimiento: new Date('1988-12-10'),
      genero: 'M'
    },
    {
      id: '4',
      tipoDocumento: 'DNI',
      nroDocumento: '11223344',
      nombres: 'Ana Sofia',
      apellidos: 'Mendoza',
      estado: 'ACTIVO',
      email: 'ana.mendoza@empresa.com',
      telefono: '+51 987654324',
      direccion: 'Av. Universitaria 321, Lima',
      fechaNacimiento: new Date('1992-11-05'),
      genero: 'F'
    },
    {
      id: '5',
      tipoDocumento: 'DNI',
      nroDocumento: '99887766',
      nombres: 'Roberto Silva',
      apellidos: 'Castro',
      estado: 'SUSPENDIDO',
      email: 'roberto.silva@empresa.com',
      telefono: '+51 987654325',
      direccion: 'Jr. Tacna 654, Lima',
      fechaNacimiento: new Date('1987-02-28'),
      genero: 'M'
    },
    {
      id: '6',
      tipoDocumento: 'PASSPORT',
      nroDocumento: 'AB1234567',
      nombres: 'Luis Fernando',
      apellidos: 'Torres',
      estado: 'ACTIVO',
      email: 'luis.torres@empresa.com',
      telefono: '+51 987654326',
      direccion: 'Av. Brasil 987, Lima',
      fechaNacimiento: new Date('1989-07-14'),
      genero: 'M'
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setSellers(mockSellers);
      setFilteredSellers(mockSellers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar vendedores
  useEffect(() => {
    let filtered = sellers;

    if (searchFilters.searchTerm) {
      filtered = filtered.filter((seller) =>
        seller.nroDocumento.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        seller.nombres.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        seller.apellidos.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        seller.email?.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
      );
    }

    if (searchFilters.tipoDocumento) {
      filtered = filtered.filter(seller => seller.tipoDocumento === searchFilters.tipoDocumento);
    }

    if (searchFilters.estado) {
      filtered = filtered.filter(seller => seller.estado === searchFilters.estado);
    }

    setFilteredSellers(filtered);
    setPage(0);
  }, [searchFilters, sellers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (field: keyof SearchForm, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSeller = () => {
    setOpenModal(true);
    setFormData({
      tipoDocumento: '',
      nroDocumento: '',
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      direccion: '',
      fechaNacimiento: '',
      genero: ''
    });
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (field: keyof NewSellerForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: Partial<NewSellerForm> = {};

    if (!formData.tipoDocumento) errors.tipoDocumento = 'Requerido';
    if (!formData.nroDocumento) errors.nroDocumento = 'Requerido';
    if (!formData.nombres) errors.nombres = 'Requerido';
    if (!formData.apellidos) errors.apellidos = 'Requerido';
    if (!formData.email) errors.email = 'Requerido';
    if (!formData.telefono) errors.telefono = 'Requerido';
    if (!formData.fechaNacimiento) errors.fechaNacimiento = 'Requerido';
    if (!formData.genero) errors.genero = 'Requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true);

      // Simular guardado
      setTimeout(() => {
        const newSeller: Seller = {
          id: Date.now().toString(),
          tipoDocumento: formData.tipoDocumento as any,
          nroDocumento: formData.nroDocumento,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          estado: 'ACTIVO',
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
          fechaNacimiento: new Date(formData.fechaNacimiento),
          genero: formData.genero as any
        };

        setSellers(prev => [...prev, newSeller]);
        setLoading(false);
        setOpenModal(false);
        setSnackbar({
          open: true,
          message: 'Vendedor registrado exitosamente',
          severity: 'success'
        });
      }, 2000);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      tipoDocumento: '',
      estado: ''
    });
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

  // Opciones para formularios
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

  // Calcular estadísticas
  const vendedoresActivos = filteredSellers.filter(s => s.estado === 'ACTIVO').length;
  const vendedoresTotal = filteredSellers.length;
  const vendedoresSuspendidos = filteredSellers.filter(s => s.estado === 'SUSPENDIDO').length;
  const vendedoresVacaciones = filteredSellers.filter(s => s.estado === 'VACACIONES').length;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{vendedoresTotal}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Vendedores
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{vendedoresVacaciones}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    En Vacaciones
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{vendedoresSuspendidos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Suspendidos
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toolbar con búsqueda y filtros */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Buscar por documento, nombre o email..."
              variant="outlined"
              size="small"
              sx={{ minWidth: 300 }}
              value={searchFilters.searchTerm}
              onChange={(e) => handleSearchChange('searchTerm', e.target.value)}
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
                value={searchFilters.tipoDocumento}
                onChange={(e) => handleSearchChange('tipoDocumento', e.target.value)}
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
                value={searchFilters.estado}
                onChange={(e) => handleSearchChange('estado', e.target.value)}
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
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddSeller}
              color="primary"
            >
              Agregar Vendedor
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }} aria-label="tabla de vendedores">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Tipo Doc.</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Nro. Documento</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Vendedor</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Contacto</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredSellers
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
                          {seller.nombres.charAt(0)}{seller.apellidos.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {seller.nombres} {seller.apellidos}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {seller.genero === 'M' ? 'Masculino' : 'Femenino'} - {seller.fechaNacimiento?.toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
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
                      <Typography variant="caption" color="text.secondary">
                        {seller.direccion}
                      </Typography>
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
                            onClick={() => console.log('Ver vendedor:', seller.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => console.log('Editar vendedor:', seller.id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            onClick={() => console.log('Eliminar vendedor:', seller.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
            {!loading && filteredSellers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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

      {/* Modal para agregar vendedor */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.dark' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Registrar Nuevo Vendedor
                </Typography>
                <Typography variant="body2">
                  Complete todos los campos requeridos
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ pt: 3 }}>
              <FormControl fullWidth error={!!formErrors.tipoDocumento}>
                <InputLabel>Tipo de Documento *</InputLabel>
                <Select
                  value={formData.tipoDocumento}
                  onChange={(e) => handleFormChange('tipoDocumento', e.target.value)}
                  label="Tipo de Documento *"
                >
                  {tiposDocumento.map(tipo => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.tipoDocumento && <FormHelperText>{formErrors.tipoDocumento}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ pt: 3 }}>
              <TextField
                fullWidth
                label="Número de Documento *"
                value={formData.nroDocumento}
                onChange={(e) => handleFormChange('nroDocumento', e.target.value)}
                error={!!formErrors.nroDocumento}
                helperText={formErrors.nroDocumento}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombres *"
                value={formData.nombres}
                onChange={(e) => handleFormChange('nombres', e.target.value)}
                error={!!formErrors.nombres}
                helperText={formErrors.nombres}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Apellidos *"
                value={formData.apellidos}
                onChange={(e) => handleFormChange('apellidos', e.target.value)}
                error={!!formErrors.apellidos}
                helperText={formErrors.apellidos}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Correo Electrónico *"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Teléfono *"
                value={formData.telefono}
                onChange={(e) => handleFormChange('telefono', e.target.value)}
                error={!!formErrors.telefono}
                helperText={formErrors.telefono}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleFormChange('direccion', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento *"
                value={formData.fechaNacimiento}
                onChange={(e) => handleFormChange('fechaNacimiento', e.target.value)}
                error={!!formErrors.fechaNacimiento}
                helperText={formErrors.fechaNacimiento}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth error={!!formErrors.genero}>
                <InputLabel>Género *</InputLabel>
                <Select
                  value={formData.genero}
                  onChange={(e) => handleFormChange('genero', e.target.value)}
                  label="Género *"
                >
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="F">Femenino</MenuItem>
                </Select>
                {formErrors.genero && <FormHelperText>{formErrors.genero}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>

          {/* Alertas de validación */}
          {Object.keys(formErrors).length > 0 && (
            <Alert severity="error" sx={{ mt: 3 }}>
              Por favor, complete todos los campos requeridos
            </Alert>
          )}
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit">
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
            color="primary"
          >
            {loading ? 'Guardando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListSellers;