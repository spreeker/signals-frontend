/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const PAGE_NUMBER_PADDING = 2;

class Pager extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onPageChanged = this.onPageChanged.bind(this);
  }

  onPageChanged(page) {
    this.props.onPageChanged(page);
  }

  render() {
    const currentPage = this.props.page;
    const totalPages = Math.floor(this.props.itemCount / 100) + 1;
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    let showDots = true;
    const pages = [...Array(totalPages).keys()].map(page => {
      const i = page + 1;

      if (
        Math.abs(currentPage - i) <= PAGE_NUMBER_PADDING ||
        i <= PAGE_NUMBER_PADDING + 1 ||
        i >= totalPages - PAGE_NUMBER_PADDING
      ) {
        showDots = true;
        return currentPage === i ? (
          <span role="presentation" key={i} className="pager_step huidige">
            <strong>{i}</strong>
          </span>
        ) : (
          <a
            role="presentation"
            key={i}
            className="pager_step pagina"
            onClick={() => this.onPageChanged(i)}>
            {i}
          </a>
        );
      }
      if (showDots) {
        showDots = false;
        return (
          <span role="presentation" key={i} className="pager_step puntjes">
            <strong>...</strong>
          </span>
        );
      }

      return '';
    });

    return (
      <div className="list-pager" data-testid="overviewPagerComponent">
        <div className="pager">
          {hasPrevious ? (
            <a
              role="presentation"
              className="pager_nav vorige"
              onClick={() => this.onPageChanged(currentPage - 1)}>
              vorige
            </a>
          ) : null}
          {pages.length > 1 ? pages : ''}
          {hasNext ? (
            <a
              role="presentation"
              className="pager_nav volgende"
              onClick={() => this.onPageChanged(currentPage + 1)}>
              volgende
            </a>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

Pager.propTypes = {
  page: PropTypes.number,
  onPageChanged: PropTypes.func.isRequired,
  itemCount: PropTypes.number,
};

Pager.defaultProps = {
  itemCount: 0,
  page: 1,
};

export default Pager;