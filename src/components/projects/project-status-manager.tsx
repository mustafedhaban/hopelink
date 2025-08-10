import React, { useState, useEffect } from 'react';

interface ProjectStatusManagerProps {
  projectId: string;
}

type ProjectStatus = 'draft' | 'active' | 'completed' | 'cancelled';

const ProjectStatusManager: React.FC<ProjectStatusManagerProps> = ({ projectId }) => {
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>('draft');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching current project status
    const fetchStatus = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In a real app, you'd fetch the actual status from an API
      setCurrentStatus('active'); // Example initial status
      setLoading(false);
    };
    fetchStatus();
  }, [projectId]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProjectStatus;
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCurrentStatus(newStatus);
        console.log(`Project ${projectId} status updated to: ${newStatus}`);
        alert(`Project ${projectId} status updated to: ${newStatus}`);
      } else {
        console.error('Failed to update project status:', response.statusText);
        alert('Failed to update project status.');
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Error updating project status.');
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading status...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Project Status for Project ID: {projectId}</h2>
      <div className="flex items-center space-x-4">
        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700">Current Status:</label>
        <select
          id="status-select"
          value={currentStatus}
          onChange={handleStatusChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <p className="mt-2 text-sm text-gray-600">You can change the status of this project here.</p>
    </div>
  );
};

export default ProjectStatusManager;