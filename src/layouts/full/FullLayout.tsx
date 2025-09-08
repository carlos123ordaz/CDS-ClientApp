import { FC } from 'react';
import { styled, Container, Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router';
import Sidebar from './vertical/sidebar/Sidebar';
import Header from './vertical/header/Header';
import Topbar from './vertical/header/Topbar';


const MainWrapper = styled('div')(() => ({}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const FullLayout: FC = () => {
  const theme = useTheme();

  return (
    <div>
      <>
        <MainWrapper>
          <Topbar />
          {<Header />}
          <Sidebar />
          <PageWrapper
            className="page-wrapper"
            sx={{
              ...({
                [theme.breakpoints.up('lg')]: {
                  ml: `256px`,
                  padding:'10px'
                },
              }),

            }}
          >
            <Outlet />
          </PageWrapper>
        </MainWrapper>
      </>
    </div>
  );
};
export default FullLayout;
