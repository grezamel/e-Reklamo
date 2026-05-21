import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import CitizenLayout from '@/Layouts/CitizenLayout';
import InputError from '@/Components/InputError';

export default function FileComplaint({ departments = [] }) {
    const [categories, setCategories] = useState([]);
    const [photoPreview, setPhotoPreview] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        department_id: '',
        location: '',
        photos: [],
        is_anonymous: false,
    });

    const handleDeptChange = (e) => {
        const id = e.target.value;
        setData('department_id', id);
        setData('category_id', '');
        const dept = departments.find(d => d.id == id);
        setCategories(dept?.categories || []);
    };

    const handlePhotos = (e) => {
        const files = Array.from(e.target.files);
        setData('photos', files);
        setPhotoPreview(files.map(f => URL.createObjectURL(f)));
    };

    const removePhoto = (i) => {
        const newPhotos = data.photos.filter((_, idx) => idx !== i);
        setData('photos', newPhotos);
        setPhotoPreview(photoPreview.filter((_, idx) => idx !== i));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('citizen.complaints.store'), { forceFormData: true });
    };

    return (
        <CitizenLayout>
            <div className="p-4 sm:p-6 max-w-2xl mx-auto">
                <div className="mb-5">
                    <h1 className="text-xl font-bold text-gray-900">File a Complaint</h1>
                    <p className="text-sm text-gray-500">Share your concern and we'll investigate it</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-5">
                    <form onSubmit={submit} className="space-y-4">
                        {/* Anonymous toggle */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={data.is_anonymous}
                                    onChange={e => setData('is_anonymous', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-600" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">File anonymously</p>
                                    <p className="text-xs text-gray-500">Your identity will be kept private</p>
                                </div>
                            </label>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Title <span className="text-red-500">*</span></label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)}
                                placeholder="Brief title of your complaint"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.title} className="mt-1" />
                        </div>

                        {/* Department & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department <span className="text-red-500">*</span></label>
                                <select value={data.department_id} onChange={handleDeptChange}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500">
                                    <option value="">Select department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                                <InputError message={errors.department_id} className="mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)}
                                    disabled={!data.department_id}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 disabled:bg-gray-50">
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <InputError message={errors.category_id} className="mt-1" />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                            <input type="text" value={data.location} onChange={e => setData('location', e.target.value)}
                                placeholder="Where did this happen?"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
                            <InputError message={errors.location} className="mt-1" />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                                placeholder="Describe the issue in detail..." rows={4}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 resize-none" />
                            <InputError message={errors.description} className="mt-1" />
                        </div>

                        {/* Photo upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photos (optional)</label>
                            <label htmlFor="photos"
                                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition">
                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500">Click to upload photos (PNG, JPG up to 5MB)</p>
                                <input id="photos" type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" />
                            </label>
                        </div>

                        {/* Photo previews */}
                        {photoPreview.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {photoPreview.map((src, i) => (
                                    <div key={i} className="relative">
                                        <img src={src} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                                        <button type="button" onClick={() => removePhoto(i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={processing}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-50">
                                {processing ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                            <button type="button" onClick={() => window.history.back()}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CitizenLayout>
    );
}
