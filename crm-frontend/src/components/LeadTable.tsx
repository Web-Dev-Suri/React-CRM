import { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import apiClient from '../api/client';
import { Lead } from '../types';
import { format } from 'date-fns';

const columnHelper = createColumnHelper<Lead>();

type LeadTableProps = {
  refresh: boolean;
};

export default function LeadTable({ refresh }: LeadTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localRefresh, setLocalRefresh] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await apiClient.get('/api/leads');
        console.log('API Response:', response); // Added logging
        setLeads(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err); // Log detailed error
        setError('Failed to fetch leads. Check console for details.');
        setLoading(false);
      }
    };
    fetchLeads();
  }, [refresh]);
  
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('company', {
      header: 'Company',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === 'New' ? 'bg-green-100 text-green-800' :
          info.getValue() === 'Contacted' ? 'bg-blue-100 text-blue-800' :
          info.getValue() === 'Qualified' ? 'bg-purple-100 text-purple-800' :
          'bg-red-100 text-red-800'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('assignedTo', {
      header: 'Assigned To',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => format(new Date(info.getValue()), 'MM/dd/yyyy HH:mm'),
    }),
  ];

  const table = useReactTable({
    data: leads,
    columns: [
      columnHelper.accessor('name', {
        header: 'Lead Name',
        sortingFn: 'text',
      }),
      columnHelper.accessor('company', {
        header: 'Company',
      }),
      columnHelper.accessor('email', {
        header: 'Email',
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        sortingFn: 'text',
      }),
      columnHelper.accessor('createdAt', {
        header: 'Created Date',
        cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor('assignedTo', {
        header: 'Assigned To',
      }),
    ],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const downloadCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Status', 'Assigned To', 'Created At'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.status,
        lead.assignedTo,
        format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm'),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter ? lead.status === statusFilter : true;
    const matchesAssigned = assignedFilter 
      ? lead.assignedTo.toLowerCase().includes(assignedFilter.toLowerCase())
      : true;
    return matchesStatus && matchesAssigned;
  });

  if (loading) return <div className="text-center py-4">Loading leads...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="mt-8 max-w-6xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leads Overview</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Filter by Assigned:</label>
          <input
            type="text"
            placeholder="Search assigned..."
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
          <button 
            onClick={downloadCSV}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map(lead => (
              <tr key={lead.id}>
                <td className="px-6 py-4 text-black whitespace-nowrap">{lead.name}</td>
                <td className="px-6 py-4 text-black whitespace-nowrap">{lead.email}</td>
                <td className="px-6 py-4 text-black whitespace-nowrap">{lead.phone}</td>
                <td className="px-6 py-4 text-black whitespace-nowrap">{lead.company}</td>
                <td className="text-black px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    lead.status === 'New' ? 'bg-green-100 text-green-800' : 
                    lead.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'Qualified' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-black whitespace-nowrap">{lead.assignedTo}</td>
                <td className="px-6 py-4 text-black whitespace-nowrap">
                  {format(new Date(lead.createdAt), 'MM/dd/yyyy HH:mm')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No leads found matching the criteria
          </div>
        )}
      </div>
    </div>
    </div>
  );
}