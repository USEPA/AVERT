import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
// ---
import { selectState } from 'app/redux/reducers/geography';
import { useSelectedState } from 'app/hooks';
import { StateId, states } from 'app/config';

export function StatesList() {
  const dispatch = useDispatch();

  const selectedStateId = useSelectedState()?.id;

  return (
    <select
      className={
        `usa-select ` + //
        `margin-top-3 margin-bottom-0 margin-x-auto width-full`
      }
      aria-label="Select State"
      value={selectedStateId || ''}
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
