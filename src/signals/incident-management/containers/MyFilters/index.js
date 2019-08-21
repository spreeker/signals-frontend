import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
// import { Row, Column } from '@datapunt/asc-ui';

import { makeSelectAllFilters, makeSelectRemovedFilter } from '../IncidentOverviewPage/selectors';
import { applyFilter, removeFilter, revertFilter } from '../IncidentOverviewPage/actions';

import FilterItem from './components/FilterItem';

import './style.scss';

export const MyFilters = ({ allFilters, removedFilter, onApplyFilter, onRemoveFilter, onRevertFilter, onClose }) => (
  <div className="my-filters">
    {removedFilter && removedFilter.name ? <div className="my-filters__removed-filter">
      De filterinstelling &ldquo;{removedFilter.name}&rdquo; is verwijderd.
      <button className="my-filters__revert-button" type="button" onClick={() => onRevertFilter(removedFilter)}>Ongedaan maken</button>
    </div> : ''}

    {allFilters && allFilters.map((filter) => (
      <FilterItem
        key={filter._links.self.href}
        filter={filter}
        onApplyFilter={onApplyFilter}
        onRemoveFilter={onRemoveFilter}
        onClose={onClose}
      />
    ))}
  </div>
);

MyFilters.propTypes = {
  allFilters: PropTypes.array.isRequired,
  removedFilter: PropTypes.object,
  onApplyFilter: PropTypes.func.isRequired,
  onRevertFilter: PropTypes.func.isRequired,
  onRemoveFilter: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allFilters: makeSelectAllFilters,
  removedFilter: makeSelectRemovedFilter,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onApplyFilter: applyFilter,
      onRemoveFilter: removeFilter,
      onRevertFilter: revertFilter,
    },
    dispatch,
  );

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withConnect(MyFilters);
