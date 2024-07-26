import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Layout.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Shop from './components/Shop/Shop.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Cart from './components/Cart/cart.jsx'

const router = createBrowserRouter ([
  {
    path:'/',
    element:<App/>, 

    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"shop",
        element:<Shop/>
      },
      {
        path:"about",
        element:<About/>
      },
      {
        path:"contact",
        element:<Contact/>
      },
      {
        path:"cart",
        element:<Cart/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider  router={router}/>
  </React.StrictMode>,
)
