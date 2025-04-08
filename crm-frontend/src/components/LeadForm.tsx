import { useForm } from 'react-hook-form';
import apiClient from '../api/client';

type LeadFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  assignedTo: string;
};

type LeadFormProps = {
  onLeadAdded: () => void;
};

export default function LeadForm({ onLeadAdded }: LeadFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset
  } = useForm<LeadFormData>();

  const onSubmit = async (data: LeadFormData) => {
    try {
      await apiClient.post('/api/leads', data);
      reset();
      alert('Lead created successfully!');
      onLeadAdded(); // Notify parent component
    } catch (error) {
      alert('Error creating lead');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Capture New Lead</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone *</label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
        </div>

        {/* Company Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Company *</label>
          <input
            {...register('company', { required: 'Company is required' })}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.company && <span className="text-red-500 text-sm">{errors.company.message}</span>}
        </div>

        {/* Status Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status *</label>
          <select
            {...register('status', { required: true })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Assigned To */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Assign To *</label>
          <input
            {...register('assignedTo', { required: 'Assigned user is required' })}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter user email"
          />
          {errors.assignedTo && (
            <span className="text-red-500 text-sm">{errors.assignedTo.message}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : 'Create Lead'}
      </button>
    </form>
  );
}