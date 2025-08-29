import ClassList from './ClassList';
import DashboardHeader from './DashboardHeader';

export default function MyClasses({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader
  title={activeTab === 'overview' ? 'Overview' : activeTab === 'classList' ? 'My Classes' : 'Dashboard'}
  subtitle={activeTab === 'overview' ? 'Track student progress and class stats' : activeTab === 'classList' ? 'Manage and organize your classes' : ''}
  onMenuClick={() => setSidebarOpen(true)}
/>

      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <ClassList />
      </main>
    </div>
  );
}
