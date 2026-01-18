import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FileMeta = {
  name: string;
  size: number;
  url: string;
};

const fileFields = ["resume", "transcript", "studentId"];

export default function VettingDataDisplay({
  data,
  jwtToken,
}: {
  data: Record<string, any>;
  jwtToken: string;
}) {
  const [fileMeta, setFileMeta] = useState<Record<string, FileMeta | null>>({});

  useEffect(() => {
    const fetchFileMeta = async () => {
      const meta: Record<string, FileMeta | null> = {};

      await Promise.all(
        fileFields.map(async (field) => {
          const path = data[field];
          if (typeof path === "string" && path.startsWith("applications/")) {
            try {
              const res = await fetch(
                `/api/file/metadata?path=${encodeURIComponent(path)}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${jwtToken}`, // pass your token here
                  },
                }
              );

              const result = await res.json();
              meta[field] = res.ok ? result.file : null;
              toast.success(`Fetched ${field} metadata successfully`);
            } catch {
              toast.error(`Failed to fetch ${field} metadata`);
              console.error(`Failed to fetch ${field} metadata`);
              meta[field] = null;
            }
          } else {
            toast.warning(`The user hasn't submitted ${field} yet.`);
            console.warn(`Invalid path for ${field}:`, path);
            meta[field] = null;
          }
        })
      );
      if (Object.keys(meta).length === 0) {
        toast.warning("No valid file paths found in the data");
      }
      setFileMeta(meta);
    };

    fetchFileMeta();
  }, [data]);

  return (
    <Table className="mt-5">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">Field</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([key, value]) => {
          if (fileFields.includes(key) && fileMeta[key]) {
            const meta = fileMeta[key]!;
            return (
              <TableRow key={key} className="text-base">
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {meta.name} ({(meta.size / 1024 / 1024).toFixed(2)} MB)
                  </a>
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>
                {typeof value === "string"
                  ? value
                  : JSON.stringify(value, null, 2)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
