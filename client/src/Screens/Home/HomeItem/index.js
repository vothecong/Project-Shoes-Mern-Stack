import React from "react";
import { Link } from "react-router-dom";
import { convertPrice } from "../../../HOC/Help";
// eslint-disable-next-line no-unused-vars
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import "./index.css";
// eslint-disable-next-line no-unused-vars
import { getProductHomeAction } from "../../../Actions/productAction";

function HomeItem(props) {
    const { item } = props;
    // eslint-disable-next-line no-unused-vars
    const [list, setList] = React.useState([]);
    const product = useSelector((state) => state.product);
    // eslint-disable-next-line no-unused-vars
    const { loadingHome, listProduct } = product;

    const handleShowRating = (totalReview, totalStar) => {
        if (totalStar > 0) {
            const arr = [];
            for (let i = 1; i <= Math.ceil(totalStar / totalReview); i++) {
                arr.push(<AiFillStar fontSize={24} />);
            }
            for (let k = 1; k <= 5 - Math.ceil(totalStar / totalReview); k++) {
                arr.push(<AiOutlineStar fontSize={24} />);
            }
            return arr;
        } else {
            return (
                <>
                    <AiOutlineStar fontSize={24} />
                    <AiOutlineStar fontSize={24} />
                    <AiOutlineStar fontSize={24} />
                    <AiOutlineStar fontSize={24} />
                    <AiOutlineStar fontSize={24} />
                </>
            )
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleShowProduct = (products, item) => {
        // eslint-disable-next-line array-callback-return
        const data = [];
        const result = products.filter((x) => x.categoryID._id === item._id);
        if (result) {
            data.push(result);
        }

        return (
            <>
                {data &&
                    data[0].slice(0, 8).map((x, index) => (
                        <li key={index} style={{ margin: "5px 12px" }} >
                            <div className="product-safe-off-page-home">
                                <Link to={`/chi-tiet/${item.slug}/${x.slug}`}>
                                    <img src={x.images[0].img} alt={x.slug} />
                                </Link>
                                <p className="name-by-product-safe-off-page-home">
                                    {x.name}
                                </p>
                                <div className="star-by-product-in-home">
                                    {handleShowRating(x.totalReview, x.totalStar)}
                                </div>
                                {/* star-by-product-in-home */}
                                <div className="price-by-product-in-home">
                                    {convertPrice(x.price)}
                                </div>
                            </div>
                            {/* product-safe-off-page-home */}
                        </li>
                    ))}
            </>
        );
    };

    return (
        <div className="home">
            <div className="type-shoes-home">
                <div className="title-shoes-home">
                    <p className="name-title-page-home">{item?.name}</p>
                    {/* name-title-page-home */}
                    <p className="dotted-title-home" />
                </div>
                {/* title-shoes-home */}
            </div>
            {/* type-shoes-home */}
            <div className="list-product-safe-off-page-home">
                <ul style={{ justifyContent: "normal" }} >
                    {loadingHome ? (
                        <div>Loading....</div>
                    ) : (
                            <>
                                {listProduct && handleShowProduct(listProduct, item)}
                            </>
                        )}
                    {/* end li */}
                </ul>
                <Link to={`/the-loai/${item.slug}`} className="see-more-products-page-home">
                    xem thêm sản phẩm{" "}
                </Link>
            </div>
            {/* list-product-safe-off-page-home */}
        </div>
    );
}
export default HomeItem;
