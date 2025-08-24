import React from 'react';
import Privacy from '../pages/Privacy';

// Placeholder components for Terms, Support, and Changelog

import { useI18n } from '../../i18n';

const Terms = () => {
  const { t } = useI18n();
  return (
    <div className="container mt-4" style={{ direction: 'ltr', textAlign: 'left' }}>
      <h2 className="mb-4">{t('terms')}</h2>
      <p>{t('termsContent')}</p>
    </div>
  );
};

const Support = () => {
  const { t } = useI18n();
  return (
    <div className="container mt-4" style={{ direction: 'ltr', textAlign: 'left' }}>
      <h2 className="mb-4">{t('support')}</h2>
      <p>{t('supportContent')}</p>
    </div>
  );
};

const Changelog = () => {
  const { t } = useI18n();
  return (
    <div className="container mt-4" style={{ direction: 'ltr', textAlign: 'left' }}>
      <h2 className="mb-4">{t('whatsNew')} ({t('changelog')})</h2>
      <p>{t('changelogContent')}</p>
    </div>
  );
};

const modalContent = {
  privacy: { titleKey: 'privacy', Component: Privacy },
  terms: { titleKey: 'terms', Component: Terms },
  support: { titleKey: 'support', Component: Support },
  changelog: { titleKey: 'whatsNew', Component: Changelog },
};



export default function FooterModals({ show, type, onClose }) {
  const { t } = useI18n();
  if (!show || !modalContent[type]) return null;
  const { titleKey, Component } = modalContent[type];
  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.25)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ direction: 'ltr' }}>
          <div className="modal-header">
            <h5 className="modal-title">{t(titleKey)}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', textAlign: 'left' }}>
            <Component />
          </div>
        </div>
      </div>
    </div>
  );
}
