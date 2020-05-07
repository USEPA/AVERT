import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import {
  usePanelState,
  toggleModalOverlay,
  storeActiveModal,
  resetActiveModal,
} from 'app/redux/reducers/panel';
// styles
import './styles.css';

type Props = {
  id: number;
  children: React.ReactNode;
};

function Tooltip({ id, children }: Props) {
  const dispatch = useDispatch();
  const activeModalId = usePanelState(({ activeModalId }) => activeModalId);
  const closingModalId = usePanelState(({ closingModalId }) => closingModalId);

  const closeLinkRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    if (closeLinkRef.current) closeLinkRef.current.focus();
  }, [closeLinkRef]);

  return (
    <span>
      <a
        href="/"
        className="avert-modal-link"
        onClick={(ev) => {
          ev.preventDefault();
          dispatch(storeActiveModal(id));
          dispatch(toggleModalOverlay());
        }}
      >
        info
      </a>

      <span
        className="avert-modal"
        data-modal-id={id}
        data-active={activeModalId === id}
        data-closing={closingModalId === id}
      >
        <a
          className="avert-modal-close"
          href="/"
          ref={closeLinkRef}
          onClick={(ev) => {
            ev.preventDefault();
            dispatch(resetActiveModal(id));
            dispatch(toggleModalOverlay());
          }}
        >
          ×
        </a>

        {children}
      </span>
    </span>
  );
}

export default Tooltip;
