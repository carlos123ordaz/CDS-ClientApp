// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';

const FullLayout = lazy(() => import('../layouts/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/BlankLayout'));

const Dashboard = lazy(() => import("../views/dashboard/page"));
const OrderSaleCreate = lazy(() => import('../views/saleOrder/SaleRegister'));
const OrderSaleList = lazy(() => import('../views/saleOrder/SaleList'));
const OrderSaleDetails = lazy(() => import('../views/saleOrder/SeleDetails'));
const OrderSaleEdit = lazy(() => import('../views/saleOrder/SaleEdit'));
const OrderPurchaseCreate = lazy(() => import('../views/purchaseOrder/PurchaseRegister'));
const OrderPurchaseList = lazy(() => import('../views/purchaseOrder/PurchaseList'));
const OrderPurchaseDetails = lazy(() => import('../views/purchaseOrder/PurchaseDetails'));
const OrderPurchaseEdit = lazy(() => import('../views/purchaseOrder/PurchaseEdit'));
const VendorList = lazy(() => import('../views/user/UserList'));
const ProductList = lazy(() => import('../views/product/ProductList'));
const ServiceCreate = lazy(() => import('../views/service/ServiceCreate'));
const ServiceList = lazy(() => import('../views/service/ServiceList'));
const CustomerList = lazy(() => import('../views/customer/CustomerList'));
const ProjectCreate = lazy(() => import('../views/project/PorjectRegister'));
const ProjectList = lazy(() => import('../views/project/ProjectList'));
const Error = lazy(() => import('../views/authentication/NotFound'));
const Register = lazy(() => import('../views/authentication/Register'));
const Login = lazy(() => import('../views/authentication/Login'));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <Dashboard /> },
      { path: '/compras-crear', exact: true, element: <OrderPurchaseCreate /> },
      { path: '/compras-lista', exact: true, element: <OrderPurchaseList /> },
      { path: '/compras/:id', exact: true, element: <OrderPurchaseDetails /> },
      { path: '/compras-editar/:id/', exact: true, element: <OrderPurchaseEdit /> },
      { path: '/pedidos-crear', exact: true, element: <OrderSaleCreate /> },
      { path: '/pedidos-lista', exact: true, element: <OrderSaleList /> },
      { path: '/pedidos/:id', exact: true, element: <OrderSaleDetails /> },
      { path: '/pedidos-editar/:id', exact: true, element: <OrderSaleEdit /> },
      { path: '/usuarios-lista', exact: true, element: <VendorList /> },
      { path: '/productos-lista', exact: true, element: <ProductList /> },
      { path: '/servicios-crear', exact: true, element: <ServiceCreate /> },
      { path: '/servicios-lista', exact: true, element: <ServiceList /> },
      { path: '/clientes-lista', exact: true, element: <CustomerList /> },
      { path: '/proyectos-crear', exact: true, element: <ProjectCreate /> },
      { path: '/proyectos-lista', exact: true, element: <ProjectList /> },

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
