import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: localStorage.getItem("carts")
    ? JSON.parse(localStorage.getItem("carts"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productName, image, price, quantity, discount } = action.payload;
      const existingItem = state.items.findIndex(
        (item) => item.productName === productName
      );
      if (existingItem >= 0) {
        state.items[existingItem].quantity += quantity;
      } else {
        state.items.push({ productName, image, price, quantity, discount });
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },

    changeQuantity(state, action) {
      const { productName, quantity } = action.payload;
      const existingItem = state.items.findIndex(
        (item) => item.productName === productName
      );
      if (quantity > 0) {
        state.items[existingItem].quantity = quantity;
      } else {
        state.items = state.items.filter(
          (item) => item.productName !== productName
        );
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },

    // Thay đổi trạng thái 'selected'
    toggleSelect(state, action) {
      const { productName } = action.payload;
      const existingItem = state.items.findIndex(
        (item) => item.productName === productName
      );
      if (existingItem >= 0) {
        state.items[existingItem].selected =
          !state.items[existingItem].selected; // Đảo ngược trạng thái selected
      }
      localStorage.setItem("carts", JSON.stringify(state.items));
    },
  },
});

export const { addToCart, changeQuantity, toggleSelect } = cartSlice.actions;
export default cartSlice.reducer;
