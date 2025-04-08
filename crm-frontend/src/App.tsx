import { useState } from 'react';
import LeadTable from './components/LeadTable';
import LeadForm from './components/LeadForm';
import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Bars3Icon className="h-6 w-6 text-gray-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">CRM Pro</span>
            </div>
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-700">Sales Agent</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leads Pipeline</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'View Leads' : '+ Add Lead'}
          </button>
        </div>

        {showForm ? (
          
          <div className="mb-8">
            <LeadForm onSuccess={() => setShowForm(false)} />
          </div>
        ) : (
          <LeadTable/>
        )}
      </main>
    </div>
  );
}