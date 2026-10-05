import React from "react";

const GrievanceSubCategoryTable = ({
  subCategories,
  deletingId,
  onEdit,
  onDelete,
}) => {
  // ============================================
  // DATE FORMAT
  // ============================================

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // ============================================
  // EMPTY DATA
  // ============================================

  if (
    !subCategories ||
    subCategories.length === 0
  ) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">
        <div className="p-10 text-center text-[#64748B]">
          No grievance subcategories found.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">

      <div className="overflow-x-auto">

        <table className="w-full min-w-250">

          {/* ======================================
              HEADER
          ====================================== */}

          <thead className="bg-[#E8F2FB]">

            <tr>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Sub Category Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Category Name
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Created At
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Created By
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Updated At
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold text-[#123A63]">
                Updated By
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold text-[#123A63]">
                Actions
              </th>

            </tr>

          </thead>

          {/* ======================================
              BODY
          ====================================== */}

          <tbody>

            {subCategories.map((subCategory) => (

              <tr
                key={subCategory.subCategoryId}
                className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
              >

                {/* SUB CATEGORY NAME */}

                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {subCategory.subCategoryName || "-"}
                </td>

                {/* CATEGORY NAME */}

                <td className="px-5 py-4 text-sm text-[#1F2937]">
                  {subCategory.categoryName || "-"}
                </td>

                {/* CREATED AT */}

                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {formatDateTime(
                    subCategory.createdAt
                  )}
                </td>

                {/* CREATED BY */}

                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {subCategory.createdByName || "-"}
                </td>

                {/* UPDATED AT */}

                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {formatDateTime(
                    subCategory.updatedAt
                  )}
                </td>

                {/* UPDATED BY */}

                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {subCategory.updatedByName || "-"}
                </td>

                {/* ACTIONS */}

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(subCategory)
                      }
                      className="rounded-lg border border-[#2563A6] px-3 py-1.5 text-sm font-medium text-[#2563A6] transition hover:bg-[#E8F2FB]"
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          subCategory.subCategoryId
                        )
                      }
                      disabled={
                        deletingId ===
                        subCategory.subCategoryId
                      }
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId ===
                      subCategory.subCategoryId
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

export default GrievanceSubCategoryTable;