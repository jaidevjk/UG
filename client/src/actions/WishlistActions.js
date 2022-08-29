import { trackPromise } from "react-promise-tracker";
import { toast } from "react-toastify";
toast.configure();

export const addItemToWishlist =
  (id, count, cost, image, name) => async (dispatch, getState) => {
    var items = localStorage.getItem("wishListItem")
      ? [...JSON.parse(localStorage.getItem("wishListItem"))]
      : [];

    const filter = items.filter((val) => val.id === id);
    // console.log("calling", name);
    if (filter.length === 0) {
      items.push({ id, count, cost, image, name });
      localStorage.setItem("wishListItem", JSON.stringify(items));
      toast.success("Product Added To wishlist, Continue Shopping");
    } else {
      toast.error("Item already added checkout");
    }
  };

export const removeFromWishList = (id) => async (dispatch) => {
  var items = localStorage.getItem("wishListItem")
    ? [...JSON.parse(localStorage.getItem("wishListItem"))]
    : [];
  const filter = items.filter((val) => val.id !== id);
  localStorage.setItem("wishListItem", JSON.stringify(filter));
};

export const updateWishListCount = (id) => async (dispatch) => {
  var items = localStorage.getItem("wishListItem")
    ? [...JSON.parse(localStorage.getItem("wishListItem"))]
    : [];
  const filter = items.filter((val) => val.id !== id);
  localStorage.setItem("wishListItem", JSON.stringify(filter));
};
