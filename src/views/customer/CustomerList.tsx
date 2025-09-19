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
  FormControlLabel,
  Switch,
  Grid,
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
  FilterList as FilterIcon,
  Download as DownloadIcon,
  RefreshOutlined as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { CustomerCreate } from 'src/components/customer/CustomerCreate';
import { CustomerEdit } from 'src/components/customer/CustomerEdit';

// Interfaz basada en la tabla Empresa de la BD
interface Empresa {
  empresaID: number;
  tipoDocumento: string;
  numDoc: string;
  razonSocial: string;
  tipoCliente: string;
  industria: string;
  sector: string;
  zona: string;
  pais: string;
  fecCreacion: Date;
  fecModific: Date;
  estado: boolean;
  ib_Prv: boolean;  // Es proveedor
  ib_Clt: boolean;  // Es cliente
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
  tipoDocumento: string;
  tipoCliente: string;
  estado: string;
  industria: string;
  sector: string;
  zona: string;
  pais: string;
  soloClientes: boolean;
  soloProveedores: boolean;
}

// Interfaz para el formulario de empresa
interface EmpresaForm {
  tipoDocumento: string;
  numDoc: string;
  razonSocial: string;
  tipoCliente: string;
  industria: string;
  sector: string;
  zona: string;
  pais: string;
  estado: boolean;
  ib_Prv: boolean;
  ib_Clt: boolean;
}

