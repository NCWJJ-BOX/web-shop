import { useEffect, useMemo, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { apiFetch, apiUpload, API_BASE } from '../../api/client';

type AdminCategory = { id: string; name: string };

type AdminProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  features: string[];
  description: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  stockQty: number;
};

function parseCsv(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draftById, setDraftById] = useState<Record<string, Partial<AdminProduct>>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const activeCount = useMemo(() => products.filter((p) => p.isActive).length, [products]);

  const load = async () => {
    setError(null);
    try {
      const [ps, cs] = await Promise.all([
        apiFetch<AdminProduct[]>('/api/admin/products'),
        apiFetch<Array<{ id: string; name: string }>>('/api/admin/categories'),
      ]);
      setProducts(ps);
      setCategories(cs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setDraft = (id: string, patch: Partial<AdminProduct>) => {
    setDraftById((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const save = async (id: string) => {
    const draft = draftById[id];
    if (!draft) return;
    setSavingId(id);
    setError(null);
    try {
      const updated = await apiFetch<AdminProduct>(`/api/admin/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(draft),
      });
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setDraftById((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setSavingId(null);
    }
  };

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newStock, setNewStock] = useState('50');
  const [newImages, setNewImages] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const create = async () => {
    setCreating(true);
    setError(null);
    try {
      let imageUrl = newImage;
      if (newImageFile) {
        const form = new FormData();
        form.append('image', newImageFile);
        const uploaded = await apiUpload<{ path: string }>('/api/admin/uploads/product-image', form);
        imageUrl = `${API_BASE}${uploaded.path}`;
      }

      const created = await apiFetch<AdminProduct>('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          name: newName,
          categoryId: newCategoryId,
          price: Number(newPrice),
          image: imageUrl,
          images: parseCsv(newImages).length ? parseCsv(newImages) : [imageUrl],
          features: parseCsv(newFeatures),
          description: newDescription,
          stockQty: Number(newStock),
          inStock: true,
          isNew: true,
          isFeatured: false,
          isActive: true,
        }),
      });
      setProducts((prev) => [created, ...prev]);
      setNewOpen(false);
      setNewName('');
      setNewCategoryId('');
      setNewPrice('');
      setNewImage('');
      setNewImageFile(null);
      setNewStock('50');
      setNewImages('');
      setNewFeatures('');
      setNewDescription('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">Products</div>
          <div className="text-sm text-gray-600">Active {activeCount} / Total {products.length}</div>
        </div>
        <button
          onClick={() => setNewOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-600 text-white font-medium"
        >
          <Plus className="h-4 w-4" />
          Add product
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-3 py-2 text-sm">{error}</div>}

      {newOpen && (
        <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">Name</div>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">Category</div>
              <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2">
                <option value="">Select...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">Price (USD)</div>
              <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </label>
            <label className="block">
              <div className="text-sm font-medium text-gray-700 mb-1">Stock Qty</div>
              <input value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
            </label>
          </div>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Main image URL</div>
            <input value={newImage} onChange={(e) => setNewImage(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Or upload image</div>
            <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Images (comma separated)</div>
            <input value={newImages} onChange={(e) => setNewImages(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Features (comma separated)</div>
            <input value={newFeatures} onChange={(e) => setNewFeatures(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
          </label>
          <label className="block">
            <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
            <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" rows={3} />
          </label>
          <button
            disabled={creating}
            onClick={() => void create()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {products.map((p) => {
          const draft = draftById[p.id] || {};
          const merged: AdminProduct = { ...p, ...draft } as AdminProduct;
          const dirty = Boolean(draftById[p.id]);
          return (
            <div key={p.id} className={`border rounded-2xl p-4 ${p.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                  <div className="min-w-0">
                    <input
                      value={merged.name}
                      onChange={(e) => setDraft(p.id, { name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 font-semibold"
                    />
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <label className="block">
                        <div className="text-xs text-gray-600 mb-1">Category</div>
                        <select
                          value={merged.categoryId}
                          onChange={(e) => setDraft(p.id, { categoryId: e.target.value })}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <div className="text-xs text-gray-600 mb-1">Price (USD)</div>
                        <input
                          value={String(merged.price)}
                          onChange={(e) => setDraft(p.id, { price: Number(e.target.value) })}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        />
                      </label>
                      <label className="block">
                        <div className="text-xs text-gray-600 mb-1">Stock Qty</div>
                        <input
                          value={String(merged.stockQty)}
                          onChange={(e) => setDraft(p.id, { stockQty: Number(e.target.value) })}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setDraft(p.id, { isActive: !merged.isActive })}
                          className={`px-3 py-2 rounded-xl font-medium border ${merged.isActive ? 'border-gray-300 text-gray-700' : 'border-red-300 text-red-700'}`}
                        >
                          {merged.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => setDraft(p.id, { isFeatured: !merged.isFeatured })}
                          className={`px-3 py-2 rounded-xl font-medium border ${merged.isFeatured ? 'border-orange-400 text-orange-700 bg-orange-50' : 'border-gray-300 text-gray-700'}`}
                        >
                          Featured
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  disabled={!dirty || savingId === p.id}
                  onClick={() => void save(p.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white font-medium disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {savingId === p.id ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
