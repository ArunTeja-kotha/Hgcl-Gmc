import React from "react";

const RegisteredGrievancesTable = ({
  grievances,
  onAssign,
  canAssign,
}) => {

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  // =========================================================
  // NO GRIEVANCES
  // =========================================================

  if (!grievances || grievances.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">

        <div className="p-10 text-center">

          <p className="text-[#64748B]">
            No registered grievances found.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1100px]">

          {/* =================================================
              TABLE HEADER
              ================================================= */}

          <thead className="bg-[#E8F2FB]">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Grievance Code
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Sub Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Description
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-[#123A63]">
                Created At
              </th>

              {/* Only Web Admin and Web User */}
              {canAssign && (
                <th className="px-5 py-3 text-center text-xs font-semibold text-[#123A63]">
                  Action
                </th>
              )}

            </tr>

          </thead>

          {/* =================================================
              TABLE BODY
              ================================================= */}

          <tbody>

            {grievances.map((grievance) => (

              <tr
                key={grievance.grievanceId}
                className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
              >

                {/* Grievance Code */}
                <td className="px-5 py-4 text-sm font-medium text-[#123A63]">
                  {grievance.grievanceCode || "-"}
                </td>

                {/* Category */}
                <td className="px-5 py-4 text-sm text-[#475569]">
                  {grievance.categoryName || "-"}
                </td>

                {/* Sub Category */}
                <td className="px-5 py-4 text-sm text-[#475569]">
                  {grievance.subCategoryName || "-"}
                </td>

                {/* Description */}
                <td className="max-w-[300px] px-5 py-4 text-sm text-[#475569]">

                  <div className="line-clamp-2">
                    {grievance.description || "-"}
                  </div>

                </td>

                {/* Status */}
                <td className="px-5 py-4 text-sm text-[#475569]">
                  {grievance.status || "-"}
                </td>

                {/* Created At */}
                <td className="px-5 py-4 text-sm text-[#475569]">
                  {formatDateTime(
                    grievance.createdAt
                  )}
                </td>

                {/* =================================================
                    ASSIGN BUTTON
                    Only Web Administrator / Web User
                    ================================================= */}

                {canAssign && (
                  <td className="px-5 py-4 text-center">

                    <button
                      type="button"
                      onClick={() =>
                        onAssign(grievance)
                      }
                      className="rounded-lg bg-[#2563A6] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1D4F85]"
                    >
                      Assign
                    </button>

                  </td>
                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RegisteredGrievancesTable;
