import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import { isMatch } from 'lodash';
import { Slot } from 'react-slot-fill';
import styled from 'styled-components';

const SlotInjector = ({
  slots,
  position,
  item,
  isAboveTheFold,
  debug,
  render,
  ...fillChildProps
}) => (
  <Fragment>
    {debug ? (
      <SlotMock>
        {position}
        {': '}
        <Span>
          {slots
            .filter(
              slot =>
                slot.position === position &&
                slot.rules.item.some(i => isMatch(item, i)),
            )
            // keep in mind fillChildProps={fillChildProps}
            .map(({ names }) => names.join(', '))
            .join(', ')}
        </Span>
      </SlotMock>
    ) : (
      render({
        slots: slots
          .filter(
            slot =>
              slot.position === position &&
              slot.rules &&
              slot.rules.item &&
              slot.rules.item.some(i => isMatch(item, i)),
          )
          .map(({ names }) =>
            names.map(name => (
              <Slot
                key={name}
                name={name}
                fillChildProps={{
                  slotName: name,
                  slotPosition: position,
                  item,
                  isAboveTheFold,
                  ...fillChildProps,
                }}
              />
            )),
          ),
      })
    )}
  </Fragment>
);

export default inject(({ stores: { settings } }) => ({
  slots: settings.theme.slots || [],
}))(SlotInjector);

SlotInjector.propTypes = {
  debug: PropTypes.bool,
  slots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  position: PropTypes.string.isRequired,
  item: PropTypes.shape({
    type: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    page: PropTypes.number,
    mstId: PropTypes.string,
  }),
  isAboveTheFold: PropTypes.bool,
  render: PropTypes.func,
};

SlotInjector.defaultProps = {
  debug: false,
  item: {},
  isAboveTheFold: false,
  render: ({ slots }) => slots,
};

const SlotMock = styled.div`
  font-size: 20px;
  background: blue;
  color: yellow;
`;

const Span = styled.span`
  font-weight: bold;
  color: white;
`;
