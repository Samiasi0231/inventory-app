import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ReportTable({
  columns,
  rows,
  numericColumns = [],
}: {
  columns: string[];
  rows: string[][];
  numericColumns?: number[];
}) {
  return (
    <Table className="report-table">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead
              key={column}
              className={
                numericColumns.includes(index) ? "report-number" : undefined
              }
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row[0]}>
            {row.map((value, index) => (
              <TableCell
                key={columns[index]}
                className={
                  numericColumns.includes(index) ? "report-number" : undefined
                }
              >
                {value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
