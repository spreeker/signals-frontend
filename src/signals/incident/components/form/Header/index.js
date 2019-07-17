import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Validators } from 'react-reactive-form';
import get from 'lodash.get';

import { MessageDescriptor } from 'translations/propTypes';
import './style.scss';
import flattenObject from '../../../services/object-flatten';


const Header = ({ meta, options, touched, hasError, getError, children, parent }) => {
  const {
    label,
    subtitle,
  } = meta;

  const incident = get(parent, 'meta.incident', {});
  const shallowValues = flattenObject(incident, '', ':');
  const isMessageDescriptor = label !== null && typeof label === 'object';

  return (
    <div className={`header ${touched && (hasError('required') || hasError('email') || hasError('maxLength') || hasError('custom')) ? 'header--invalid' : ''}`}>
      <div className="header__label">{
        isMessageDescriptor ?
          <FormattedMessage {...label} values={shallowValues} />
          : label
        }
        {(label && (!options || !options.validators)) || (options && options.validators && !options.validators.includes(Validators.required)) ?
          <span className="header--not-required">(optioneel)</span>
          : ''}
      </div>
      <div className="header__subtitle">{subtitle}</div>

      <div className="header__errors">
        <div className="header__errors__item">
          {touched
          && hasError('required')
          && 'Dit is een verplicht veld'}
        </div>

        <div className="header__errors__item">
          {touched
          && hasError('email')
          && 'Het moet een geldig e-mailadres zijn'}
        </div>

        <div className="header__errors__item">
          {touched
          && hasError('maxLength')
          && `U kunt maximaal ${getError('maxLength').requiredLength} tekens invoeren.`}
        </div>

        <div className="header__errors__item">
          {touched
          && hasError('custom')
          && getError('custom')}
        </div>
      </div>

      <div className="header__children">
        {children}
      </div>
    </div>
  );
};

Header.propTypes = {
  meta: PropTypes.shape({
    label: PropTypes.oneOfType([
      PropTypes.string,
      MessageDescriptor
    ]),
    subtitle: PropTypes.string,
  }),
  options: PropTypes.object,
  touched: PropTypes.bool,
  hasError: PropTypes.func,
  getError: PropTypes.func,
  children: PropTypes.object,
  parent: PropTypes.object
};

export default Header;
