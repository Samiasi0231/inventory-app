"use client";

import { useMemo, useState } from "react";

type Location = {
  id: number;
  name: string;
  code: string;
  address: string;
  staff: number;
  status: "Active" | "Inactive";
};

const initialLocations: Location[] = [
  {
    id: 1,
    name: "Main Warehouse",
    code: "Main",
    address: "12, Marina Road, Lagos Island",
    staff: 4,
    status: "Active",
  },
  {
    id: 2,
    name: "Lekki Branch",
    code: "Lek",
    address: "Admiralty Way, Lekki Phase 1",
    staff: 2,
    status: "Inactive",
  },
  {
    id: 3,
    name: "Lekki Branch",
    code: "Lek",
    address: "Obafemi Awolowo Way, Ikeja",
    staff: 2,
    status: "Inactive",
  },
];

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export default function BranchesPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    staff: "0",
  });

  const activeCount = locations.filter(
    (location) => location.status === "Active",
  ).length;

  const inactiveCount = locations.filter(
    (location) => location.status === "Inactive",
  ).length;

  const filteredLocations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return locations.filter((location) => {
      const matchesSearch = [
        location.name,
        location.code,
        location.address,
        location.status,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesFilter = filter === "All" || location.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [locations, search, filter]);

  function addLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newLocation: Location = {
      id: Date.now(),
      name: form.name.trim(),
      code: form.code.trim(),
      address: form.address.trim(),
      staff: Math.max(0, Number(form.staff) || 0),
      status: "Active",
    };

    setLocations((previous) => [...previous, newLocation]);
    setForm({ name: "", code: "", address: "", staff: "0" });
    setShowForm(false);
  }

  function toggleStatus(id: number) {
    setLocations((previous) =>
      previous.map((location) =>
        location.id === id
          ? {
              ...location,
              status: location.status === "Active" ? "Inactive" : "Active",
            }
          : location,
      ),
    );

    setMenuOpen(null);
  }

  function deleteLocation(id: number) {
    setLocations((previous) =>
      previous.filter((location) => location.id !== id),
    );

    setMenuOpen(null);
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#303030]">
      {/* Page header */}
      <header className="flex min-h-[60px] items-center justify-between gap-4 border-b border-[#dedede] bg-white px-5 py-3 sm:px-[22px]">
        <div>
          <h1 className="text-[13px] font-semibold tracking-[0.2px]">
            Branches &amp; Locations
          </h1>

          <p className="mt-[5px] text-[9px] tracking-[0.1px] text-[#777777]">
            Manage your business locations and their operational settings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex h-[33px] shrink-0 items-center justify-center gap-1.5 rounded-[6px] bg-[#008f50] px-4 text-[10px] font-medium text-white transition hover:bg-[#007d45] focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
        >
          <PlusIcon />
          <span>Add Location</span>
        </button>
      </header>

      <div className="px-5 pb-8 pt-[22px] sm:px-[22px]">
        {/* Summary cards */}
        <section
          aria-label="Location statistics"
          className="grid grid-cols-1 gap-3.5 sm:grid-cols-3"
        >
          <StatCard label="Total Locations" value={locations.length} />

          <StatCard label="Active" value={activeCount} />

          <StatCard label="Inactive" value={inactiveCount} />
        </section>

        {/* Locations table */}
        <section className="mt-[19px] rounded-[9px] bg-white px-[14px] pb-[13px] pt-4 sm:px-[14px]">
          {/* Search and filter */}
          <div className="mb-[13px] flex items-center justify-between gap-3">
            <div className="flex h-[29px] w-full max-w-[429px] items-center gap-2 rounded-[6px] border border-[#d1d1d1] px-3 text-[#888888] focus-within:border-[#008f50] focus-within:ring-1 focus-within:ring-[#008f50]">
              <SearchIcon />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in Supplier List"
                aria-label="Search locations"
                className="h-full w-full bg-transparent text-[10px] text-[#333333] outline-none placeholder:text-[#929292]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-[15px] hover:text-black"
                >
                  ×
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                aria-expanded={filterOpen}
                className="flex h-[23px] items-center gap-1.5 rounded-[6px] border border-[#d1d1d1] bg-white px-2 text-[10px] text-[#333333] transition hover:bg-gray-50"
              >
                <span className="text-[#008f50]">
                  <FilterIcon />
                </span>

                {filter === "All" ? "Filter" : filter}

                <ChevronDown />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-8 z-20 w-[130px] rounded-md border border-[#e5e5e5] bg-white p-1 shadow-lg">
                  {(["All", "Active", "Inactive"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFilter(option);
                        setFilterOpen(false);
                      }}
                      className={`block w-full rounded px-3 py-2 text-left text-[11px] hover:bg-[#f3f8f5] ${
                        filter === option
                          ? "font-medium text-[#008f50]"
                          : "text-gray-700"
                      }`}
                    >
                      {option === "All" ? "All Locations" : option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[23%]" />
                <col className="w-[16%]" />
                <col className="w-[33%]" />
                <col className="w-[8%]" />
                <col className="w-[13%]" />
                <col className="w-[7%]" />
              </colgroup>

              <thead>
                <tr className="h-[27px] rounded-md bg-[#f7f7f7] text-[8px] font-semibold text-[#292929]">
                  <th className="rounded-l-md px-[11px] font-semibold">
                    Location
                  </th>
                  <th className="px-2 font-semibold">Code</th>
                  <th className="px-2 font-semibold">Address</th>
                  <th className="px-2 font-semibold">Staff</th>
                  <th className="px-2 font-semibold">Status</th>
                  <th className="rounded-r-md px-2 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLocations.map((location) => (
                  <tr
                    key={location.id}
                    className="h-[43px] border-b border-[#e0e0e0] text-[9px] text-[#505050] transition hover:bg-[#fcfcfc]"
                  >
                    <td className="truncate px-[11px]">{location.name}</td>

                    <td className="truncate px-2">{location.code}</td>

                    <td className="truncate px-2" title={location.address}>
                      {location.address}
                    </td>

                    <td className="px-2">{location.staff}</td>

                    <td className="px-2">
                      <span
                        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-[7px] py-[4px] text-[8px] font-medium ${
                          location.status === "Active"
                            ? "bg-[#e5faf0] text-[#00864b]"
                            : "bg-[#f3f3f3] text-[#666666]"
                        }`}
                      >
                        <span
                          className={`h-[4px] w-[4px] rounded-full ${
                            location.status === "Active"
                              ? "bg-[#00a65a]"
                              : "bg-[#888888]"
                          }`}
                        />
                        {location.status}
                      </span>
                    </td>

                    <td className="relative px-2 text-center">
                      <button
                        type="button"
                        aria-label={`Actions for ${location.name}`}
                        aria-expanded={menuOpen === location.id}
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === location.id ? null : location.id,
                          )
                        }
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[15px] tracking-[1px] hover:bg-gray-100"
                      >
                        ···
                      </button>

                      {menuOpen === location.id && (
                        <div className="absolute right-2 top-9 z-20 w-[135px] rounded-md border border-[#e5e5e5] bg-white p-1 text-left shadow-lg">
                          <button
                            type="button"
                            onClick={() => toggleStatus(location.id)}
                            className="w-full rounded px-3 py-2 text-left text-[10px] hover:bg-gray-100"
                          >
                            Set{" "}
                            {location.status === "Active"
                              ? "Inactive"
                              : "Active"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteLocation(location.id)}
                            className="w-full rounded px-3 py-2 text-left text-[10px] text-red-600 hover:bg-red-50"
                          >
                            Delete location
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLocations.length === 0 && (
              <div className="py-10 text-center text-[11px] text-gray-500">
                No locations found.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add location modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-location-title"
            className="w-full max-w-[420px] rounded-xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 id="add-location-title" className="text-base font-semibold">
                Add Location
              </h2>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close modal"
                className="text-xl text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>

            <form onSubmit={addLocation} className="space-y-4">
              <FormField label="Location Name">
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Ikeja Branch"
                  className={fieldClass}
                />
              </FormField>

              <FormField label="Location Code">
                <input
                  required
                  value={form.code}
                  onChange={(event) =>
                    setForm({ ...form, code: event.target.value })
                  }
                  placeholder="e.g. Ike"
                  className={fieldClass}
                />
              </FormField>

              <FormField label="Address">
                <input
                  required
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Enter full address"
                  className={fieldClass}
                />
              </FormField>

              <FormField label="Number of Staff">
                <input
                  type="number"
                  min="0"
                  required
                  value={form.staff}
                  onChange={(event) =>
                    setForm({ ...form, staff: event.target.value })
                  }
                  className={fieldClass}
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-[#008f50] px-4 py-2 text-xs font-medium text-white hover:bg-[#007d45]"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex h-[72px] flex-col justify-center rounded-[7px] bg-white px-[14px]">
      <p className="text-[9px] font-normal text-[#777777]">{label}</p>

      <p className="mt-[8px] text-[16px] font-semibold leading-none text-[#222222]">
        {value}
      </p>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldClass =
  "h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#008f50] focus:ring-1 focus:ring-[#008f50]";
