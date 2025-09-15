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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

// Interfaz para los datos del cliente
interface Customer {
  idClt: string;
  idTdi: number;
  nDoc: string;
  razonSocial: string;
  nombreCliente?: string;
  tipoCliente?: string;
  industria?: string;
  sector?: string;
  zona?: string;
  pais?: string;
  telefClt?: string;
  correoClt?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  fechaCreacion?: Date;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  contactoPrincipal?: string;
  cargoContacto?: string;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  tipoDocumento: string;
  tipoCliente: string;
  estado: string;
  industria: string;
}

// Interfaz para el formulario de cliente
interface CustomerForm {
  idTdi: number;
  nDoc: string;
  razonSocial: string;
  nombreCliente: string;
  tipoCliente: string;
  industria: string;
  sector: string;
  zona: string;
  pais: string;
  telefClt: string;
  correoClt: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  contactoPrincipal: string;
  cargoContacto: string;
  incluirDatosAdicionales: boolean;
}

const ListClients: React.FC = () => {
  const [clients, setClients] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredClients, setFilteredClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      tipoDocumento: '',
      tipoCliente: '',
      estado: '',
      industria: '',
    }
  });

  const {
    register: registerCustomer,
    control: controlCustomer,
    handleSubmit: handleSubmitCustomer,
    reset: resetCustomer,
    watch: watchCustomer,
    formState: { errors }
  } = useForm<CustomerForm>({
    defaultValues: {
      idTdi: 6,
      nDoc: '',
      razonSocial: '',
      nombreCliente: '',
      tipoCliente: 'EMPRESA',
      industria: '',
      sector: '',
      zona: '',
      pais: 'Perú',
      telefClt: '',
      correoClt: '',
      estado: 'ACTIVO',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      contactoPrincipal: '',
      cargoContacto: '',
      incluirDatosAdicionales: false,
    }
  });

  const searchTerm = watch('searchTerm');
  const tipoDocumentoFilter = watch('tipoDocumento');
  const tipoClienteFilter = watch('tipoCliente');
  const estadoFilter = watch('estado');
  const industriaFilter = watch('industria');
  const incluirDatosAdicionales = watchCustomer('incluirDatosAdicionales');

  // Datos mock para ejemplo
  const mockClients: Customer[] = [
    {
      idClt: '1',
      idTdi: 6,
      nDoc: '20123456789',
      razonSocial: 'Corporación Industrial SAC',
      nombreCliente: 'Corporación Industrial',
      tipoCliente: 'EMPRESA',
      industria: 'Manufactura',
      sector: 'Industrial',
      zona: 'Lima Norte',
      pais: 'Perú',
      telefClt: '+51 912 345 678',
      correoClt: 'contacto@corporacion.com',
      estado: 'ACTIVO',
      fechaCreacion: new Date('2023-01-15'),
    },
    {
      idClt: '2',
      idTdi: 6,
      nDoc: '20987654321',
      razonSocial: 'Tecnología Avanzada EIRL',
      nombreCliente: 'TecnoAvanzada',
      tipoCliente: 'EMPRESA',
      industria: 'Tecnología',
      sector: 'Software',
      zona: 'San Isidro',
      pais: 'Perú',
      telefClt: '+51 987 654 321',
      correoClt: 'info@tecnoavanzada.pe',
      estado: 'ACTIVO',
      fechaCreacion: new Date('2023-02-10'),
    },
    {
      idClt: '3',
      idTdi: 0,
      nDoc: '12345678',
      razonSocial: 'Juan Carlos Pérez López',
      nombreCliente: 'Juan Pérez',
      tipoCliente: 'PERSONA',
      industria: 'Servicios',
      sector: 'Consultoría',
      zona: 'Miraflores',
      pais: 'Perú',
      telefClt: '+51 999 888 777',
      correoClt: 'juan.perez@email.com',
      estado: 'ACTIVO',
      fechaCreacion: new Date('2023-03-05'),
    },
  ];

  useEffect(() => {
    handleGetCustomers();
  }, []);

  const handleGetCustomers = () => {
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setClients(mockClients);
      setFilteredClients(mockClients);
      setLoading(false);
    }, 1000);
  };

  // Filtrar clientes basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter((client) =>
        client.nDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefClt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.correoClt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoDocumentoFilter) {
      filtered = filtered.filter(client => client.idTdi.toString() === tipoDocumentoFilter);
    }

    if (tipoClienteFilter) {
      filtered = filtered.filter(client => client.tipoCliente === tipoClienteFilter);
    }

    if (estadoFilter) {
      filtered = filtered.filter(client => client.estado === estadoFilter);
    }

    if (industriaFilter) {
      filtered = filtered.filter(client => client.industria === industriaFilter);
    }

    setFilteredClients(filtered);
    setPage(0);
  }, [searchTerm, tipoDocumentoFilter, tipoClienteFilter, estadoFilter, industriaFilter, clients]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddClient = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetCustomer();
  };

  const onSubmitCustomer = async (data: CustomerForm) => {
    setSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCustomer: Customer = {
        idClt: String(Date.now()),
        idTdi: data.idTdi,
        nDoc: data.nDoc,
        razonSocial: data.razonSocial,
        nombreCliente: data.nombreCliente,
        tipoCliente: data.tipoCliente,
        industria: data.industria,
        sector: data.sector,
        zona: data.zona,
        pais: data.pais,
        telefClt: data.telefClt,
        correoClt: data.correoClt,
        estado: data.estado,
        direccion: data.incluirDatosAdicionales ? data.direccion : undefined,
        ciudad: data.incluirDatosAdicionales ? data.ciudad : undefined,
        codigoPostal: data.incluirDatosAdicionales ? data.codigoPostal : undefined,
        contactoPrincipal: data.incluirDatosAdicionales ? data.contactoPrincipal : undefined,
        cargoContacto: data.incluirDatosAdicionales ? data.cargoContacto : undefined,
        fechaCreacion: new Date(),
      };

      setClients(prev => [newCustomer, ...prev]);
      setFilteredClients(prev => [newCustomer, ...prev]);
      handleCloseModal();

      alert('Cliente creado exitosamente');
    } catch (error) {
      alert('Error al crear el cliente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewClient = (clientId: string) => {
    console.log('Ver cliente:', clientId);
  };

  const handleClearFilters = () => {
    reset();
  };

  const tipoDocumento: Record<number, string> = {
    0: 'DNI',
    6: 'RUC',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'default';
      case 'SUSPENDIDO': return 'error';
      default: return 'default';
    }
  };

  const getTipoClienteIcon = (tipo: string) => {
    return tipo === 'EMPRESA' ? <BusinessIcon fontSize="small" /> : <PersonIcon fontSize="small" />;
  };

  // Opciones para filtros
  const tiposDocumento = [
    { value: '0', label: 'DNI' },
    { value: '6', label: 'RUC' },
  ];

  const tiposCliente = [
    { value: 'EMPRESA', label: 'Empresa' },
    { value: 'PERSONA', label: 'Persona Natural' },
  ];

  const estados = [
    { value: 'ACTIVO', label: 'Activo' },
    { value: 'INACTIVO', label: 'Inactivo' },
    { value: 'SUSPENDIDO', label: 'Suspendido' },
  ];

  const industrias = [
    { value: 'Manufactura', label: 'Manufactura' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Servicios', label: 'Servicios' },
    { value: 'Construcción', label: 'Construcción' },
    { value: 'Minería', label: 'Minería' },
    { value: 'Agricultura', label: 'Agricultura' },
  ];

  const sectores = [
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Software', label: 'Software' },
    { value: 'Consultoría', label: 'Consultoría' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Educación', label: 'Educación' },
  ];

  const zonas = [
    { value: 'Lima Norte', label: 'Lima Norte' },
    { value: 'Lima Sur', label: 'Lima Sur' },
    { value: 'Lima Este', label: 'Lima Este' },
    { value: 'Lima Centro', label: 'Lima Centro' },
    { value: 'San Isidro', label: 'San Isidro' },
    { value: 'Miraflores', label: 'Miraflores' },
    { value: 'Callao', label: 'Callao' },
  ];

  const paises = [
    { value: 'Perú', label: 'Perú' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Bolivia', label: 'Bolivia' },
  ];

  // Calcular estadísticas
  const clientesActivos = filteredClients.filter(c => c.estado === 'ACTIVO').length;
  const empresas = filteredClients.filter(c => c.tipoCliente === 'EMPRESA').length;
  const personas = filteredClients.filter(c => c.tipoCliente === 'PERSONA').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{clientesActivos}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clientes Activos
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
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{empresas}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Empresas
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
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{personas}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Personas Naturales
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
              placeholder="Buscar por documento, razón social, nombre o contacto..."
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
              <InputLabel>Tipo Documento</InputLabel>
              <Select
                {...register('tipoDocumento')}
                label="Tipo Documento"
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposDocumento.map(tipo => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tipo Cliente</InputLabel>
              <Select
                {...register('tipoCliente')}
                label="Tipo Cliente"
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposCliente.map(tipo => (
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

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Industria</InputLabel>
              <Select
                {...register('industria')}
                label="Industria"
              >
                <MenuItem value="">Todas</MenuItem>
                {industrias.map(industria => (
                  <MenuItem key={industria.value} value={industria.value}>
                    {industria.label}
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
              <IconButton onClick={handleGetCustomers} size="small">
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
              onClick={handleAddClient}
              size="small"
            >
              Nuevo Cliente
            </Button>
          </Stack>
        </Toolbar>
      </Paper>

      {/* Modal para agregar cliente */}
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
              Agregar Nuevo Cliente
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmitCustomer(onSubmitCustomer)}>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Información de identificación */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Información de Identificación
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={!!errors.idTdi}>
                  <InputLabel>Tipo de Documento</InputLabel>
                  <Controller
                    name="idTdi"
                    control={controlCustomer}
                    rules={{ required: 'El tipo de documento es requerido' }}
                    render={({ field }) => (
                      <Select {...field} label="Tipo de Documento">
                        <MenuItem value={0}>DNI</MenuItem>
                        <MenuItem value={6}>RUC</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.idTdi && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.idTdi.message}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerCustomer('nDoc', {
                    required: 'El número de documento es requerido',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Solo se permiten números'
                    }
                  })}
                  label="Número de Documento"
                  fullWidth
                  error={!!errors.nDoc}
                  helperText={errors.nDoc?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  {...registerCustomer('razonSocial', { required: 'La razón social es requerida' })}
                  label="Razón Social"
                  fullWidth
                  error={!!errors.razonSocial}
                  helperText={errors.razonSocial?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerCustomer('nombreCliente')}
                  label="Nombre Comercial"
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Cliente</InputLabel>
                  <Controller
                    name="tipoCliente"
                    control={controlCustomer}
                    render={({ field }) => (
                      <Select {...field} label="Tipo de Cliente">
                        <MenuItem value="EMPRESA">Empresa</MenuItem>
                        <MenuItem value="PERSONA">Persona Natural</MenuItem>
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Industria</InputLabel>
                  <Controller
                    name="industria"
                    control={controlCustomer}
                    render={({ field }) => (
                      <Select {...field} label="Industria">
                        {industrias.map(industria => (
                          <MenuItem key={industria.value} value={industria.value}>
                            {industria.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sector</InputLabel>
                  <Controller
                    name="sector"
                    control={controlCustomer}
                    render={({ field }) => (
                      <Select {...field} label="Sector">
                        {sectores.map(sector => (
                          <MenuItem key={sector.value} value={sector.value}>
                            {sector.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Zona</InputLabel>
                  <Controller
                    name="zona"
                    control={controlCustomer}
                    render={({ field }) => (
                      <Select {...field} label="Zona">
                        {zonas.map(zona => (
                          <MenuItem key={zona.value} value={zona.value}>
                            {zona.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>País</InputLabel>
                  <Controller
                    name="pais"
                    control={controlCustomer}
                    render={({ field }) => (
                      <Select {...field} label="País">
                        {paises.map(pais => (
                          <MenuItem key={pais.value} value={pais.value}>
                            {pais.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Información de contacto */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
                  Información de Contacto
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerCustomer('telefClt', {
                    pattern: {
                      value: /^[\+]?[0-9\s\-\(\)]+$/,
                      message: 'Formato de teléfono inválido'
                    }
                  })}
                  label="Teléfono"
                  fullWidth
                  error={!!errors.telefClt}
                  helperText={errors.telefClt?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  {...registerCustomer('correoClt', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Formato de email inválido'
                    }
                  })}
                  label="Correo Electrónico"
                  fullWidth
                  type="email"
                  error={!!errors.correoClt}
                  helperText={errors.correoClt?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Controller
                    name="estado"
                    control={controlCustomer}
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

              {/* Datos adicionales */}
              <Grid size={12}>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="incluirDatosAdicionales"
                        control={controlCustomer}
                        render={({ field }) => (
                          <Switch {...field} checked={field.value} />
                        )}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon fontSize="small" />
                        <Typography>Incluir datos adicionales</Typography>
                      </Box>
                    }
                  />
                </Box>
              </Grid>

              {incluirDatosAdicionales && (
                <>
                  <Grid size={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Datos Adicionales
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      {...registerCustomer('direccion')}
                      label="Dirección"
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerCustomer('ciudad')}
                      label="Ciudad"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerCustomer('codigoPostal')}
                      label="Código Postal"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerCustomer('contactoPrincipal')}
                      label="Contacto Principal"
                      fullWidth
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      {...registerCustomer('cargoContacto')}
                      label="Cargo del Contacto"
                      fullWidth
                    />
                  </Grid>
                </>
              )}

              {/* Información adicional */}
              <Grid size={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Nota:</strong> Una vez creado el cliente, se generará automáticamente la fecha de creación
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
              {submitting ? 'Guardando...' : 'Guardar Cliente'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1400 }} aria-label="tabla de clientes">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Doc.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nro. Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Razón Social</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Industria</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sector</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zona</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>País</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ?
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(11)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j % 2 === 0 ? '80%' : '60%'} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              :
              filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow
                    key={client.idClt}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={tipoDocumento[client.idTdi]}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                      {client.nDoc}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap title={client.razonSocial}>
                        {client.razonSocial}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTipoClienteIcon(client.tipoCliente || '')}
                        {client.nombreCliente || client.razonSocial}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.tipoCliente}
                        size="small"
                        variant="outlined"
                        color={client.tipoCliente === 'EMPRESA' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>

                        {client.industria}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={client.sector} size="small" variant="filled" />
                    </TableCell>
                    <TableCell>
                      {client.zona}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        {client.pais}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.estado}
                        color={getStatusColor(client.estado) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleViewClient(client.idClt)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                          // onClick={() => handleEditClient(client.idClt)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            // onClick={() => handleDeleteClient(client.idClt)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            {!loading && filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron clientes que coincidan con los filtros
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
        count={filteredClients.length}
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

export default ListClients;