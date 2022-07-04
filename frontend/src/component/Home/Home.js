import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg';
import "./Home.css";
import Product from "./Product.js";
import MetaData from '../layout/MetaData';
import { getProduct } from '../../actions/productAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import {useAlert} from "react-alert";

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products, productsCount } = useSelector(state => state.products);

    useEffect(() => {
        console.log(`Error in Home.JS >> ${error}`);
        if (error) {
            return alert.error(error);
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title="ECOMMERCE" />
                    <div className='banner'>
                        <p>Welcome to ECommerce</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>
                        <a href="#container">
                            <button>
                                Scroll <CgMouse />
                            </button>
                        </a>
                    </div>
                    <h2 className='homeHeading'>Featured Products</h2>
                    <div className="container" id="container">
                        {products &&
                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}
                    </div>
                </Fragment>
            )}
        </Fragment>

    );
}

export default Home