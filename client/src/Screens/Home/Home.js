/* eslint-disable no-unused-vars */
import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeItem from "./HomeItem";

const Home = (props) => {
    const category = useSelector((state) => state.category);
    // eslint-disable-next-line no-unused-vars
    const { loading, listCategory } = category;

    return (
        <>
            <div className="outstanding-shoes">
                <ul>
                    {loading ? (
                        <span className="loading">Loading...</span>
                    ) : (
                            <>
                                {listCategory &&
                                    listCategory.slice(0, 4).map((item, index) => (
                                        <li key={index}>
                                            <div className="one-product-home-outstanding">
                                                <img src={item.image} alt={item.slug} />
                                                <div className="grade-level-outstanding" />
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "red",
                                                        fontWeight: "bold",
                                                        fontSize: "25px",
                                                    }}
                                                    to={`/the-loai/${item.slug}`}
                                                    className="name-outstanding"
                                                >
                                                    {item.name}
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                            </>
                        )}
                </ul>
            </div>
            {/* outstanding-shoes */}
            {
                listCategory && listCategory.slice(0, 2).map((item, index) => (
                    <HomeItem item={item} key={index} />
                ))
            }
            <div className="free-shipper-in-page-home">
                <img src="./banner-top.webp" alt="free-shipper" />
                <div className="info-shipper-home">
                    <p>Miễn phí vận chuyển</p>
                    <br />
                    <span>
                        Miễn phí 2 ngày vận chuyển với đơn hàng trên 800k trừ trực tiếp khi
                        thanh toán{""}
                    </span>
                </div>
            </div>
            {/* free-shipper-in-page-home */}
            {listCategory &&
                listCategory
                    .slice(2, 4)
                    .map((item, index) => <HomeItem item={item} key={index} />)}
        </>
    );
};

export default Home;
