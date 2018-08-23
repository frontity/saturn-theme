import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import Waypoint from 'react-waypoint';
import styled from 'react-emotion';
import Spinner from '../../../shared/components/Spinner';
import Icon from './Icon';

const FetchWaypoint = ({
  limit,
  fetching,
  totalPages,
  lastInColumn,
  columnLength,
  isSelectedColumn,
  getNextPage,
  loadMore,
}) => {
  if (fetching)
    return (
      <Container>
        <Spinner />
      </Container>
    );

  if (!totalPages || !lastInColumn || lastInColumn === totalPages) return null;

  if (!isSelectedColumn) return <Container />;

  return (
    <Container>
      {!limit || columnLength < limit ? (
        <Waypoint
          onEnter={getNextPage}
          bottomOffset={-500}
          scrollableAncestor="window"
        />
      ) : (
        <LoadButton onClick={getNextPage}>
          <Icon />
          {loadMore}
        </LoadButton>
      )}
    </Container>
  );
};

FetchWaypoint.propTypes = {
  limit: PropTypes.number,
  fetching: PropTypes.bool.isRequired,
  totalPages: PropTypes.number,
  lastInColumn: PropTypes.number,
  columnLength: PropTypes.number.isRequired,
  isSelectedColumn: PropTypes.bool.isRequired,
  getNextPage: PropTypes.func.isRequired,
  loadMore: PropTypes.string.isRequired,
};

FetchWaypoint.defaultProps = {
  limit: null,
  totalPages: null,
  lastInColumn: null,
};

export default inject(
  ({ stores: { connection, theme } }, { type, id, columnId }) => ({
    fetching: connection.list(type, id).isFetching,
    totalPages: connection.list(type, id).total.pages,
    lastInColumn:
      connection.selectedColumn.items[
        connection.selectedColumn.items.length - 1
      ].page,
    isSelectedColumn: connection.selectedContext.getColumn(columnId).isSelected,
    loadMore: theme.lang.get('loadMore'),
    getNextPage: theme.getNextPage,
  }),
)(FetchWaypoint);

const Container = styled.div`
  box-sizing: border-box;
  height: 80px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
`;

const LoadButton = styled.button`
  height: 60px;
  padding: 0 25px;
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.altText};
  background-color: ${({ theme }) => theme.colors.altBackground};
  display: flex;
  align-items: center;
  justify-content: center;
`;
