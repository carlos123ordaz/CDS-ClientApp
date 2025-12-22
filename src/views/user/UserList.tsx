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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Alert,
  CircularProgress,
  Snackbar,
  Badge,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  SupervisorAccount as LeaderIcon,
  Business as AreaIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { CreateUser } from 'src/components/user/CreateUser';
import { UserEdit } from 'src/components/user/UserEdit';

// Interfaces basadas en la estructura de la BD
interface Usuario {
  usuarioID: number;
  tipoDoc?: string;
  numDoc?: string;
  nombre?: string;
  apellido?: string;
  esLider: boolean;
  fechaCreacion?: Date;
  fechaModific?: Date;
  estado: boolean;
  areaID: number;
  password: string;
  correo: string;
  // Datos adicionales para mostrar
  areaNombre?: string;
  roles?: string[];
  telefono?: string;
  direccion?: string;
}

interface Area {
  areaID: number;
  nombre: string;
  nCorto: string;
  estado: boolean;
}

interface SearchForm {
  searchTerm: string;
  tipoDoc: string;
  estado: string;
  areaID: string;
  esLider: string;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [searchFilters, setSearchFilters] = useState<SearchForm>({
    searchTerm: '',
    tipoDoc: '',
    estado: '',
    areaID: '',
    esLider: ''
  });

