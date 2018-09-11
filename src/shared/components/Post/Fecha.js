import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import styled from 'styled-components';
import fecha from 'fecha';

const Fecha = ({ creationDate }) => {
  const date = new Date(creationDate).getTime();

  return <Container>{fecha.format(date, 'DD/MM/YYYY [-] HH:mm')}</Container>;
};

Fecha.propTypes = {
  creationDate: PropTypes.number.isRequired,
};

export default inject(({ stores: { connection } }, { type, id }) => ({
  creationDate: connection.entity(type, id).creationDate,
}))(Fecha);

const Container = styled.span`
  font-weight: 500;
  font-size: 0.8rem;
`;
