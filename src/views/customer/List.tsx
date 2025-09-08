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
  Skeleton,
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
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Customer } from 'src/models/Customer';
import { getCustomers } from 'src/services/CustomerService';
import { FilterCard } from 'src/components/shared/FilterCard';


interface SearchForm {
  searchTerm: string;
  tipoDocumento: string;
  tipoCliente: string;
  estado: string;
  industria: string;
}

const ListClients: React.FC = () => {
  const [clients, setClients] = useState<Customer[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredClients, setFilteredClients] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, watch, reset } = useForm<SearchForm>({
    defaultValues: {
      searchTerm: '',
      tipoDocumento: '',
      tipoCliente: '',
      estado: '',
      industria: '',
    }
  });

  const searchTerm = watch('searchTerm');
  const tipoDocumentoFilter = watch('tipoDocumento');
  const tipoClienteFilter = watch('tipoCliente');
  const estadoFilter = watch('estado');
  const industriaFilter = watch('industria');

  const handleGetCustomers = () => {
    setLoading(true);
    getCustomers()
      .then((res: any) => {
        setClients(res.data);
        setFilteredClients(res.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
        alert('Error al obtener los clientes');
      })
  }
  useEffect(() => {
    handleGetCustomers();
  }, []);

  // Filtrar clientes basado en los criterios de búsqueda
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter((client) =>
        client.nDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telefClt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

  const handleViewClient = (clientId: string) => {
    console.log('Ver cliente:', clientId);
  };

  const tipoDocumento: any = {
    0: 'DNI',
    6: 'RUC',
  }
  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ color: 'white', pb: '16px !important' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Gestión de Clientes
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {filteredClients.length} clientes registrados
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
        </CardContent>
      </Card>
      <FilterCard />
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
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width='80%' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width='80%' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width='80%' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={30} />
                  </TableCell>
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
                      <Chip label={tipoDocumento[client.idTdi]} size="small" variant="outlined" color="primary" />
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
                        {/* {getTipoClienteIcon(client.tipoCliente)} */}
                        {client.razonSocial}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.razonSocial}
                        size="small"
                        variant="outlined"
                        color={client.razonSocial === 'EMPRESA' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {/* {client.industria} */}
                    </TableCell>
                    <TableCell>
                      {/* <Chip label={client.sector} size="small" variant="filled" /> */}
                    </TableCell>
                    <TableCell>
                      {/* {client.zona} */}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationIcon fontSize="small" color="action" />
                        {/* {client.pais} */}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {/* <Chip
                      label={client.estado}
                      color={getStatusColor(client.estado) as any}
                      size="small"
                    /> */}
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
                        {/* <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClient(client.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
                        {/* <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClient(client.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip> */}
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