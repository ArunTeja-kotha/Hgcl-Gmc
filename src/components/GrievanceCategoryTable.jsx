import React from "react";

const GrievanceCategoryTable = ({
  categories,
  deletingId,
  onEdit,
  onDelete,
}) => {

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // ==============================
  // EMPTY DATA
  // ==============================
  if (!categories || categories.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">
        <div className="p-10 text-center text-[#64748B]">
          No grievance categories found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">

      <div className="overflow-x-auto">

        <table className="w-full min-w-250">

          {/* TABLE HEADER */}
          <thead className="bg-[#E8F2FB]">

            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Category Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Priority
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Response TAT
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Resolution TAT
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Escalation 1
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Escalation 2
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Created At
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-[#123A63]">
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}
          <tbody>

            {categories.map((category) => (

              <tr
                key={category.categoryId}
                className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
              >

                {/* CATEGORY NAME */}
                <td className="px-5 py-4 text-sm font-medium text-[#1F2937]">
                  {category.categoryName || "-"}
                </td>

                {/* PRIORITY */}
                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {category.priority || "-"}
                </td>

                {/* RESPONSE TAT */}
                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {category.responseTat || "-"}
                </td>

                {/* RESOLUTION TAT */}
                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {category.resolutionTat || "-"}
                </td>

                {/* ESCALATION 1 */}
                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {category.escalation1 || "-"}
                </td>

                {/* ESCALATION 2 */}
                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {category.escalation2 || "-"}
                </td>

                {/* CREATED AT */}
                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {formatDateTime(category.createdAt)}
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4">

                  <div className="flex items-center justify-center gap-2">

                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-lg border border-[#2563A6] px-3 py-1.5 text-sm font-medium text-[#2563A6] transition hover:bg-[#E8F2FB]"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => onDelete(category.categoryId)}
                      disabled={deletingId === category.categoryId}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === category.categoryId
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default GrievanceCategoryTable;