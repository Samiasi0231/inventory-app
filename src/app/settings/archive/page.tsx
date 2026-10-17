"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Archive as ArchiveIcon,
  MoreHorizontal,
  Check,
} from "lucide-react";

type ArchiveRecord = {
  id: number;
  name: string;
  requestType: string;
  requestedBy: string;
  location: string;
  dateRequested: string;
  status: string;
};

const initialRecords: ArchiveRecord[] = [
  {
    id: 1,
    name: "Cream Crackers",
    requestType: "Product",
    requestedBy: "Inventory Manager",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 2,
    name: "Pet cake",
    requestType: "Product",
    requestedBy: "Inventory Manager",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 3,
    name: "Aquila Oil",
    requestType: "Product",
    requestedBy: "Inventory Manager",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 4,
    name: "Jane Doe",
    requestType: "Staff",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 5,
    name: "Abs Suppliers",
    requestType: "Supplier",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 6,
    name: "Nanzu Limited",
    requestType: "Supplier",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 7,
    name: "Bangite Limited",
    requestType: "Supplier",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 8,
    name: "Rufus Joe",
    requestType: "Customer",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
  {
    id: 9,
    name: "Liam Martin",
    requestType: "Staff",
    requestedBy: "Owner",
    location: "Lekki Branch",
    dateRequested: "12 Oct 2026, 08:40",
    status: "Archived",
  },
];

const requestTypes = ["All types", "Product", "Supplier", "Customer", "Staff"];

export default function ArchivePage() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Product");
  const [newLocation, setNewLocation] = useState("Lekki Branch");

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();

    return records.filter((record) => {
      const matchesSearch = [
        record.name,
        record.requestType,
        record.requestedBy,
        record.location,
        record.dateRequested,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesType =
        selectedType === "All types" || record.requestType === selectedType;

      const matchesLocation =
        selectedLocation === "All locations" ||
        record.location === selectedLocation;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [records, search, selectedType, selectedLocation]);

  function addLocation() {
    if (!newName.trim()) return;

    const newRecord: ArchiveRecord = {
      id: Date.now(),
      name: newName.trim(),
      requestType: newType,
      requestedBy: "Owner",
      location: newLocation,
      dateRequested: new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Archived",
    };

    setRecords((previous) => [newRecord, ...previous]);
    setNewName("");
    setShowAddModal(false);
  }

  function restoreRecord(id: number) {
    setRecords((previous) => previous.filter((record) => record.id !== id));
    setActiveMenu(null);
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] p-3 sm:p-5 lg:p-7">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Page header */}
        <header className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <ArchiveIcon
                size={16}
                strokeWidth={1.8}
                className="text-[#252b29]"
              />
              <h1 className="text-[16px] font-semibold tracking-[-0.3px] text-[#202522]">
                Archive
              </h1>
            </div>

            <p className="max-w-xl text-[11px] leading-5 text-[#858b88] sm:text-xs">
              Archive records from inactive staff but keep their full history.
              Restoring never changes their details.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start rounded-md bg-[#078c52] px-4 text-xs font-medium text-white transition hover:bg-[#067344] focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <Plus size={15} />
            Add Location
          </button>
        </header>

        {/* Main archive panel */}
        <section className="overflow-visible rounded-lg border border-[#e9ecea] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.025)]">
          {/* Search and filter */}
          <div className="flex flex-col gap-3 border-b border-[#f0f1f0] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
            <div className="relative w-full sm:max-w-[320px]">
              <Search
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#929a96]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in Supplier List"
                aria-label="Search archived records"
                className="h-[33px] w-full rounded border border-[#dfe3e1] bg-white pl-8 pr-3 text-[11px] text-[#353b38] outline-none placeholder:text-[#a0a6a3] transition focus:border-[#0b9a5c] focus:ring-2 focus:ring-[#078c52]/10"
              />
            </div>

            <div className="relative self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterOpen((open) => !open)}
                aria-expanded={filterOpen}
                className={`inline-flex h-[33px] items-center gap-2 rounded border px-3 text-[11px] transition ${
                  selectedType !== "All types" ||
                  selectedLocation !== "All locations"
                    ? "border-[#078c52] bg-[#f0fbf5] text-[#078c52]"
                    : "border-[#dfe3e1] bg-white text-[#4f5953] hover:bg-[#fafbfa]"
                }`}
              >
                <SlidersHorizontal size={12} />
                Filter
                <ChevronDown size={12} />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-10 z-20 w-60 rounded-lg border border-[#e6e9e7] bg-white p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#252b29]">
                      Filter records
                    </p>
                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      aria-label="Close filters"
                      className="text-[#89918c] hover:text-[#252b29]"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <label className="mb-1.5 block text-[11px] font-medium text-[#5b625e]">
                    Request type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                    className="mb-4 h-9 w-full rounded border border-[#e1e5e2] bg-white px-2 text-xs outline-none focus:border-[#078c52]"
                  >
                    {requestTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  <label className="mb-1.5 block text-[11px] font-medium text-[#5b625e]">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(event) =>
                      setSelectedLocation(event.target.value)
                    }
                    className="h-9 w-full rounded border border-[#e1e5e2] bg-white px-2 text-xs outline-none focus:border-[#078c52]"
                  >
                    <option>All locations</option>
                    <option>Lekki Branch</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType("All types");
                      setSelectedLocation("All locations");
                    }}
                    className="mt-3 w-full rounded border border-[#e1e5e2] py-2 text-[11px] text-[#535b56] hover:bg-[#f8f9f8]"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
              <thead>
                <tr className="h-9 border-b border-[#eef0ef] bg-[#fbfcfb]">
                  <th className="w-[19%] px-3 text-[10px] font-medium text-[#727a75] sm:px-4">
                    Recent
                  </th>
                  <th className="w-[16%] px-3 text-[10px] font-medium text-[#727a75]">
                    Request Type
                  </th>
                  <th className="w-[19%] px-3 text-[10px] font-medium text-[#727a75]">
                    Archived By
                  </th>
                  <th className="w-[16%] px-3 text-[10px] font-medium text-[#727a75]">
                    Location
                  </th>
                  <th className="w-[24%] px-3 text-[10px] font-medium text-[#727a75]">
                    Date Requested
                  </th>
                  <th className="w-[6%] px-2 text-center text-[10px] font-medium text-[#727a75]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="h-[35px] border-b border-[#f0f2f0] last:border-b-0 hover:bg-[#fafcfb]"
                  >
                    <td className="truncate px-3 text-[10px] font-medium text-[#343a36] sm:px-4">
                      {record.name}
                    </td>
                    <td className="truncate px-3 text-[10px] text-[#5d655f]">
                      {record.requestType}
                    </td>
                    <td className="truncate px-3 text-[10px] text-[#5d655f]">
                      {record.requestedBy}
                    </td>
                    <td className="truncate px-3 text-[10px] text-[#5d655f]">
                      {record.location}
                    </td>
                    <td className="truncate px-3 text-[10px] text-[#5d655f]">
                      {record.dateRequested}
                    </td>
                    <td className="relative px-2 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenu((current) =>
                            current === record.id ? null : record.id,
                          )
                        }
                        aria-label={`Actions for ${record.name}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded text-[#6d756f] hover:bg-[#eef5f0] hover:text-[#078c52]"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {activeMenu === record.id && (
                        <div className="absolute right-5 top-7 z-10 w-36 rounded-md border border-[#e6e9e7] bg-white p-1 text-left shadow-lg">
                          <button
                            type="button"
                            onClick={() => restoreRecord(record.id)}
                            className="flex w-full items-center gap-2 rounded px-2 py-2 text-[11px] text-[#4a554d] hover:bg-[#f1faf4] hover:text-[#078c52]"
                          >
                            <Check size={13} />
                            Restore record
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-28 text-center text-xs text-[#8b928e]"
                    >
                      No archived records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-t border-[#f0f1f0] px-3 py-2 sm:px-4">
            <p className="text-[10px] text-[#858c87]">
              Showing {filteredRecords.length} of {records.length} records
            </p>
            <p className="text-[10px] text-[#858c87]">All archived records</p>
          </div>
        </section>
      </div>

      {/* Add location modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-location-title"
            className="w-full max-w-md rounded-xl border border-[#e7ebe8] bg-white p-5 shadow-xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2
                  id="add-location-title"
                  className="text-base font-semibold text-[#252b29]"
                >
                  Add Location
                </h2>
                <p className="mt-1 text-xs text-[#818983]">
                  Add a record to your archive list.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
                className="rounded p-1 text-[#818983] hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                addLocation();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="record-name"
                  className="mb-1.5 block text-xs font-medium text-[#454d47]"
                >
                  Record name
                </label>
                <input
                  id="record-name"
                  required
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Enter record name"
                  className="h-10 w-full rounded-md border border-[#dfe4e0] px-3 text-sm outline-none focus:border-[#078c52] focus:ring-2 focus:ring-[#078c52]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="record-type"
                  className="mb-1.5 block text-xs font-medium text-[#454d47]"
                >
                  Request type
                </label>
                <select
                  id="record-type"
                  value={newType}
                  onChange={(event) => setNewType(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#dfe4e0] bg-white px-3 text-sm outline-none focus:border-[#078c52]"
                >
                  {requestTypes.slice(1).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="record-location"
                  className="mb-1.5 block text-xs font-medium text-[#454d47]"
                >
                  Location
                </label>
                <select
                  id="record-location"
                  value={newLocation}
                  onChange={(event) => setNewLocation(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#dfe4e0] bg-white px-3 text-sm outline-none focus:border-[#078c52]"
                >
                  <option>Lekki Branch</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 rounded-md border border-[#dfe4e0] px-4 text-xs text-[#525b54] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-[#078c52] px-4 text-xs font-medium text-white hover:bg-[#067344]"
                >
                  <Plus size={14} />
                  Add record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
