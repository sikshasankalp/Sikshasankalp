import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { fetchTeamAdmin, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/api/team';
import type { TeamMember } from '../../services/api/team';

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [expertise, setExpertise] = useState('');
  const [department, setDepartment] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await fetchTeamAdmin({ limit: 100 });
      setMembers(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setDesignation('');
    setBio('');
    setResponsibilities('');
    setExpertise('');
    setDepartment('');
    setDisplayOrder('0');
    setIsActive(true);
    setIsPublished(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingId(member.id);
    setName(member.name);
    setDesignation(member.designation);
    setBio(member.bio || '');
    setResponsibilities(member.responsibilities || '');
    setExpertise(member.expertise || '');
    setDepartment(member.department || '');
    setDisplayOrder(member.displayOrder.toString());
    setIsActive(member.isActive);
    setIsPublished(member.isPublished);
    setSelectedFile(null);
    setPreviewUrl(member.photoUrl || null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !designation) {
      alert('Name and designation are required.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('designation', designation);
      if (bio) formData.append('bio', bio);
      if (responsibilities) formData.append('responsibilities', responsibilities);
      if (expertise) formData.append('expertise', expertise);
      if (department) formData.append('department', department);
      formData.append('displayOrder', displayOrder);
      formData.append('isActive', String(isActive));
      formData.append('isPublished', String(isPublished));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingId) {
        await updateTeamMember(editingId, formData);
      } else {
        await createTeamMember(formData);
      }
      
      setIsModalOpen(false);
      loadMembers();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to save team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      await deleteTeamMember(id);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete team member.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border">
              <th className="p-4 font-semibold text-content-primary">Photo</th>
              <th className="p-4 font-semibold text-content-primary">Name</th>
              <th className="p-4 font-semibold text-content-primary">Role</th>
              <th className="p-4 font-semibold text-content-primary">Status</th>
              <th className="p-4 font-semibold text-content-primary">Order</th>
              <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-content-secondary">Loading...</td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-content-secondary">No team members found.</td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-muted border border-border">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-primary/10 text-brand-primary">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4 text-content-secondary">{member.designation}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full w-max ${member.isActive ? 'bg-success/10 text-success' : 'bg-content-secondary/10 text-content-secondary'}`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full w-max ${member.isPublished ? 'bg-brand-primary/10 text-brand-primary' : 'bg-warning/10 text-warning'}`}>
                        {member.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">{member.displayOrder}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(member)}
                        className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-content-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 relative overflow-hidden">
            {submitting && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="w-14 h-14 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
                <h4 className="text-lg font-bold text-content-primary">
                  {selectedFile ? 'Uploading photo & saving member...' : 'Saving changes...'}
                </h4>
                <p className="text-sm text-content-secondary max-w-xs mt-1">
                  Please wait a moment while the member details are updated.
                </p>
              </div>
            )}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button disabled={submitting} onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary disabled:opacity-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Photo Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-2">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-surface-muted border border-border">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-content-secondary gap-2">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors"
                      >
                        Select Image
                      </button>
                      <p className="text-xs text-content-secondary max-w-[200px]">
                        Recommended size: 800x800px. JPG, PNG or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. Sanjay Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. Founder & Managing Trustee"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Department / Area</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. Education, Finance, Operations"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Responsibilities / Delegation</label>
                  <textarea
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="e.g. Legal governance, trust deed compliance, board oversight"
                  />
                  <p className="text-xs text-content-secondary mt-1">Describe what this person is responsible for within the foundation.</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Expertise / Skills</label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. Community Development, Finance, Child Welfare (comma separated)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="Brief background or biography"
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex gap-8 py-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-brand-primary' : 'bg-border'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-content-primary">Active Member</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isPublished ? 'bg-brand-primary' : 'bg-border'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-content-primary">Publicly Visible</span>
                  </label>
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-content-primary hover:bg-surface-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
