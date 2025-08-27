import React from "react";

export const navigationRef = React.createRef();

// const navigate = (name, params) => {
//   navigationRef.current?.navigate(name, params);
// };

// export default { navigate };

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    // Perform navigation if the react navigation is ready to handle actions
    navigationRef.current?.navigate(name, params);  
  } else {
    // You can decide what to do if react navigation is not ready
    // You can ignore this, or add these actions to a queue you can call later
  }
}