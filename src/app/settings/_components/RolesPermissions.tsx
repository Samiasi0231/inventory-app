"use client";

import { useState } from "react";

type Role = {
  id: number;
  name: string;
  description: string;
  staff: number;
  type: "System" | "Custom";
  permissions: Record<string, string[]>;
};

const actions = [
  "View",
  "Create",
  "Edit",
  "Approve",
  "Cancel / Archive",
  "Export",
];

const modules = [
  { name: "Dashboard", allowed: ["View"] },
  {
    name: "Sales",
    allowed: ["View", "Create", "Edit", "Cancel / Archive", "Export"],
  },
  {
    name: "Purchasing",
    allowed: ["View", "Create", "Edit", "Cancel / Archive", "Export"],
  },
  { name: "Inventory", allowed: ["View", "Create", "Edit", "Export"] },
  { name: "Customers", allowed: ["View", "Create", "Edit", "Export"] },
  { name: "Suppliers", allowed: ["View", "Create", "Edit", "Export"] },
  {
    name: "Invoices, Payments & Receipts",
    allowed: ["View", "Create", "Edit", "Export"],
  },
  { name: "Reports", allowed: ["View", "Export"] },
  { name: "Staff", allowed: ["View", "Create", "Edit"] },
  { name: "Approvals", allowed: ["View", "Approve"] },
  { name: "Activity & Audit", allowed: ["View", "Export"] },
  { name: "Branches & Locations", allowed: ["View", "Create", "Edit"] },
];

const emptyPermissions = (): Record<string, string[]> =>
  Object.fromEntries(modules.map((module) => [module.name, []]));

const ownerPermissions = (): Record<string, string[]> =>
  Object.fromEntries(
    modules.map((module) => [module.name, [...module.allowed]]),
  );

const initialRoles: Role[] = [
  {
    id: 1,
    name: "Owner",
    description: "Full control of organization",
    staff: 1,
    type: "System",
    permissions: ownerPermissions(),
  },
  {
    id: 2,
    name: "Manager",
    description: "Operations, approvals and reports",
    staff: 1,
    type: "System",
    permissions: ownerPermissions(),
  },
  {
    id: 3,
    name: "Sales Representative",
    description: "Create sales and receipts",
    staff: 4,
    type: "System",
    permissions: emptyPermissions(),
  },
  {
    id: 4,
    name: "Inventory Manager",
    description: "Managing inventory approvals",
    staff: 2,
    type: "System",
    permissions: emptyPermissions(),
  },
  {
    id: 5,
    name: "Inventory Staff",
    description: "Receive and count stock",
    staff: 4,
    type: "System",
    permissions: emptyPermissions(),
  },
  {
    id: 6,
    name: "Warehouse Supervisor",
    description: "Receive and count stock",
    staff: 4,
    type: "Custom",
    permissions: emptyPermissions(),
  },
];

