import {
  FETCH_WISHLIST_ITEMS,
  DELETE_WISHLIST_ITEM,
  ADD_PRODUCT_TO_WISHLIST,
} from "../actions/type";

export default (state = { wishListItem: [] }, action) => {
  switch (action.type) {
    case FETCH_WISHLIST_ITEMS:
      const item = action.payload;
      const isItemExist = state.wishListItem.find(
        (val) => val._id === item._id
      );

      if (isItemExist) {
        return {
          ...state,
          wishListItem: state.wishListItem.map((i) =>
            i._id === isItemExist._id ? item : i
          ),
        };
      } else {
        return { ...state, wishListItem: [...state.wishListItem, item] };
      }

    case ADD_PRODUCT_TO_WISHLIST:
      const data = action.payload;
      console.log(data);
      return localStorage.setItem(
        "wishListItem",
        JSON.stringify({
          ...state,
          wishListItem: [...state.wishListItem, data],
        })
      );

    case DELETE_WISHLIST_ITEM:
      return {
        ...state,
        wishListItem: state.wishListItem.filter(
          (i) => i._id !== action.payload
        ),
      };

    default:
      return state;
  }
};