  const mockUsers: Usuario[] = [
    {
      usuarioID: 1,
      tipoDoc: 'DNI',
      numDoc: '12345678',
      nombre: 'Carlos Alberto',
      apellido: 'Rodriguez Martinez',
      esLider: true,
      estado: true,
      areaID: 1,
      correo: 'carlos.rodriguez@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Ventas',
      roles: ['Administrador', 'Vendedor'],
      telefono: '+51 987654321',
      direccion: 'Av. Los Olivos 123, Lima',
      fechaCreacion: new Date('2024-01-15'),
      fechaModific: new Date('2024-09-15')
    },
    {
      usuarioID: 2,
      tipoDoc: 'DNI',
      numDoc: '87654321',
      nombre: 'Maria Elena',
      apellido: 'Gonzales Perez',
      esLider: false,
      estado: true,
      areaID: 2,
      correo: 'maria.gonzales@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Compras',
      roles: ['Comprador'],
      telefono: '+51 987654322',
      direccion: 'Jr. Huancayo 456, Lima',
      fechaCreacion: new Date('2024-02-20'),
      fechaModific: new Date('2024-09-10')
    },
    {
      usuarioID: 3,
      tipoDoc: 'CE',
      numDoc: '001234567',
      nombre: 'Juan Carlos',
      apellido: 'Perez Silva',
      esLider: true,
      estado: true,
      areaID: 3,
      correo: 'juan.perez@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Almacén',
      roles: ['Supervisor', 'Almacenero'],
      telefono: '+51 987654323',
      direccion: 'Calle Las Flores 789, Lima',
      fechaCreacion: new Date('2024-01-10'),
      fechaModific: new Date('2024-08-25')
    },
    {
      usuarioID: 4,
      tipoDoc: 'DNI',
      numDoc: '11223344',
      nombre: 'Ana Sofia',
      apellido: 'Mendoza Torres',
      esLider: false,
      estado: false,
      areaID: 4,
      correo: 'ana.mendoza@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Administración',
      roles: ['Analista'],
      telefono: '+51 987654324',
      direccion: 'Av. Universitaria 321, Lima',
      fechaCreacion: new Date('2024-03-05'),
      fechaModific: new Date('2024-09-01')
    },
    {
      usuarioID: 5,
      tipoDoc: 'DNI',
      numDoc: '99887766',
      nombre: 'Roberto',
      apellido: 'Silva Castro',
      esLider: false,
      estado: true,
      areaID: 5,
      correo: 'roberto.silva@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Logística',
      roles: ['Operador'],
      telefono: '+51 987654325',
      direccion: 'Jr. Tacna 654, Lima',
      fechaCreacion: new Date('2024-02-14'),
      fechaModific: new Date('2024-09-12')
    },
    {
      usuarioID: 6,
      tipoDoc: 'PASSPORT',
      numDoc: 'AB1234567',
      nombre: 'Luis Fernando',
      apellido: 'Torres Vargas',
      esLider: true,
      estado: true,
      areaID: 6,
      correo: 'luis.torres@empresa.com',
      password: 'hashedPassword',
      areaNombre: 'Finanzas',
      roles: ['Administrador', 'Analista'],
      telefono: '+51 987654326',
      direccion: 'Av. Brasil 987, Lima',
      fechaCreacion: new Date('2024-01-20'),
      fechaModific: new Date('2024-09-08')
    }
  ];
  const mockAreas: Area[] = [
    { areaID: 1, nombre: 'Ventas', nCorto: 'VTA', estado: true },
    { areaID: 2, nombre: 'Compras', nCorto: 'CMP', estado: true },
    { areaID: 3, nombre: 'Almacén', nCorto: 'ALM', estado: true },
    { areaID: 4, nombre: 'Administración', nCorto: 'ADM', estado: true },
    { areaID: 5, nombre: 'Logística', nCorto: 'LOG', estado: true },
    { areaID: 6, nombre: 'Finanzas', nCorto: 'FIN', estado: true }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setAreas(mockAreas);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    let filtered = users;

    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter((user) =>
        user.numDoc?.toLowerCase().includes(term) ||
        user.nombre?.toLowerCase().includes(term) ||
        user.apellido?.toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term) ||
        user.areaNombre?.toLowerCase().includes(term)
      );
    }

    if (searchFilters.tipoDoc) {
      filtered = filtered.filter(user => user.tipoDoc === searchFilters.tipoDoc);
    }

    if (searchFilters.estado !== '') {
      const estadoBool = searchFilters.estado === 'true';
      filtered = filtered.filter(user => user.estado === estadoBool);
    }

    if (searchFilters.areaID) {
      filtered = filtered.filter(user => user.areaID === parseInt(searchFilters.areaID));
    }

    if (searchFilters.esLider !== '') {
      const esLiderBool = searchFilters.esLider === 'true';
      filtered = filtered.filter(user => user.esLider === esLiderBool);
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [searchFilters, users]);

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
  const handleAddUser = () => {
    setOpenCreateModal(true);
  };
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };
  const handleUserCreated = (newUser: any) => {
    const userWithId = {
      ...newUser,
      usuarioID: users.length + 1,
      areaNombre: areas.find(a => a.areaID === newUser.areaID)?.nombre,
      roles: ['Nuevo Usuario']
    };

    setUsers(prev => [...prev, userWithId]);
    setSnackbar({
      open: true,
      message: `Usuario ${newUser.nombre} ${newUser.apellido} creado exitosamente`,
      severity: 'success'
    });
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user: Usuario) => {
    setOpenEditModal(true);
    setSelectedUser(user);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
      setSnackbar({
        open: true,
        message: 'Lista actualizada correctamente',
        severity: 'info'
      });
    }, 1000);
  };
  const handleClearFilters = () => {
    setSearchFilters({
      searchTerm: '',
      tipoDoc: '',
      estado: '',
      areaID: '',
      esLider: ''
    });
  };
  const tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carné de Extranjería' },
    { value: 'PASSPORT', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        {refreshing && (
          <LinearProgress sx={{ borderRadius: '8px 8px 0 0' }} />
        )}
        <Toolbar sx={{ p: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1 }}>
            <TextField
              placeholder="Buscar por documento, nombre, email o área..."
              variant="outlined"
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 350 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              value={searchFilters.searchTerm}
              onChange={(e) => handleSearchChange('searchTerm', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchFilters.searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => handleSearchChange('searchTerm', '')}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Tipo Doc.</InputLabel>
              <Select
                value={searchFilters.tipoDoc}
                onChange={(e) => handleSearchChange('tipoDoc', e.target.value)}
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
                <MenuItem value="true">Activo</MenuItem>
                <MenuItem value="false">Inactivo</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Área</InputLabel>
              <Select
                value={searchFilters.areaID}
                onChange={(e) => handleSearchChange('areaID', e.target.value)}
                label="Área"
              >
                <MenuItem value="">Todas</MenuItem>
                {areas.map(area => (
                  <MenuItem key={area.areaID} value={area.areaID.toString()}>
                    {area.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Líderes</InputLabel>
              <Select
                value={searchFilters.esLider}
                onChange={(e) => handleSearchChange('esLider', e.target.value)}
                label="Líderes"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Solo Líderes</MenuItem>
                <MenuItem value="false">No Líderes</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Limpiar filtros">
              <IconButton
                onClick={handleClearFilters}
                size="small"
                color="primary"
                sx={{ border: '1px solid', borderColor: 'primary.main' }}
              >
                <FilterIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Actualizar">
              <IconButton
                onClick={handleRefresh}
                size="small"
                color="info"
                sx={{ border: '1px solid', borderColor: 'info.main' }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Exportar">
              <IconButton
                size="small"
                color="success"
                sx={{ border: '1px solid', borderColor: 'success.main' }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
            >
              Nuevo Usuario
            </Button>
          </Stack>
        </Toolbar>
      </Paper>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          overflow: 'hidden'
        }}
      >
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Usuario
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Documento
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Contacto
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Área & Roles
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Estado
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Fechas
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Cargando usuarios...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow
                    key={user.usuarioID}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: alpha('#000', 0.02) },
                      '&:hover': {
                        bgcolor: alpha('#2196f3', 0.04),
                        transform: 'scale(1.001)',
                        boxShadow: 1
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            user.esLider ? (
                              <Avatar sx={{ width: 20, height: 20, bgcolor: 'warning.main' }}>
                                <LeaderIcon sx={{ fontSize: 12 }} />
                              </Avatar>
                            ) : null
                          }
                        >
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: user.estado ? 'primary.main' : 'grey.400',
                              fontSize: '1.1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                            {user.nombre} {user.apellido}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.usuarioID} {user.esLider && '• Líder'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Chip
                          label={user.tipoDoc}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'medium' }}>
                          {user.numDoc}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Contacto */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {user.correo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AreaIcon fontSize="small" color="info" />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {user.areaNombre}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {user.roles?.map((rol, idx) => (
                            <Chip
                              key={idx}
                              label={rol}
                              size="small"
                              color="secondary"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Chip
                        label={user.estado ? 'Activo' : 'Inactivo'}
                        color={user.estado ? 'success' : 'error'}
                        size="small"
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>

                    {/* Fechas */}
                    <TableCell>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Creado: {user.fechaCreacion?.toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Modificado: {user.fechaModific?.toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Editar usuario">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => console.log('Eliminar usuario:', user.usuarioID)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
            {!loading && filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Box>
                    <PersonIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron usuarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ajusta los filtros de búsqueda o agrega nuevos usuarios
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 3,
        '& .MuiTablePagination-root': {
          border: 'none'
        }
      }}>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Usuarios por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 'medium'
            }
          }}
        />
      </Box>
      <CreateUser
        openModal={openCreateModal}
        handleCloseModal={handleCloseCreateModal}
        onUserCreated={handleUserCreated}
      />
      <UserEdit
        openModal={openEditModal}
        handleCloseModal={handleCloseEditModal}
        user={selectedUser}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            fontWeight: 'medium',
            boxShadow: 4
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListUsers;