import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'styled-components';

import theme from "./styles/theme";
import GlobalStyles from './styles/global';

import { register } from "swiper/element/bundle";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Routes } from './routes';

import { AuthProvider } from "./hooks/auth";
import { ProductsProvider } from "./hooks/products";

register();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={ theme }>
      <GlobalStyles />
      <AuthProvider>
        <ProductsProvider>
          <Routes />
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)