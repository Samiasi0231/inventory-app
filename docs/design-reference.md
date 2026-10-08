# Riinox design reference

A consolidated reference for the product's screens, design tokens and recurring
patterns, extracted from the Figma file. Use this when implementing a screen you
cannot open in Figma.

Source file: `bmHj714cOuFgPYesLxlAMs`, page **Main Design** (`1:5`).

---

## 1. Product map

| Section | Node | Screens | Status in code |
| --- | --- | --- | --- |
| Landing page | `2862:28316` | Marketing site | Out of scope |
| Dashboard | `379:1646` | Dashboard (3 variants) | **Missing** |
| Onboarding | `2078:4425`, `2237:1511` | Business type, business details | Built |
| Forgot password | `2264:2786` | Reset flow | Built |
| Inventory | `379:1771` | Products, Transfer, Adjust, Reorder, Add Product | Built |
| Transactions | `2268:14764` | Sales Orders, Invoices, Receipts, Returns, New Sale | New Sale, Invoices, Sales Orders, Receipts built; Sales History + Credit Notes **missing** |
| Purchasing | `2306:21590` | Purchase Orders, Receive Stock, Record Payment, Record Supplier Invoice, Return Goods, Product Detail | Purchase Orders + its modals built; Product Detail **missing** |
| People | `2393:7505` | Staff, Customers, Suppliers | **Missing** |
| Activity & audit | `2613:11332` | Audit Log, Activity Feed | **Missing** |
| Corrections | `3033:18560` | Purchase order revisions | **Missing** |

### Navigation

The file contains two competing sidebars:

| Structure | Frames | Children |
| --- | --- | --- |
| **Transactions** | Sales Orders, Invoices, New Sale, and the newest Purchase Order frames (`3293:*`) | Sales Orders, Purchase Orders, Invoices, Payments, Receipts |
| **Sales** | the Receipts frame only | New Sales, Invoices, Sales History, Receipts, Credit Notes, Item List |

Four frames carry the first, including the most recently updated batch, so the
codebase follows it: a single **Transactions** group, with Purchase Orders nested
inside rather than sitting at the top level.

Two consequences worth knowing:

- **New Sale has no nav entry.** It is reached from the "Add New Sales" button in
  the topbar, which is how the design presents it.
- **Routes still live under `/sales/*` and `/purchasing/*`** while the nav groups
  them under Transactions. The breadcrumb derives from the nav, so it reads
  correctly; only the URLs differ. Moving them to `/transactions/*` would align
  the two if that is wanted later.

Sales History, Credit Notes and Item List appear only in the Sales variant. Their
routes exist as placeholders but are not linked from the sidebar.

---

## 2. Design tokens

Figma variables (`get_variable_defs`), already reflected in `globals.css`.

### Colour

| Role | Value | Token |
| --- | --- | --- |
| Primary | `#008c4b` | `--primary`, `brand-500` |
| Primary (pressed) | `#006b39` | `brand-700`, `--accent-foreground` |
| Primary background | `#e6fff3` | `--accent`, `success-bg` |
| On primary | `#fefefe` | `--primary-foreground` |
| Error | `#e80d14` | `--destructive`, `danger-fg` |
| Error background | `#ffe7e8` | `danger-bg` |
| Surface | `#fefefe` | `surface`, `--card` |
| Surface muted | `#f7f7f7` | `surface-muted`, `--background` |
| Border | `#bebdbd` | `--border` |
| Text 1 (headings) | `#2f2f2f` | `ink-1` |
| Text 2 (body) | `#3e3d3d` | `ink-2` |
| Text 3 (muted) | `#676565` | `ink-3` |
| Text 4 (placeholder) | `#8d8c8c` | `ink-4` |
| Grey 700 (pagination) | `#48505e` | — |

### Typography

Family **Karla** throughout (`@fontsource-variable/karla`).

| Size | px | Line height | Tracking | Usage |
| --- | --- | --- | --- | --- |
| xs | 10 | 1.3 | 2 | Delta pills, role labels |
| sm | 12 | 1.35 | 1.5 | Table headers, captions, breadcrumb parent |
| base | 14 | 1.4 | 1 | Table cells, nav links, buttons |
| lg | 16 | 1.5 | 0 | Body copy, inputs, breadcrumb current |
| 2xl | 20 | 1.4 | 0 | Page titles |
| 3xl | 24 | 1.25 | 0 | KPI figures |

Weights: Regular 400, Medium 500, SemiBold 600, Bold 700.

### Spacing, radius, layout

