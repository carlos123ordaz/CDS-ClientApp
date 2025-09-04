import React from 'react';
import 'src/App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { getVendedores } from 'src/services/VendorService';

type Vendedor = {
  idVdr?: number | string;
  nDoc: string;
  nomVdr: string;
  ibLider?: number;
};

function App() {
  const theme = useTheme();

  let baseUrl = import.meta.env.VITE_API_URL_HTTPS;
  if (window.location.hostname === "localhost") {
    baseUrl = import.meta.env.VITE_API_URL_HTTPS;
  } else {
    baseUrl = import.meta.env.VITE_API_URL_NUBE;
  }
  const [data, setData] = useState<Vendedor[]>([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [gestorSeleccion, setGestorSeleccion] = useState<Vendedor>({
    idVdr: '',
    nDoc: '',
    nomVdr: ''
  });

  interface HandleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleChange = (e: HandleChangeEvent): void => {
    const { name, value } = e.target;
    setGestorSeleccion({
      ...gestorSeleccion,
      [name]: value
    });
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const abrirCerrarModalInsertar = () => {
    if (!modalInsertar) {
      setGestorSeleccion({ idVdr: '', nDoc: '', nomVdr: '' });
    }
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const peticionGet = async () => {
      setLoading(true);
      getVendedores()
      .then(response => {
        setData(response.data as Vendedor[]);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error("Error al obtener los datos:", error);
        showSnackbar("Error al cargar los vendedores", "error");
      })
  };

  const peticionPost = async () => {
    try {
      const vendedorData = { ...gestorSeleccion };
      delete vendedorData.idVdr;

      
      const response = await axios.post(baseUrl, vendedorData);
      setData([...data, response.data as Vendedor]);
      abrirCerrarModalInsertar();
      showSnackbar("Vendedor creado exitosamente", "success");
    } catch (error) {
      console.error("Error al insertar el registro:", error);
      showSnackbar("Error al crear el vendedor", "error");

    }
  };

  const peticionPut = async () => {
    try {
      const vendedorData = { 
        ...gestorSeleccion, 
        idVdr: gestorSeleccion.idVdr !== undefined ? parseInt(String(gestorSeleccion.idVdr)) : undefined 
      };
      
      const response = await axios.put(`${baseUrl}/${vendedorData.idVdr}`, vendedorData);
      const respuesta = response.data as Vendedor;
      
      setData(data.map(vendedor => 
        vendedor.idVdr === gestorSeleccion.idVdr 
          ? { ...vendedor, nDoc: respuesta.nDoc, nomVdr: respuesta.nomVdr }
          : vendedor
      ));
      
      abrirCerrarModalEditar();
      showSnackbar("Vendedor actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error al editar el registro:", error);
      showSnackbar("Error al actualizar el vendedor", "error");
    }
  };

  const seleccionarGestor = (vendedor: Vendedor, caso: string): void => {
    setGestorSeleccion(vendedor);
    if (caso === "Editar") {
      abrirCerrarModalEditar();
    }
  };

  useEffect(() => {
    peticionGet();
  }, []);

  const getEstadoChip = (estado?: number) => {
    return (
      <Chip
        label={estado ? "Sí" : "No"}
        color={estado ? "success" : "default"}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="primary.main" fontWeight="bold">
          Gestión de Vendedores
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Sistema de administración de vendedores
        </Typography>
      </Box>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" color="text.primary">
              Lista de Vendedores
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={abrirCerrarModalInsertar}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 3
              }}
            >
              Nuevo Vendedor
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID 2</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>N° Documento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Líder</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography>Cargando...</Typography>
                    </TableCell>
                  </TableRow>
                ) : Array.isArray(data) && data.length > 0 ? (
                  data.map((vendedor) => (
                    <TableRow 
                      key={vendedor?.idVdr ?? `${vendedor.nDoc}-${Math.random()}`}
                      hover
                      sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) } }}
                    >
                      <TableCell>{vendedor.idVdr}</TableCell>
                      <TableCell>{vendedor.nDoc}</TableCell>
                      <TableCell>{vendedor.nomVdr}</TableCell>
                      <TableCell>{getEstadoChip(vendedor.ibLider)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton
                          color="primary"
                          onClick={() => seleccionarGestor(vendedor, "Editar")}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">No hay vendedores registrados</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal para insertar nuevo vendedor */}
      <Dialog 
        open={modalInsertar} 
        onClose={abrirCerrarModalInsertar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6">Nuevo Vendedor</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="N° Documento"
              name="nDoc"
              value={gestorSeleccion.nDoc}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Nombre del Vendedor"
              name="nomVdr"
              value={gestorSeleccion.nomVdr}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={abrirCerrarModalInsertar}
            startIcon={<CancelIcon />}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={peticionPost} 
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ textTransform: 'none' }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar vendedor */}
      <Dialog 
        open={modalEditar} 
        onClose={abrirCerrarModalEditar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6">Editar Vendedor</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="ID"
              name="idVdr"
              value={gestorSeleccion?.idVdr || ''}
              fullWidth
              variant="outlined"
              disabled
            />
            <TextField
              label="N° Documento"
              name="nDoc"
              value={gestorSeleccion?.nDoc || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Nombre del Vendedor"
              name="nomVdr"
              value={gestorSeleccion?.nomVdr || ''}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={abrirCerrarModalEditar}
            startIcon={<CancelIcon />}
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={peticionPut} 
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ textTransform: 'none' }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;