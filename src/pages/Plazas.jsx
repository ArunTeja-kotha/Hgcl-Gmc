import React, { useEffect, useState } from "react";
import axios from "axios";
import PlazaForm from "../components/PlazaForm";

const API_URL = "http://192.168.1.37:8000/Plazas/";

const Plazas = () => {
  const [showPlazaForm, setShowPlazaForm] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState(null);
  const [plazas, setPlazas] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchPlazas = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setPlazas(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load plazas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlazas();
  }, []);

  const handleEdit = (plaza) => {
    setEditingPlaza(plaza);
    setShowPlazaForm(true);
  };

  const handleDelete = async (plazaId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plaza?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(plazaId);

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}${plazaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchPlazas();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to delete plaza.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    setShowPlazaForm(false);
    setEditingPlaza(null);
    await fetchPlazas();
  };

  const handleFormCancel = () => {
    setShowPlazaForm(false);
    setEditingPlaza(null);
  };

  const filteredPlazas = plazas.filter((plaza) =>
    plaza.Plaza_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            Plaza Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage toll plazas
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPlaza(null);
            setShowPlazaForm(true);
          }}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85]"
        >
          Add Plaza
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-[#D5E0EA] bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plaza..."
          className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm outline-none focus:border-[#2563A6]"
        />
      </div>

      {loading && (
        <div className="rounded-xl border border-[#D5E0EA] bg-white p-8 text-center text-[#64748B]">
          Loading plazas...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D5E0EA] bg-[#E8F2FB]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Plaza Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Created At
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Updated At
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#123A63]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPlazas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-sm text-[#64748B]"
                    >
                      No plazas found.
                    </td>
                  </tr>
                ) : (
                  filteredPlazas.map((plaza) => (
                    <tr
                      key={plaza.Plaza_id}
                      className="border-b border-[#D5E0EA] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#1F2937]">
                        {plaza.Plaza_name}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {plaza.Created_at
                          ? new Date(
                              plaza.Created_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {plaza.Updated_at
                          ? new Date(
                              plaza.Updated_at
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(plaza)}
                            className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(plaza.Plaza_id)
                            }
                            disabled={deletingId === plaza.Plaza_id}
                            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === plaza.Plaza_id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showPlazaForm && (
        <PlazaForm
          editingPlaza={editingPlaza}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Plazas;