- Spacing scale: 4, 8, 12, 16, 20, 24, 32
- Radius: 8 (buttons, inputs, cards, badges), 12 (header card), 24 (page container), 9999 (pills, avatars)
- Sidebar 240px, border-right `0.5px`
- Topbar height 80px, padding `16px 32px`
- Page content padding 32px, section gap 24px
- Card padding 20px
- Inputs 42px tall; compact buttons 32px; primary CTA 48px
- Table: header cells `12px 16px`; rows 64px tall with 56px cell height; row divider `0.5px`

---

## 3. Recurring page pattern

Every management screen follows the same spine:

```
Topbar:   breadcrumb (Section / Page) · global search · bell · help · primary CTA
Header:   white card — title (20px semibold), subtitle (16px), branch selector, Export
KPI row:  4–5 cards — icon + label (14px, ink-3), figure (24px semibold), delta pill, sub-caption (12px)
Toolbar:  search input (42px) + Filter button (32px, bordered, primary text)
Table:    muted rounded header band, 64px rows, status pill, trailing "…" row menu
Footer:   "Showing N of M entries" + numbered pagination with ellipsis
```

Delta pills: `+5.2%` on `success-bg`/`success-fg` for positive, `danger-bg`/`danger-fg` for negative, with a trend arrow and 10px text.

Status pills: 4px leading dot, 12px medium text, fully rounded, `8px 4px` padding.

---

## 4. Screen specifications

### 4.1 Dashboard — *not built*

- Header "Overview" / "Here's what's happening across your business." with branch, period (`This Month`) and Export controls
- KPI row: **Sales** ₦650,400,000 · **Expenses** ₦210,200,000 · **Net Profit** ₦440,200,000 · **Refunds** ₦45,000,000
- Two-column band: **Sales Overview** area chart (₦65.4M headline) and **Smart Alerts** list — Low Stock Alert, Overdue Payment, Expiry Warning, each with an `Urgent` badge
- Two-column band: **Recent activity** feed (View All) and **Top Performing Products** horizontal bars
- **Recent Transactions** table: Ref · Type · Amount · Status · Branch · Date & Time · Actions
- Topbar CTA is **Quick Add** with a menu: Add Product, Add Sales Order, Add Purchase Order

### 4.2 Invoices — *built, needs correction*

Design differs from the current implementation:

- KPI labels are **Invoiced / Paid / Outstanding / Overdue**. Overdue shows a **currency amount in red**, not a count. Sub-captions are counts (`31 Invoices`, `4 invoices`).
- Table columns: **Invoices · Issued · Due · Type · Amount · Balance · Status · Actions**. The **Type** column (`Customer` or `Supplier`) is missing in code.
- Filtering uses a **Filter popover**, not inline chips: heading "Filter", "Filter invoice by…", Status select, Type select, Date Issued and Date Due pickers, and an **Add** button.
- Row menu: **View Details · Send Payment Reminder · Archive Invoice**.
- Subtitle: "Invoices are locked once confirmed. To fix one, cancel it and issue a corrected invoice."

### 4.3 Sales Orders — *not built*

- Subtitle: "Every sale in your organization, including cancelled and pending ones."
- **Five** KPI cards: Total Sales (`Generated from 31 Invoices`), Collected, Outstanding, Gross profit, Invoices (count)
- Table: **Order ID · Customer · Order date · Due date · Total · Balance · Payment · Status · Actions**
- Two independent status dimensions:
  - *Payment*: Unpaid, Partially Paid, Paid, Refunded
  - *Status*: Pending, Confirmed, Fulfilled, Partially Received, Completed, Cancelled
- Row menu varies by status:
  - Completed → View Details, View invoice, View returns, View receipt
  - Partially Received → View Details, Create invoice, Record payment
  - Confirmed → View Details, Send goods, Create invoice, Cancel order

### 4.4 Receipts — *not built*

- Subtitle: "Every sale in your organization, including cancelled and pending ones."
- Table: **Receipt No · Date · Invoice No · Customer · Method · Received by · Amount · Actions**
- Row menu: View Details
- **Sale confirmed** modal containing a printable receipt document:
  - Business name, address, phone
  - `PAYMENT RECEIPT` label, then the amount as the hero figure
  - Rows: Receipt no., Date, Method, Invoice, Customer, Received by
  - Line items, Invoice total, Balance after this payment
  - Footer "Thank you for your business."; actions **Print** and **View sale**
- Dividers inside the document are dashed

### 4.5 Returns / Credit notes — *not built*

**Return items** modal:
- Context line: "INV-2026-0032. Your role can approve returns, so this takes effect immediately."
- Table: **Item · Can return · Qty · Condition** (Condition is a select: `Resalable`)
- **Reason** text field, placeholder "Why is the customer returning this?"
- **Give the customer** select, default `A refund`, hint "Only applies to money already paid. Unpaid balances are simply reduced."
- Actions: Cancel · Record Payment

### 4.6 Purchase Orders — *not built*

