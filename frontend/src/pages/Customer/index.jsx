import { useEffect, useState } from 'react';
import request from '@/request/request';
import CustomerForm from '@/forms/CustomerForm';
import CrudModule from '@/modules/CrudModule/CrudModule';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: translate('client_list'),
    ADD_NEW_ENTITY: translate('add_new_client'),
    ENTITY_NAME: translate('client'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  const [userOptions, setUserOptions] = useState([
    // fallback static example
    // { value: 'userId', label: 'User Name' }
  ]);
  const [statusOptions, setStatusOptions] = useState([
    { value: 'New Lead', label: 'New Lead' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Did not pick', label: 'Did not pick' },
    { value: 'Consultation Scheduled', label: 'Consultation Scheduled' },
    { value: 'DND', label: 'DND' },
  ]);

  // Fetch agents for dropdown
  useEffect(() => {
    request.list({ entity: '/admin', options: { role: 'user' } }).then(res => {
      setUserOptions(
        (res.result || []).map(user => ({
          value: user._id,
          label: user.name,
        }))
      );
    });
  }, []);

  return (
    <CrudModule
      createForm={<CustomerForm userOptions={userOptions} />}
      updateForm={<CustomerForm userOptions={userOptions} isUpdateForm={true} />}
      config={config}
      filterOptions={{
        userOptions,
        statusOptions,
      }}
    />
  );
}
