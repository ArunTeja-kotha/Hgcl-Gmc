import { AllCommunityModule } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

const Table = ({
  rowData = [],
  columnDefs = [],
  defaultColDef = {},
  height = "500px",
}) => {
  return (
    <AgGridProvider modules={[AllCommunityModule]}>
      <div
        style={{
          width: "100%",
          height,
        }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    </AgGridProvider>
  );
};

export default Table;