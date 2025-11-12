import { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE": {
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    }
    case "INC": {
      return {
        ...state,
        items: state.items.map(i => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i)),
      };
    }
    case "DEC": {
      return {
        ...state,
        items: state.items
          .map(i => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter(i => i.qty > 0),
      };
    }
    case "CLEAR": {
      return { items: [] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const totals = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.07;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      totals,
      add: (item) => dispatch({ type: "ADD", item }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      inc: (id) => dispatch({ type: "INC", id }),
      dec: (id) => dispatch({ type: "DEC", id }),
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state.items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


