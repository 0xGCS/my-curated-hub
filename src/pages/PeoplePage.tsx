import { Layout } from "@/components/layout/Layout";
import { DataTable, ColumnConfig } from "@/components/data-table/DataTable";
import { useCsvData } from "@/hooks/useCsvData";
import { Skeleton } from "@/components/ui/skeleton";

const columns: ColumnConfig[] = [
  { key: "name", label: "Name", type: "string", width: "min-w-[150px]" },
  { key: "screen_name", label: "Twitter Handle", type: "string", width: "min-w-[120px]" },
  { key: "description", label: "Description", type: "string", width: "min-w-[250px]" },
  { key: "expanded_url", label: "URL", type: "url", width: "min-w-[150px]" },
  { key: "followers_count", label: "Followers", type: "number", width: "min-w-[100px]" },
  { key: "following_count", label: "Following", type: "number", width: "min-w-[100px]" },
  { key: "category", label: "Category", type: "string", width: "min-w-[100px]" },
  { key: "tag", label: "Tags", type: "tags", width: "min-w-[150px]" },
  { key: "date_added", label: "Date Added", type: "date", width: "min-w-[100px]" },
];

export default function PeoplePage() {
  const { data, loading, error } = useCsvData("/data/people.csv");

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-2">People</h1>
          <p className="text-muted-foreground">
            Individual accounts across all categories — researchers, analysts, creators, and thought leaders.
          </p>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error loading data: {error}
          </div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            pageTitle="People"
          />
        )}
      </div>
    </Layout>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[260px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="border rounded-xl overflow-hidden">
        <div className="bg-muted p-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-4 border-t">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="h-4 w-24" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
