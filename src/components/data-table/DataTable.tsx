import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ColumnConfig {
  key: string;
  label: string;
  type: "string" | "number" | "date" | "url" | "tags";
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

interface Filter {
  column: string;
  operator: string;
  value: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnConfig[];
  pageTitle: string;
}

const ROWS_PER_PAGE_OPTIONS = [15, 25, 50, 100];

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  pageTitle,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = row[col.key];
          return String(value || "").toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      const column = columns.find((c) => c.key === filter.column);
      if (!column) return;

      result = result.filter((row) => {
        const value = row[filter.column];
        const filterValue = filter.value.toLowerCase();

        if (column.type === "number") {
          const numValue = parseFloat(String(value) || "0");
          const numFilter = parseFloat(filter.value);
          if (isNaN(numFilter)) return true;

          switch (filter.operator) {
            case "<": return numValue < numFilter;
            case "<=": return numValue <= numFilter;
            case "=": return numValue === numFilter;
            case ">=": return numValue >= numFilter;
            case ">": return numValue > numFilter;
            default: return true;
          }
        } else {
          const strValue = String(value || "").toLowerCase();
          switch (filter.operator) {
            case "contains": return strValue.includes(filterValue);
            case "not_contains": return !strValue.includes(filterValue);
            default: return true;
          }
        }
      });
    });

    // Apply sort
    if (sortColumn) {
      const column = columns.find((c) => c.key === sortColumn);
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (column?.type === "number") {
          const aNum = parseFloat(String(aVal) || "0");
          const bNum = parseFloat(String(bVal) || "0");
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }

        const aStr = String(aVal || "").toLowerCase();
        const bStr = String(bVal || "").toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [data, columns, searchQuery, filters, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const addFilter = (filter: Filter) => {
    setFilters([...filters, filter]);
    setCurrentPage(1);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
    setCurrentPage(1);
  };

  const exportData = (format: "csv" | "json") => {
    const exportData = processedData;
    const date = new Date().toISOString().split("T")[0];
    const filename = `${pageTitle.toLowerCase().replace(/\s+/g, "-")}_${date}`;

    if (format === "csv") {
      const headers = columns.map((c) => c.label).join(",");
      const rows = exportData.map((row) =>
        columns
          .map((c) => {
            const value = String(row[c.key] || "");
            return value.includes(",") ? `"${value}"` : value;
          })
          .join(",")
      );
      const csv = [headers, ...rows].join("\n");
      downloadFile(csv, `${filename}.csv`, "text/csv");
    } else {
      const json = JSON.stringify(exportData, null, 2);
      downloadFile(json, `${filename}.json`, "application/json");
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderCell = (row: T, column: ColumnConfig) => {
    const value = row[column.key];
    const strValue = String(value || "");

    switch (column.type) {
      case "url":
        return strValue ? (
          <a
            href={strValue.startsWith("http") ? strValue : `https://${strValue}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline truncate block max-w-[200px]"
          >
            {strValue.replace(/^https?:\/\//, "").slice(0, 30)}
            {strValue.length > 30 ? "..." : ""}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        );

      case "number":
        const num = parseInt(strValue.replace(/,/g, ""));
        return (
          <span className="font-medium tabular-nums">
            {isNaN(num) ? strValue : num.toLocaleString()}
          </span>
        );

      case "tags":
        if (!strValue || strValue === "[]") return <span className="text-muted-foreground">—</span>;
        const tags = strValue.split(",").map((t) => t.trim()).filter(Boolean);
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        );

      case "date":
        return <span className="text-muted-foreground">{strValue}</span>;

      default:
        const maxLength = column.key === "description" ? 60 : 40;
        return (
          <span className="block truncate" title={strValue}>
            {strValue.slice(0, maxLength)}
            {strValue.length > maxLength ? "..." : ""}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 w-[200px] sm:w-[260px]"
            />
          </div>

          {/* Filter Button */}
          <FilterPopover columns={columns} onAddFilter={addFilter} />
        </div>

        {/* Export */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportData("csv")}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportData("json")}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="gap-1 px-3 py-1"
            >
              <span className="font-medium">
                {columns.find((c) => c.key === filter.column)?.label}
              </span>
              <span className="text-muted-foreground">{filter.operator}</span>
              <span>"{filter.value}"</span>
              <button
                onClick={() => removeFilter(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters([])}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "table-header-cell whitespace-nowrap",
                    column.sortable !== false && "cursor-pointer select-none hover:bg-accent/50",
                    column.width
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <span className="text-muted-foreground">
                        {sortColumn === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="table-cell text-center py-12 text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="table-row-interactive">
                  {columns.map((column) => (
                    <td key={column.key} className="table-cell">
                      {renderCell(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-4">
            {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, processedData.length)} of{" "}
            {processedData.length} rows
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Filter Popover Component
function FilterPopover({
  columns,
  onAddFilter,
}: {
  columns: ColumnConfig[];
  onAddFilter: (filter: Filter) => void;
}) {
  const [column, setColumn] = useState<string>("");
  const [operator, setOperator] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  const filterableColumns = columns.filter((c) => c.filterable !== false);
  const selectedColumn = columns.find((c) => c.key === column);
  const isNumeric = selectedColumn?.type === "number";

  const operators = isNumeric
    ? [
        { value: "<", label: "Less than" },
        { value: "<=", label: "Less than or equal" },
        { value: "=", label: "Equals" },
        { value: ">=", label: "Greater than or equal" },
        { value: ">", label: "Greater than" },
      ]
    : [
        { value: "contains", label: "Contains" },
        { value: "not_contains", label: "Does not contain" },
      ];

  const handleAdd = () => {
    if (!column || !operator || !value) return;

    if (isNumeric && isNaN(parseFloat(value))) {
      setError("Please only enter a number");
      return;
    }

    onAddFilter({ column, operator, value });
    setColumn("");
    setOperator("");
    setValue("");
    setError("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Add Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Column</label>
            <Select value={column} onValueChange={(v) => { setColumn(v); setOperator(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {filterableColumns.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {column && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Operator</label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {operator && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                placeholder={isNumeric ? "Enter number" : "Enter text"}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}

          <Button onClick={handleAdd} className="w-full" disabled={!column || !operator || !value}>
            Add Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
