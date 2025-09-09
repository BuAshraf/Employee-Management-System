import React, { useEffect, useState } from 'react';
import CompanyService from '../../services/CompanyService';
import { useI18n } from '../../i18n';

const CompanyPage = () => {
  const { t } = useI18n();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    CompanyService.list()
      .then((data) => {
        setCompanies(data.content || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load companies');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>{t('companies') || 'Companies'}</h2>
      {loading && <div>{t('loading') || 'Loading...'}</div>}
      {error && <div className="text-danger">{error}</div>}
      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>{t('name') || 'Name'}</th>
            <th>{t('companyKey') || 'Key'}</th>
            <th>{t('active') || 'Active'}</th>
            <th>{t('actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.companyKey}</td>
              <td>{c.active ? t('yes') || 'Yes' : t('no') || 'No'}</td>
              <td>
                {/* View/Edit/Delete actions can be added here */}
                <button className="btn btn-sm btn-outline-primary me-2">{t('view') || 'View'}</button>
                <button className="btn btn-sm btn-outline-secondary me-2">{t('edit') || 'Edit'}</button>
                <button className="btn btn-sm btn-outline-danger">{t('delete') || 'Delete'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-success mt-3">{t('addCompany') || 'Add Company'}</button>
    </div>
  );
};

export default CompanyPage;