- KPI cards: Total Orders (`This month`), Pending Orders (`Awaiting approval`), Completed (`This month`), Outstanding Payments (`Amount yet to be paid`)
- Toolbar: "Search in Purchase Orders", an `All` scope dropdown, and Filter
- Table: **Purchase ID · Supplier · Items · Total Amount · Date · Fulfilled · Payment · Status · Actions**
- Status values: Pending Approval, Received, Completed, Cancelled
- Row menu with **disabled** entries when not applicable: View Details, Receive Goods, Record Supplier Invoice, Return Products, Record Payment, Cancel Order
- Related flows: Receive Stock, Record Payment, Record Supplier Invoice, Return Goods, Product Detail Page, Export/Share panel

#### Purchasing modals

**Record Payment** — subtitle "Record a payment for P-001 from Lagos food co". Opens
with an accent summary block listing Order Total, Already Paid and Balance Due,
then Amount Paid, Reference Number, Payment Method, Payment Date and an optional
Note with a 0/500 counter. Actions: Cancel · Record Payment.

**Receive Products** — subtitle "Enter the quantities actually received for P-001".
Table of Product · Variant · Ordered · Received (input) · Unit · Batch No. (input)
· Expiry Date (input). Actions: Cancel · Receive Stock.

**Return Products** — subtitle "Enter details to return goods". Date and Created by
above a table of Product · Variant · Ordered · Received · Unit · Return Qty (input)
· Batch No. (input) · Reason for Return (select: Damaged, Expired, Wrong order).
Notes (Optional) below. Actions: Cancel · Create Return Request.

**Create Purchase Order** — three steps: Supplier and Logistics, Products, Review.
Step one carries Order Date, Created by, Receiving Branch, Select Supplier with an
"Add New Supplier" link, Supplier's Reference/Invoice Number, Expected Delivery,
Delivery Method and Notes.

**Record Supplier Invoice** — three steps: Invoice Details, Products, Review. Step
one carries Billed To, Created by, Invoice Type, Supplier, Issue Date, Due Date and
Notes.

### 4.6b Inventory — Reorder Stock

Reorder Stock is **not** its own form. It opens the same three-step
**Create Purchase Order** wizard used by Purchasing, with the product pre-filled
from the row it was started on:

1. **Supplier and Logistics** — Order Date, Created by, Receiving Branch, Select
   Supplier (+ Add New Supplier), Supplier's Reference/Invoice Number, Expected
   Delivery, Delivery Method, Notes
2. **Products** — table of Product · Variant · Unit · Quantity · Unit Cost (₦) ·
   Total (₦), a trash icon per row and "+ Add Product". The cells are borderless
   dropdowns and plain figures inside a single bordered container
3. **Review** — a "Supplier and Logistics" card (label left, value right) and a
   "Products" card with the same table plus an accent **Grand Total** bar

The stepper shows completed steps with a tick and a green label.

Known copy slips in the frames, deliberately not reproduced: "Order Dtae",
"purchse", and a primary button reading "Request Transfer" on every step.

### 4.7 People — *not built*

Three tabs, each a list plus modal flows:
- **Staff** — Invite Staff, Edit Staff, Suspend Staff, Restore Access, Pending Invitation, Delete Staff
- **Customers** — Add Customer, Edit Customer, Archive Customer
- **Suppliers** — Add Supplier, View Details, Edit Supplier, Delete Supplier

### 4.8 Activity & Audit — *not built*

- **Audit Log** — table, entry details side panel (420px), filter popover, status dropdown, Export Audit modal, empty state
- **Activity Feed** — grouped timeline (Today / Yesterday / This Week), details panel, empty state

---

## 5. Interaction patterns

- Row actions always live in a trailing `…` menu; destructive entries are last and red; inapplicable entries are disabled rather than hidden
- Modals: fixed header (title + subtitle + close), scrolling body, pinned footer with secondary left / primary right
- Multi-step flows use a numbered stepper with completed steps ticked and clickable
- Confirmation after a write shows a success banner plus the generated document
- Filters open in a popover and apply on an explicit button, not on change
- Destructive actions confirm in a small dialog and explain what is retained

## 6. Responsive rules

No tablet or mobile frames exist in the file. The implemented convention:

- Sidebar collapses to an off-canvas drawer below `lg`
- Global search hides below `lg`; notification and help hide below `sm`
- KPI rows go 4 → 2 → 1 column
- Tables keep a minimum width and scroll horizontally inside their card
- Modal grids collapse to a single column below `sm`

## 7. Data requirements

Captured in `src/types/shared.ts` and the per-feature `types.ts` files. Money is
in major units (naira), timestamps are ISO-8601, and list endpoints return
`{ data, page, pageSize, total }`.

Status values are **derived** from figures rather than stored, so badges and
totals cannot disagree.
