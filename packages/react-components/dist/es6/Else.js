import { Children } from 'react';
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
export const Else = ({
  children,
  elseView
}) => {
  const arr = [];
  Children.forEach(children, item => {
    item && arr.push(item);
  });

  if (arr.length > 0) {
    return _jsx(_Fragment, {
      children: arr
    });
  }

  return _jsx(_Fragment, {
    children: elseView
  });
};
Else.displayName = 'KAFElse';