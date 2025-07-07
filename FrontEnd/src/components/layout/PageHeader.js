// src/components/layout/PageHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PageHeader
 *
 * @param {Object}   props
 * @param {React.Component} [props.icon]       — optional icon component (rendered before the title)
 * @param {string}           props.title      — main heading text
 * @param {string}           [props.subtitle] — optional sub‐heading
 * @param {Array<{label:string,to?:string}>}
 *                            [props.breadcrumbs] — list of crumbs; omit `to` on the last one to mark current page
 * @param {Array<{label:string,to:string,variant?:string}>}
 *                            [props.actions]     — buttons to render in the top-right
 */
export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  breadcrumbs = [],
  actions = []
}) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <li
                    key={i}
                    className={`breadcrumb-item${isLast ? ' active' : ''}`}
                    {...(isLast ? { 'aria-current': 'page' } : {})}
                  >
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to}>{crumb.label}</Link>
                    ) : (
                      crumb.label
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {subtitle && (
          <div className="d-flex align-items-center mb-3">
            {Icon && <Icon className="me-2 text-primary fs-3" />}
            <span className="fw-bold fs-4 text-dark">{subtitle}</span>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="d-flex">
          {actions.map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className={`btn btn-${action.variant || 'primary'} ms-2`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

PageHeader.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      variant: PropTypes.string
    })
  )
};
