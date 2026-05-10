import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Dashboard({auth, myComplaints, allComplaints}) {
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        category: 'Sanitation',
        location: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('complaints.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleAction = (id, newStatus) => {
    let reason = '';
    
    // Trigger a prompt if rejecting or resolving to get a reason
    if (newStatus === 'rejected' || newStatus === 'resolved') {
        reason = window.prompt(`Enter remarks for marking as ${newStatus}:`);
        
        // If they click "Cancel", stop the process
        if (reason === null) return; 
    }

    router.patch(route('complaints.updateStatus', id), { 
        status: newStatus,
        remarks: reason 
    });
};

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {auth.user.role === 'personnel' ? 'Personnel Dashboard' : 'Citizen Dashboard'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- CITIZEN VIEW --- */}
                    {auth.user.role === 'citizen' && (
                    <>
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                            <h3 className="text-lg font-bold mb-4 text-citizen-green">Submit a New Complaint</h3>
                            
                            <form onSubmit={submit} className="space-y-4 max-w-xl">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject / Nature of Complaint</label>
                                    <input 
                                        type="text" 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-citizen-green focus:border-citizen-green"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                    {errors.title && <span className="text-red-600 text-sm">{errors.title}</span>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select 
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                        >
                                            <option value="Sanitation">Sanitation</option>
                                            <option value="Traffic">Traffic</option>
                                            <option value="Safety">Safety</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Location (Barangay/Street)</label>
                                        <input 
                                            type="text" 
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Description</label>
                                    <textarea 
                                        rows="4"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="inline-flex items-center rounded-md border border-transparent bg-citizen-green px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-emerald-700"
                                >
                                    {processing ? 'Processing...' : 'Submit Reklamo'}
                                </button>
                            </form>
                        </div>

                        {/* --- COMPLAINTS LIST --- */}
                        <div className="mt-8 bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold mb-4">Your Reported Reklamos</h3>
                            <div className="space-y-4">
                                {myComplaints?.length === 0 ? (
                                    <p className="text-gray-500 italic text-sm">No complaints submitted yet.</p>
                                ) : (
                                    myComplaints?.map((complaint) => (
                                        <div key={complaint.id} className="border-l-4 border-emerald-500 bg-gray-50 p-4 rounded-r shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-xs font-mono text-gray-500">{complaint.reference_number}</span>
                                                    <h4 className="font-bold text-gray-800">{complaint.title}</h4>
                                                    {complaint.remarks && (
                                                        <div className="mt-3 p-2 bg-blue-50 border-l-2 border-blue-400 text-sm italic text-blue-800">
                                                            <strong>Personnel Remarks:</strong> {complaint.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                    complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {complaint.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">{complaint.description}</p>
                                            <div className="mt-3 text-xs text-gray-400 italic">
                                                Location: {complaint.location} | Date: {new Date(complaint.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                    )}

                    {/* --- PERSONNEL VIEW --- */}
                    {auth.user.role === 'personnel' && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Master List of Complaints</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citizen</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {allComplaints?.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.reference_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.user?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {item.status.replace('-', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Show 'Start' only if pending or rejected */}
                                                        {(item.status === 'pending' || item.status === 'rejected') && (
                                                            <button 
                                                                onClick={() => router.patch(route('complaints.updateStatus', item.id), { status: 'in-progress' })}
                                                                className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                                            >
                                                                Process
                                                            </button>
                                                        )}

                                                        {/* Resolve Button - Will prompt for remarks */}
                                                        {item.status === 'in-progress' && (
                                                            <button 
                                                                onClick={() => handleAction(item.id, 'resolved')}
                                                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                                            >
                                                                Resolve
                                                            </button>
                                                        )}

                                                        {/* Reject Button - Will prompt for remarks */}
                                                        {(item.status !== 'resolved' && item.status !== 'rejected') && (
                                                            <button 
                                                                onClick={() => handleAction(item.id, 'rejected')}
                                                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                                            >
                                                                Reject
                                                            </button>
                                                        )}

                                                        {/* Show 'Reopen' only if resolved or rejected */}
                                                        {(item.status === 'resolved' || item.status === 'rejected') && (
                                                            <button 
                                                                onClick={() => router.patch(route('complaints.updateStatus', item.id), { status: 'pending' })}
                                                                className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                                                            >
                                                                Reopen
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <button 
                                                        onClick={() => router.patch(route('complaints.togglePriority', item.id))}
                                                        className={item.priority === 'high' ? 'text-red-600' : 'text-gray-300'}
                                                    >
                                                        {item.priority === 'high' ? '🚩 High' : '🏳️ Low'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}