import React from "react";

const RegisteredGrievancesTable = ({ grievances }) => {

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

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

        <table className="w-full min-w-300">

          <thead className="bg-[#E8F2FB]">

            <tr>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Grievance Code
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Category
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Sub Category
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Description
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Status
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold text-[#123A63]">
                Created At
              </th>

            </tr>

          </thead>

          <tbody>

            {grievances.map((grievance) => (

              <tr
                key={grievance.grievanceId}
                className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
              >

                {/* Grievance Code */}
                <td className="px-4 py-3 text-sm text-[#1F2937]">
                  {grievance.grievanceCode || "-"}
                </td>

                {/* Category Name */}
                <td className="px-4 py-3 text-sm text-[#1F2937]">
                  {grievance.categoryName || "-"}
                </td>

                {/* Sub Category Name */}
                <td className="px-4 py-3 text-sm text-[#1F2937]">
                  {grievance.subCategoryName || "-"}
                </td>

                {/* Description */}
                <td className="max-w-87.5 px-4 py-3 text-sm text-[#1F2937]">
                  {grievance.description || "-"}
                </td>

                {/* Status */}
                <td className="px-4 py-3 text-sm text-[#1F2937]">
                  {grievance.status || "-"}
                </td>

                {/* Created At */}
                <td className="px-4 py-3 text-sm text-[#1F2937]">
                  {formatDateTime(grievance.createdAt)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RegisteredGrievancesTable;