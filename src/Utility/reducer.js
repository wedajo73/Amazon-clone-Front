import { Type } from "./action.types";

export const initialState = {
  basket: [],
};

export const reducer = (state, action) => {
  switch (action.type) {
    case Type.ADD_TO_BASKET:
      // Check if the item already exists in the basket
      // eslint-disable-next-line no-case-declarations
      const existingItem = state.basket.find(
        (item) => item.id === action.item.id
      );

      if (!existingItem) {
        // If item doesn't exist, add it with an initial amount of 1
        return {
          ...state,
          basket: [...state.basket, { ...action.item, amount: 1 }],
        };
      } else {
        // If item exists, update its amount
        const updatedBasket = state.basket.map((item) =>
          item.id === action.item.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );

        return {
          ...state,
          basket: updatedBasket,
        };
      }

    case Type.REMOVE_FROM_BASKET:
      // eslint-disable-next-line no-case-declarations
      const index = state.basket.findIndex((item) => item.id === action.id);
      // eslint-disable-next-line no-case-declarations
      let newBasket = [...state.basket];

      if (index !== -1) {
        // If the item's amount is greater than 1, decrease the amount
        if (newBasket[index].amount > 1) {
          newBasket[index] = {
            ...newBasket[index],
            amount: newBasket[index].amount - 1,
          };
        } else {
          // Otherwise, remove the item from the basket
          newBasket.splice(index, 1);
        }
      }

      return {
        ...state,
        basket: newBasket,
      };

    default:
      return state;
  }
};

// Usage example in React component:
// const [state, dispatch] = useReducer(reducer, initialState);

// Example of dispatching actions:
// dispatch({
//   type: Type.ADD_TO_BASKET,
//   item: { id: 1, name: "Item 1", price: 10 },
// });
