import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { apiFetch } from '../../api/client';

type AdminCategory = { id: string; name: string; icon: string };

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const data = await apiFetch<AdminCategory[]>('/api/admin/categories');
      setCategories(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const create = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const created = await apiFetch<AdminCategory>('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim(), icon: newIcon.trim() }),
      });
      setCategories((prev) => [...prev, created]);
      setNewName('');
      setNewIcon('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const save = async (id: string) => {
    setError(null);
    try {
      const updated = await apiFetch<AdminCategory>(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editName.trim(), icon: editIcon.trim() }),
      });
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setDeletingId(id);
    setError(null);
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold text-gray-900">Categories</div>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">{error}</div>}

      {/* Add new */}
      <div className="border border-gray-200 rounded-2xl p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Add Category</div>
        <div className="flex items-center gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2"
          />
          <input
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            placeholder="Icon (optional)"
            className="w-32 border border-gray-300 rounded-xl px-3 py-2"
          />
          <button
            disabled={creating || !newName.trim()}
            onClick={() => void create()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {creating ? '...' : 'Add'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
            {editingId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
                <input
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  placeholder="Icon"
                  className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
                <button
                  onClick={() => void save(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-lg">{cat.icon || ' '}</span>
                <span className="flex-1 font-medium text-gray-900">{cat.name}</span>
                <button
                  onClick={() => {
                    setEditingId(cat.id);
                    setEditName(cat.name);
                    setEditIcon(cat.icon);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:border-blue-500"
                >
                  Edit
                </button>
                <button
                  disabled={deletingId === cat.id}
                  onClick={() => void deleteCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
