/** @jsxImportSource @emotion/react */

import { Fragment } from 'react';
import { css } from '@emotion/react';
import { useDispatch } from 'react-redux';
// reducers
import { selectState } from 'app/redux/reducers/geography';
// hooks
import { useSelectedState } from 'app/hooks';
// config
import { StateId, states } from 'app/config';

const selectStyles = css`
  margin: 1.5rem 25% 0;
  width: 50%;
`;

function StatesList() {
  const dispatch = useDispatch();

  const selectedStateId = useSelectedState()?.id;

  return (
    <select
      css={selectStyles}
      aria-label="Select State"
      value={!selectedStateId ? '' : selectedStateId}
      onChange={(ev) => dispatch(selectState(ev.target.value as StateId))}
      data-avert-state-select
    >
      <option value={''} disabled>
        Select State
      </option>

      {Object.keys(states).map((stateId) => {
        return (
          <Fragment key={stateId}>
            <option value={stateId}>{states[stateId as StateId].name}</option>
          </Fragment>
        );
      })}
    </select>
  );
}

export default StatesList;