export default function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showForm, setShowForm] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] =
    useState<Record<string, string[]>>(emptyPermissions());
  const [error, setError] = useState("");

  function openCreate() {
    setEditingId(null);
    setRoleName("");
    setDescription("");
    setPermissions(emptyPermissions());
    setError("");
    setMenuId(null);
    setShowForm(true);
  }

  function openDetails(role: Role) {
    setEditingId(role.id);
    setRoleName(role.name);
    setDescription(role.description);
    setPermissions(
      Object.fromEntries(
        modules.map((module) => [
          module.name,
          [...(role.permissions[module.name] ?? [])],
        ]),
      ),
    );
    setError("");
    setMenuId(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setError("");
  }

  function togglePermission(moduleName: string, action: string) {
    setPermissions((previous) => {
      const current = previous[moduleName] ?? [];
      const next = current.includes(action)
        ? current.filter((item) => item !== action)
        : [...current, action];

      return { ...previous, [moduleName]: next };
    });
  }

  function saveRole() {
    if (!roleName.trim()) {
      setError("Please enter a role name.");
      return;
    }

    const duplicate = roles.some(
      (role) =>
        role.name.toLowerCase() === roleName.trim().toLowerCase() &&
        role.id !== editingId,
    );

    if (duplicate) {
      setError("A role with this name already exists.");
      return;
    }

    if (editingId !== null) {
      setRoles((previous) =>
        previous.map((role) =>
          role.id === editingId
            ? {
                ...role,
                name: roleName.trim(),
                description: description.trim() || "—",
                permissions,
              }
            : role,
        ),
      );
    } else {
      setRoles((previous) => [
        ...previous,
        {
          id: Math.max(0, ...previous.map((role) => role.id)) + 1,
          name: roleName.trim(),
          description: description.trim() || "—",
          staff: 0,
          type: "Custom",
          permissions,
        },
      ]);
    }

    closeForm();
  }

  function archiveRole(role: Role) {
    setMenuId(null);

    if (role.type === "System") {
      window.alert("System roles cannot be archived.");
      return;
    }

    if (window.confirm(`Archive "${role.name}"?`)) {
      setRoles((previous) => previous.filter((item) => item.id !== role.id));
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#f7f8fa] px-5 py-6 font-sans text-[#252925] sm:px-7 lg:px-[30px]">
      {/* Shared page header */}
      <header className="mb-[18px] flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-medium leading-[21px] tracking-[-0.2px]">
            Roles &amp; Permissions
          </h1>
          <p className="mt-[3px] text-[10px] leading-[15px] text-[#888e89]">
            Control access to FINOR modules and business actions
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex h-[30px] shrink-0 items-center gap-[6px] rounded-[4px] bg-[#009b58] px-[12px] text-[10px] font-medium text-white transition-colors hover:bg-[#00864c]"
        >
          <span className="text-[15px] leading-none">+</span>
          Custom Role
        </button>
      </header>

      {showForm ? (
        /* CUSTOM ROLE FORM */
        <section className=" w-full max-w-[850px] rounded-[5px] border border-[#eceeec] bg-white px-5 py-5 sm:px-[26px] sm:py-[22px]">
          <button
            type="button"
            onClick={closeForm}
            className="mb-[10px] text-[10px] text-[#747b76] hover:text-[#009b58]"
          >
            ← Back
          </button>

          <h2 className="text-[12px] font-semibold leading-[18px]">
            Role Details
          </h2>

          <div className="mt-[10px] space-y-[10px]">
            <label className="block">
              <span className="mb-[4px] block text-[9px] text-[#424943]">
                Role Name
              </span>
              <input
                value={roleName}
                onChange={(event) => {
                  setRoleName(event.target.value);
                  setError("");
                }}
                placeholder="Enter role name"
                className="h-[34px] w-full rounded-[4px] border border-[#dfe4df] bg-white px-[9px] text-[10px] outline-none placeholder:text-[#a3a8a4] focus:border-[#009b58]"
              />
            </label>

            <label className="block">
              <span className="mb-[4px] block text-[9px] text-[#424943]">
                Description (optional)
              </span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="h-[34px] w-full rounded-[4px] border border-[#dfe4df] bg-white px-[9px] text-[10px] outline-none placeholder:text-[#a3a8a4] focus:border-[#009b58]"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-2 text-[10px] text-red-600">
              {error}
            </p>
          )}

          <h3 className="mb-[8px] mt-[18px] text-[11px] font-semibold">
            Permissions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] table-fixed border-collapse">
              <thead>
                <tr className="h-[30px] border-y border-[#e8ebe8] bg-[#fafbfa]">
                  <th className="w-[30%] px-[7px] text-left text-[8px] font-medium text-[#666d67]">
                    Area
                  </th>
                  {actions.map((action) => (
                    <th
                      key={action}
                      className="px-[2px] text-center text-[8px] font-medium text-[#666d67]"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module.name}
                    className="h-[29px] border-b border-[#eceeec] last:border-0"
                  >
                    <td className="whitespace-nowrap px-[7px] text-[9px] text-[#4f5650]">
                      {module.name}
                    </td>

                    {actions.map((action) => {
                      const available = module.allowed.includes(action);
                      const checked = (permissions[module.name] ?? []).includes(
                        action,
                      );

                      return (
                        <td key={action} className="px-[2px] text-center">
                          {available ? (
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                togglePermission(module.name, action)
                              }
                              aria-label={`${action} permission for ${module.name}`}
                              className="h-[12px] w-[12px] cursor-pointer accent-[#009b58]"
                            />
                          ) : (
                            <span className="text-[9px] text-[#c5cac6]">–</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-[17px] flex items-center justify-between">
            <button
              type="button"
              onClick={closeForm}
              className="h-[29px] rounded-[4px] border border-[#dfe5e0] px-[13px] text-[9px] text-[#59615b] hover:bg-[#f7f9f7]"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={saveRole}
              className="h-[29px] rounded-[4px] bg-[#009b58] px-[15px] text-[9px] font-medium text-white hover:bg-[#00864c]"
            >
              Save Role
            </button>
          </footer>
        </section>
      ) : (
        /* ROLES TABLE */
        <section className="w-full overflow-visible rounded-[5px] border border-[#e9ece9] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] table-fixed border-collapse">
              <thead>
                <tr className="h-[34px] border-b border-[#e7eae7] bg-[#fafbfa]">
                  <th className="w-[19%] px-[10px] text-left text-[9px] font-medium text-[#555c57]">
                    Role name
                  </th>
                  <th className="w-[43%] px-[10px] text-left text-[9px] font-medium text-[#555c57]">
                    Description
                  </th>
                  <th className="w-[10%] px-2 text-center text-[9px] font-medium text-[#555c57]">
                    Staff
                  </th>
                  <th className="w-[15%] px-2 text-center text-[9px] font-medium text-[#555c57]">
                    Type
                  </th>
                  <th className="w-[13%] px-2 text-center text-[9px] font-medium text-[#555c57]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="h-[34px] border-b border-[#eceeec] last:border-0 hover:bg-[#fcfdfc]"
                  >
                    <td className="whitespace-nowrap px-[10px] text-[9px] text-[#444a45]">
                      {role.name}
                    </td>
                    <td className="whitespace-nowrap px-[10px] text-[9px] text-[#737a74]">
                      {role.description}
                    </td>
                    <td className="px-2 text-center text-[9px] text-[#535a54]">
                      {role.staff}
                    </td>
                    <td className="px-2 text-center">
                      <span
                        className={`inline-flex rounded-full px-[7px] py-[3px] text-[8px] leading-none ${
                          role.type === "System"
                            ? "bg-[#e4f8ed] text-[#009451]"
                            : "bg-[#eeecff] text-[#6556d7]"
                        }`}
                      >
                        {role.type}
                      </span>
                    </td>
                    <td className="relative px-2 text-center">
                      <button
                        type="button"
                        aria-label={`Actions for ${role.name}`}
                        aria-expanded={menuId === role.id}
                        onClick={() =>
                          setMenuId(menuId === role.id ? null : role.id)
                        }
                        className="rounded px-2 py-[3px] text-[12px] leading-none text-[#606660] hover:bg-[#f0f2f0]"
                      >
                        ···
                      </button>

                      {menuId === role.id && (
                        <div className="absolute right-[18px] top-[25px] z-30 w-[132px] rounded-[4px] border border-[#e5e9e6] bg-white py-[3px] text-left shadow-[0_3px_12px_rgba(0,0,0,0.10)]">
                          <button
                            type="button"
                            onClick={() => openDetails(role)}
                            className="flex h-[29px] w-full items-center gap-[7px] bg-[#e5fbf1] px-[9px] text-[9px] text-[#008d50] hover:bg-[#d8f7e8]"
                          >
                            <span>◉</span>
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => archiveRole(role)}
                            className="flex h-[29px] w-full items-center gap-[7px] px-[9px] text-[9px] text-[#444a45] hover:bg-[#f5f6f5]"
                          >
                            <span>▣</span>
                            Archive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
