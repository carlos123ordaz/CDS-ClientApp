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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

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
  estado: 'activo' | 'inactivo';
  fechaCreacion: Date;
}

// Interfaz para el formulario de búsqueda
interface SearchForm {
  searchTerm: string;
}

const ListServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const navigate = useNavigate();
  const { register, watch } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
    }
  });

  const searchTerm = watch('searchTerm');

  // Datos de ejemplo basados en la imagen
  const mockServices: Service[] = [
    {
      id: '1',
      codERP: 'SRV0005',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.P.marcha.UNAU',
      unidad: 'UND.',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      estado: 'activo',
      fechaCreacion: new Date('2024-01-15'),
    },
    {
      id: '2',
      codERP: 'SRV0006',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.P.marcha.UNAI',
      unidad: 'UND.',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      estado: 'activo',
      fechaCreacion: new Date('2024-01-16'),
    },
    {
      id: '3',
      codERP: 'SRV0007',
      marca: 'Consusa',
      codComercial: 'Serv-ElDir.Calib-Contrast.Otros',
      unidad: 'UND.',
      clase: '03-SRV',
      subClase: '3B-AU',
      subSubClase: '3B3-AEJ',
      medida: '',
      estado: 'inactivo',
      fechaCreacion: new Date('2024-01-17'),
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setServices(mockServices);
    setFilteredServices(mockServices);
  }, []);

  // Filtrar servicios basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
    } else {
      const filtered = services.filter((service) =>
        service.codERP.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.codComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.clase.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddService = () => {
    navigate('/service-create');
  };

  const handleEditService = (serviceId: string) => {
    console.log('Editar servicio:', serviceId);
  };

  const handleViewService = (serviceId: string) => {
    console.log('Ver servicio:', serviceId);
  };

  const handleDeleteService = (serviceId: string) => {
    console.log('Eliminar servicio:', serviceId);
  };

  const getStatusColor = (status: string) => {
    return status === 'activo' ? 'success' : 'error';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Lista de Servicios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddService}
          size="large"
        >
          Agregar Servicio
        </Button>
      </Stack>

      {/* Toolbar con búsqueda */}
      <Paper sx={{ mb: 2 }}>
        <Toolbar sx={{ px: 2, py: 1 }}>
          <TextField
            {...register('searchTerm')}
            placeholder="Buscar por código ERP, marca, código comercial o clase..."
            variant="outlined"
            size="small"
            sx={{ minWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {filteredServices.length} servicio(s) encontrado(s)
          </Typography>
        </Toolbar>
      </Paper>

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="tabla de servicios">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. ERP</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Marca</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cód. Comercial</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unidad</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Clase</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sub-Clase</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sub-Sub-Clase</TableCell>
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
                  <TableCell sx={{ fontWeight: 'medium' }}>{service.codERP}</TableCell>
                  <TableCell>{service.marca}</TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography variant="body2" noWrap title={service.codComercial}>
                      {service.codComercial}
                    </Typography>
                  </TableCell>
                  <TableCell>{service.unidad}</TableCell>
                  <TableCell>
                    <Chip label={service.clase} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={service.subClase} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={service.subSubClase} size="small" variant="outlined" />
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
                      <IconButton
                        size="small"
                        onClick={() => handleViewService(service.id)}
                        title="Ver detalles"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditService(service.id)}
                        title="Editar"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteService(service.id)}
                        title="Eliminar"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            { filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No se encontraron servicios
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