const ListClients: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      tipoDocumento: '',
      tipoCliente: '',
      estado: '',
      industria: '',
      sector: '',
      zona: '',
      pais: '',
      soloClientes: false,
      soloProveedores: false,
    }
  });

  const {
    register: registerEmpresa,
    control: controlEmpresa,
    handleSubmit: handleSubmitEmpresa,
    reset: resetEmpresa,
    watch: watchEmpresa,
    formState: { errors }
  } = useForm<EmpresaForm>({
    defaultValues: {
      tipoDocumento: 'RUC',
      numDoc: '',
      razonSocial: '',
      tipoCliente: 'CORPORATIVO',
      industria: '',
      sector: '',
      zona: '',
      pais: 'Perú',
      estado: true,
      ib_Prv: false,
      ib_Clt: true,
    }
  });

  const searchTerm = watch('searchTerm');
  const tipoDocumentoFilter = watch('tipoDocumento');
  const tipoClienteFilter = watch('tipoCliente');
  const estadoFilter = watch('estado');
  const industriaFilter = watch('industria');
  const sectorFilter = watch('sector');
  const zonaFilter = watch('zona');
  const paisFilter = watch('pais');
  const soloClientes = watch('soloClientes');
  const soloProveedores = watch('soloProveedores');

  // Datos mock basados en la estructura real de la BD
  const mockEmpresas: Empresa[] = [
    {
      empresaID: 1,
      tipoDocumento: 'RUC',
      numDoc: '20123456789',
      razonSocial: 'Corporación Industrial SAC',
      tipoCliente: 'CORPORATIVO',
      industria: 'Manufactura',
      sector: 'Industrial',
      zona: 'Lima Norte',
      pais: 'Perú',
      fecCreacion: new Date('2023-01-15'),
      fecModific: new Date('2023-01-15'),
      estado: true,
      ib_Prv: false,
      ib_Clt: true,
    },
    {
      empresaID: 2,
      tipoDocumento: 'RUC',
      numDoc: '20987654321',
      razonSocial: 'Tecnología Avanzada EIRL',
      tipoCliente: 'PYME',
      industria: 'Tecnología',
      sector: 'Software',
      zona: 'San Isidro',
      pais: 'Perú',
      fecCreacion: new Date('2023-02-10'),
      fecModific: new Date('2023-03-01'),
      estado: true,
      ib_Prv: true,
      ib_Clt: true,
    },
    {
      empresaID: 3,
      tipoDocumento: 'DNI',
      numDoc: '12345678',
      razonSocial: 'Juan Carlos Pérez López',
      tipoCliente: 'PERSONA_NATURAL',
      industria: 'Servicios',
      sector: 'Consultoría',
      zona: 'Miraflores',
      pais: 'Perú',
      fecCreacion: new Date('2023-03-05'),
      fecModific: new Date('2023-03-05'),
      estado: true,
      ib_Prv: false,
      ib_Clt: true,
    },
    {
      empresaID: 4,
      tipoDocumento: 'RUC',
      numDoc: '20555666777',
      razonSocial: 'Distribuidora Nacional SA',
      tipoCliente: 'CORPORATIVO',
      industria: 'Comercio',
      sector: 'Distribución',
      zona: 'Lima Centro',
      pais: 'Perú',
      fecCreacion: new Date('2023-04-12'),
      fecModific: new Date('2023-04-15'),
      estado: false,
      ib_Prv: true,
      ib_Clt: false,
    },
  ];

  useEffect(() => {
    handleGetEmpresas();
  }, []);

  const handleGetEmpresas = () => {
    setLoading(true);
    // Simular llamada a API
    setTimeout(() => {
      setEmpresas(mockEmpresas);
      setFilteredEmpresas(mockEmpresas);
      setLoading(false);
    }, 1000);
  };

  // Filtrar empresas basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = empresas;

    if (searchTerm) {
      filtered = filtered.filter((empresa) =>
        empresa.numDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.razonSocial.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (tipoDocumentoFilter) {
      filtered = filtered.filter(empresa => empresa.tipoDocumento === tipoDocumentoFilter);
    }

    if (tipoClienteFilter) {
      filtered = filtered.filter(empresa => empresa.tipoCliente === tipoClienteFilter);
    }

    if (estadoFilter) {
      const estadoBool = estadoFilter === 'true';
      filtered = filtered.filter(empresa => empresa.estado === estadoBool);
    }

    if (industriaFilter) {
      filtered = filtered.filter(empresa => empresa.industria === industriaFilter);
    }

    if (sectorFilter) {
      filtered = filtered.filter(empresa => empresa.sector === sectorFilter);
    }

    if (zonaFilter) {
      filtered = filtered.filter(empresa => empresa.zona === zonaFilter);
    }

    if (paisFilter) {
      filtered = filtered.filter(empresa => empresa.pais === paisFilter);
    }

    if (soloClientes && !soloProveedores) {
      filtered = filtered.filter(empresa => empresa.ib_Clt);
    }

    if (soloProveedores && !soloClientes) {
      filtered = filtered.filter(empresa => empresa.ib_Prv);
    }

    setFilteredEmpresas(filtered);
    setPage(0);
  }, [searchTerm, tipoDocumentoFilter, tipoClienteFilter, estadoFilter, industriaFilter,
    sectorFilter, zonaFilter, paisFilter, soloClientes, soloProveedores, empresas]);

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
    resetEmpresa();
  };

  const onSubmitEmpresa = async (data: EmpresaForm) => {
    setSubmitting(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newEmpresa: Empresa = {
        empresaID: Date.now(),
        tipoDocumento: data.tipoDocumento,
        numDoc: data.numDoc,
        razonSocial: data.razonSocial,
        tipoCliente: data.tipoCliente,
        industria: data.industria,
        sector: data.sector,
        zona: data.zona,
        pais: data.pais,
        estado: data.estado,
        ib_Prv: data.ib_Prv,
        ib_Clt: data.ib_Clt,
        fecCreacion: new Date(),
        fecModific: new Date(),
      };

      setEmpresas(prev => [newEmpresa, ...prev]);
      setFilteredEmpresas(prev => [newEmpresa, ...prev]);
      handleCloseModal();

      alert('Empresa creada exitosamente');
    } catch (error) {
      alert('Error al crear la empresa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewClient = (empresaId: number) => {
    console.log('Ver empresa:', empresaId);
  };

  const handleClearFilters = () => {
    reset();
  };

  const getStatusColor = (estado: boolean) => {
    return estado ? 'success' : 'error';
  };

  const getTipoClienteIcon = (tipo: string) => {
    return tipo === 'PERSONA_NATURAL' ? <PersonIcon fontSize="small" /> : <BusinessIcon fontSize="small" />;
  };

  // Opciones para filtros basadas en la BD
  const tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'RUC', label: 'RUC' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
  ];

  const tiposCliente = [
    { value: 'CORPORATIVO', label: 'Corporativo' },
    { value: 'PYME', label: 'PYME' },
    { value: 'PERSONA_NATURAL', label: 'Persona Natural' },
    { value: 'GOBIERNO', label: 'Gobierno' },
    { value: 'ONG', label: 'ONG' },
  ];

  const estados = [
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' },
  ];

  const industrias = [
    { value: 'Manufactura', label: 'Manufactura' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Servicios', label: 'Servicios' },
    { value: 'Construcción', label: 'Construcción' },
    { value: 'Minería', label: 'Minería' },
    { value: 'Agricultura', label: 'Agricultura' },
    { value: 'Comercio', label: 'Comercio' },
    { value: 'Transporte', label: 'Transporte' },
  ];

  const sectores = [
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Software', label: 'Software' },
    { value: 'Consultoría', label: 'Consultoría' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Distribución', label: 'Distribución' },
    { value: 'Logística', label: 'Logística' },
  ];

  const zonas = [
    { value: 'Lima Norte', label: 'Lima Norte' },
    { value: 'Lima Sur', label: 'Lima Sur' },
    { value: 'Lima Este', label: 'Lima Este' },
    { value: 'Lima Centro', label: 'Lima Centro' },
    { value: 'San Isidro', label: 'San Isidro' },
    { value: 'Miraflores', label: 'Miraflores' },
    { value: 'Callao', label: 'Callao' },
    { value: 'Provincia', label: 'Provincia' },
  ];

  const paises = [
    { value: 'Perú', label: 'Perú' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Brasil', label: 'Brasil' },
  ];

  // Calcular estadísticas
  const empresasActivas = filteredEmpresas.filter(e => e.estado).length;
  const soloClientesCount = filteredEmpresas.filter(e => e.ib_Clt && !e.ib_Prv).length;
  const soloProveedoresCount = filteredEmpresas.filter(e => e.ib_Prv && !e.ib_Clt).length;
  const clientesYProveedores = filteredEmpresas.filter(e => e.ib_Clt && e.ib_Prv).length;
  const handleEditClient = (empresa: Empresa) => {
    setOpenModalEdit(true);
    setEmpresaSelected(empresa);
  }
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setEmpresaSelected(null);
  }
  const [empresaSelected, setEmpresaSelected] = useState<Empresa | null>(null)
  return (
    <Box sx={{ p: 3 }}>
      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{empresasActivas}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Empresas Activas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{soloClientesCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Solo Clientes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{soloProveedoresCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Solo Proveedores
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{clientesYProveedores}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliente y Proveedor
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
          <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
            {/* Primera fila de filtros */}
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
              <TextField
                {...register('searchTerm')}
                placeholder="Buscar por documento o razón social..."
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

            {/* Segunda fila de filtros */}
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sector</InputLabel>
                <Select
                  {...register('sector')}
                  label="Sector"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {sectores.map(sector => (
                    <MenuItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
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

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>País</InputLabel>
                <Select
                  {...register('pais')}
                  label="País"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {paises.map(pais => (
                    <MenuItem key={pais.value} value={pais.value}>
                      {pais.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    {...register('soloClientes')}
                    size="small"
                  />
                }
                label="Solo Clientes"
              />

              <FormControlLabel
                control={
                  <Switch
                    {...register('soloProveedores')}
                    size="small"
                  />
                }
                label="Solo Proveedores"
              />

              <Box sx={{ flexGrow: 1 }} />

              <Stack direction="row" spacing={1}>
                <Tooltip title="Limpiar filtros">
                  <IconButton onClick={handleClearFilters} size="small">
                    <FilterIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Actualizar">
                  <IconButton onClick={handleGetEmpresas} size="small">
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
                  Nueva Empresa
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </Paper>

      <CustomerCreate openModal={openModal} handleCloseModal={handleCloseModal} />
      <CustomerEdit openModal={true} handleCloseModal={handleCloseModalEdit} empresa={empresaSelected} />

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1400 }} aria-label="tabla de empresas">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Doc.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nro. Documento</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Razón Social</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Industria</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sector</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Zona</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>País</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Roles</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ?
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(12)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width={j % 2 === 0 ? '80%' : '60%'} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
              :
              filteredEmpresas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((empresa) => (
                  <TableRow
                    key={empresa.empresaID}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {empresa.empresaID}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={empresa.tipoDocumento}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium', fontFamily: 'monospace' }}>
                      {empresa.numDoc}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography variant="body2" noWrap title={empresa.razonSocial}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTipoClienteIcon(empresa.tipoCliente)}
                          {empresa.razonSocial}
                        </Box>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={empresa.tipoCliente}
                        size="small"
                        variant="outlined"
                        color={empresa.tipoCliente === 'PERSONA_NATURAL' ? 'default' : 'primary'}
                      />
                    </TableCell>
                    <TableCell>{empresa.industria}</TableCell>
                    <TableCell>
                      <Chip label={empresa.sector} size="small" variant="filled" />
                    </TableCell>
                    <TableCell>{empresa.zona}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        {empresa.pais}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {empresa.ib_Clt && (
                          <Chip label="Cliente" size="small" color="success" variant="outlined" />
                        )}
                        {empresa.ib_Prv && (
                          <Chip label="Proveedor" size="small" color="info" variant="outlined" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={empresa.estado ? 'Activo' : 'Inactivo'}
                        color={getStatusColor(empresa.estado) as any}
                        size="small"
                        icon={empresa.estado ? <CheckCircleIcon /> : <CancelIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleEditClient(empresa)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            {!loading && filteredEmpresas.length === 0 && (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron empresas que coincidan con los filtros
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
        count={filteredEmpresas.length}
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