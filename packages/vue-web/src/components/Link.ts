import React from 'react';
import {h} from 'vue';
import {MetaData} from '../sington';

export interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  replace?: boolean;
}

function isModifiedEvent(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default function (props: Props, context: {slots: any}) {
  const {onClick, replace, ...rest} = props;
  const {target} = rest;
  const newProps = {
    ...rest,
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      try {
        onClick && onClick(event);
      } catch (ex) {
        event.preventDefault();
        throw ex;
      }
      if (
        !event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore everything but left clicks
        (!target || target === '_self') && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault();
        replace ? MetaData.router.replace(rest.href!) : MetaData.router.push(rest.href!);
      }
    },
  };
  return h('a', newProps, context.slots);
}