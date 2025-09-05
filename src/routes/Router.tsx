// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';

/* ***Layouts**** */
const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

/* ****Pages***** */
const Dashboard = lazy(() => import("../views/dashboard/page"));
const OrderCreate = lazy(() => import('../views/order/Create'));
const OrderList = lazy(() => import('../views/order/List'));
const OrderDetails = lazy(() => import('../views/order/Details'));
const OrderEdit = lazy(() => import('../views/order/Details'));

const VendorCreate = lazy(() => import('../views/vendor/Create'));
const VendorList = lazy(() => import('../views/vendor/List'));

const ProductCreate = lazy(() => import('../views/product/Create'));
const ProductList = lazy(() => import('../views/product/List'));


const ServiceCreate = lazy(() => import('../views/servicios/Create'));
const ServiceList= lazy(() => import('../views/servicios/ListServices'));

const Error = lazy(() => import('../views/authentication/NotFound'));
const Register = lazy(() => import('../views/authentication/Register'));
const Login = lazy(() => import('../views/authentication/Login'));
const TypographyPage = lazy(() => import('../views/utilities/TypographyPage'))
const Shadow = lazy(() => import('../views/utilities/Shadow'))

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '/order-create', exact: true, element: <OrderCreate /> },
      { path: '/order-list', exact: true, element: <OrderList /> },
      { path: '/order-details/:id', exact: true, element: <OrderDetails /> },
      { path: '/order-edit/:id', exact: true, element: <OrderEdit /> },

      { path: '/vendor-create', exact: true, element: <VendorCreate /> },
      { path: '/vendor-list', exact: true, element: <VendorList /> },

      { path: '/product-create', exact: true, element: <ProductCreate /> },
      { path: '/product-list', exact: true, element: <ProductList /> },

      { path: '/service-create', exact: true, element: <ServiceCreate /> },
      { path: '/service-list', exact: true, element: <ServiceList /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },

    ],
  },
  { basename: '/' }
];

const router = createBrowserRouter(Router);
export default router;
