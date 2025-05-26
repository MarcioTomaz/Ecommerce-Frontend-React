import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "../Pages/Home.jsx";
import PageNotFound from "../components/errorPage/PageNotFound.jsx";
import Login from "../Pages/login/Login.jsx";
import Register from "../Pages/Register/Register.jsx";
import ClientProfile from "../Pages/client/ClientProfile.jsx";
import AddressList from "../Pages/address/AddressList.jsx";
import AddressEdit from "../Pages/address/AddressEdit.jsx";
import {ROUTES} from "./URLS.jsx";
import AddressRegister from "../Pages/address/AddressRegister.jsx";
import CardList from "../Pages/Card/CardList.jsx";
import CardRegister from "../Pages/Card/CardRegister.jsx";
import ProductList from "../Pages/Product/ProductList.jsx";
import ProductDetail from "../Pages/Product/ProductDetail.jsx";
import AppHeader from "../components/header/AppHeader.jsx";
import CartDetails from "../Pages/Cart/CartDetails.jsx";
import Checkout from "../Pages/Order/Checkout.jsx";
import OrderClientList from "../Pages/client/OrderClientList.jsx";
import OrderDetails from "../Pages/Order/OrderDetails.jsx";
import PaymentStep from "../Pages/Order/OrderPayment.jsx";
import AdmProfile from "../Pages/Adm/AdmProfile.jsx";
import AdmOrderList from "../Pages/Adm/AdmOrderList.jsx";

const RouteService = () => {
    return (
        <>
            <BrowserRouter>
                <AppHeader/>
                <Routes>
                    <Route path={ROUTES.HOME} element={<Home/>}/>
                    <Route path={ROUTES.HOME_ALT} element={<Home/>}/>

                    <Route path={ROUTES.LOGIN} element={<Login/>}/>
                    <Route path={ROUTES.REGISTER} element={<Register/>}/>

                    <Route path={ROUTES.PROFILE} element={<ClientProfile/>}/>

                    <Route path={ROUTES.ADDRESS_REGISTER} element={<AddressRegister/>}/>
                    <Route path={ROUTES.ADDRESS_LIST} element={<AddressList/>}/>
                    <Route path={ROUTES.ADDRESS_UPDATE} element={<AddressEdit/>}/>

                    <Route path={ROUTES.CARD_LIST} element={<CardList/>} />
                    <Route path={ROUTES.CARD_REGISTER} element={<CardRegister/>} />

                    <Route path={ROUTES.PRODUCT_LIST} element={<ProductList/>} />

                    <Route path={ROUTES.PRODUCT_DETAILS} element={<ProductDetail/>}/>

                    <Route path={ROUTES.CART_DETAILS} element={<CartDetails />}/>

                    <Route path={ROUTES.CHECKOUT} element={<Checkout />}/>
                    <Route path={ROUTES.ORDER_PAYMENT} element={<PaymentStep />} />

                    <Route path={ROUTES.ORDER_LIST} element={<OrderClientList />}/>

                    <Route path={ROUTES.ORDER_DETAILS} element={<OrderDetails />} />

                    {/*ADM PAGES*/}
                    <Route path={ROUTES.ADM_PROFILE} element={<AdmProfile/>}></Route>
                    <Route path={ROUTES.ADM_ORDER_LIST} element={<AdmOrderList />} />


                    <Route path="*" element={<PageNotFound />} />
                </Routes>

            </BrowserRouter>
        </>
    )
}

export default RouteService;