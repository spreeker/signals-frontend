/**
 *
 * IncidentContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { makeSelectIsAuthenticated } from 'containers/App/selectors';
import wizardDefinition from '../../definitions/wizard';
import { getClassification, updateIncident, createIncident } from './actions';
import makeSelectIncidentContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import IncidentWizard from '../../components/IncidentWizard';

export class IncidentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.getClassification = this.props.getClassification.bind(this);
    this.updateIncident = this.props.updateIncident.bind(this);
    this.createIncident = this.props.createIncident.bind(this);
  }

  render() {
    return (
      <div className="incident-container">
        <div className="incident-container__alert">
          <b>Overlast van horeca of een evenement melden?</b><br />
          Bij spoed: bel 14 020 (dag en nacht), of geef uw melding hier door en vul uw contactgegevens in. Wij kunnen u dan sneller helpen.</div>
        <IncidentWizard
          wizardDefinition={wizardDefinition}
          getClassification={this.getClassification}
          updateIncident={this.updateIncident}
          createIncident={this.createIncident}
          incidentContainer={this.props.incidentContainer}
          isAuthenticated={this.props.isAuthenticated}
        />
      </div>
    );
  }
}

IncidentContainer.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
  incidentContainer: makeSelectIncidentContainer(),
  isAuthenticated: makeSelectIsAuthenticated()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  getClassification,
  updateIncident,
  createIncident
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentContainer', reducer });
const withSaga = injectSaga({ key: 'incidentContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(IncidentContainer);
