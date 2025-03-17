import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApplications } from "../api";
import { IApplicationData, IApplicationsResponse } from "../types/general";

const Home = () => {
  // const navigate = useNavigate();

  const [applications, setApplications] = useState<IApplicationData[]>([]);
  const [columns, setColumns] = useState<ColumnDef<IApplicationData>[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data: IApplicationsResponse = await fetchApplications();
        setApplications(data.data);

        const dynamicColumns: ColumnDef<IApplicationData>[] = data.columns.map(
          (col) => ({
            header: col,
            accessorFn: (row) => row[col as keyof IApplicationData], // Dynamic accessor
            enableSorting: true, // Enable sorting
          })
        );

        setColumns(dynamicColumns);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, []);

  console.log(applications);

  const table = useReactTable({
    data: applications,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
      globalFilter,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
  });
  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg mt-6">
        Loading applications...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-4 text-right">
        <Link
          to="/apply"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-blue-700 transition"
        >
          Apply Now
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search applications..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <div className="flex flex-wrap gap-4 mb-4">
        {table.getAllColumns().map((column) => (
          <label key={column.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={() => column.toggleVisibility(!column.getIsVisible())}
              className="h-5 w-5 accent-blue-600"
            />
            <span className="text-gray-700 text-sm">{column.id}</span>
          </label>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-md rounded-md text-sm md:text-base">
          {/* Table Header */}
          <thead className="bg-blue-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-blue-500 transition"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100 transition">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="text-gray-600 text-sm md:text-base">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
