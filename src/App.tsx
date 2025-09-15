import router from './routes/Router';
import { RouterProvider } from 'react-router';
import { CssBaseline } from '@mui/material';


function App() {

  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
