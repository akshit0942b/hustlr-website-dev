// pages/admin/index.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SupabaseVettingData } from "@/src/lib/schemas/formSchema";
import Nav from "@/src/components/Nav";
import { Skeleton } from "@/components/ui/skeleton";
import { verifyToken } from "@/src/lib/jwt";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowUpDown, Settings } from "lucide-react";
import { ScoreBadge } from "@/src/components/admin/ScoreBreakdown";

// add getServerSideProps to check for admin session
export async function getServerSideProps(context: any) {
  const { req } = context;
  const token = req.cookies?.session;
  if (!token) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }
  const payload = verifyToken(token);
  console.log("got this JWT here:", payload);
  const role =
    payload && typeof payload === "object" && typeof payload.role === "string"
      ? payload.role
      : "user";
  const email =
    payload && typeof payload === "object" && typeof payload.email === "string"
      ? payload.email
      : undefined;
  if (role !== "admin" || !email) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { email, jwtToken: token },
  };
}

export default function AdminPanel({
  email,
  jwtToken,
}: {
  email: string;
  jwtToken: string;
}) {
  const [applications, setApplications] = useState<SupabaseVettingData[]>([]);
  const [filtered, setFiltered] = useState<SupabaseVettingData[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [scoreSort, setScoreSort] = useState<"none" | "asc" | "desc">("none");

  // Batch scoring state
  const [batchScoring, setBatchScoring] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/getAllApplications", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
      } else {
        toast.error("Failed to fetch applications");
      }
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Filter + sort pipeline
  useEffect(() => {
    let result = [...applications];

    // Status filter
    if (statusFilter !== "all" && statusFilter !== null) {
      if (statusFilter === "awaiting_review") {
        result = result.filter(
          (app) =>
            app.status === "under_review" ||
            app.status === "round_2_under_review"
        );
      } else {
        result = result.filter((app) => app.status === statusFilter);
      }
    }

    // Score filter
    if (scoreFilter !== "all") {
      result = result.filter((app) => {
        const s = app.final_score;
        switch (scoreFilter) {
          case "60+":
            return s != null && s >= 60;
          case "40-60":
            return s != null && s >= 40 && s < 60;
          case "20-40":
            return s != null && s >= 20 && s < 40;
          case "<20":
            return s != null && s < 20;
          case "unscored":
            return s == null;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (app) =>
          app.email.toLowerCase().includes(term) ||
          (app.name && app.name.toLowerCase().includes(term))
      );
    }

    // Sort by score
    if (scoreSort !== "none") {
      result.sort((a, b) => {
        const sa = a.final_score ?? -1;
        const sb = b.final_score ?? -1;
        return scoreSort === "desc" ? sb - sa : sa - sb;
      });
    }

    setFiltered(result);
  }, [statusFilter, scoreFilter, searchTerm, applications, scoreSort]);

  const toggleScoreSort = () => {
    setScoreSort((prev) => {
      if (prev === "none") return "desc";
      if (prev === "desc") return "asc";
      return "none";
    });
  };

  // Batch score all unscored applications
  const handleScoreAll = async () => {
    const unscored = applications.filter((app) => app.final_score == null);
    if (unscored.length === 0) {
      toast.info("All applications are already scored");
      return;
    }

    setBatchScoring(true);
    setBatchTotal(unscored.length);
    setBatchProgress(0);

    let succeeded = 0;
    let failed = 0;

    for (const app of unscored) {
      try {
        const res = await fetch("/api/admin/scoreApplication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ email: app.email }),
        });
        const data = await res.json();
        if (data.success) {
          succeeded++;
          // Update local state for this application
          setApplications((prev) =>
            prev.map((a) =>
              a.email === app.email
                ? {
                    ...a,
                    final_score: data.data.finalScore,
                    scores: data.data.scores,
                    scored_at: new Date().toISOString(),
                  }
                : a
            )
          );
        } else {
          failed++;
          console.error(`Failed to score ${app.email}:`, data.error);
        }
      } catch {
        failed++;
        console.error(`Network error scoring ${app.email}`);
      }
      setBatchProgress((p) => p + 1);
    }

    setBatchScoring(false);

    if (failed === 0) {
      toast.success(`Scored ${succeeded} application(s) successfully`);
    } else {
      toast.warning(`Scored ${succeeded}, failed ${failed}`);
    }
  };

  const unscoredCount = applications.filter(
    (app) => app.final_score == null
  ).length;

  const router = useRouter();

  return (
    <>
      <Nav />
      <main className="bg-white min-h-screen pt-32">
        <div className="p-10 max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/get-started/");
              }}
              variant="outline"
              className="font-sans font-medium text-sm px-3 py-2 text-black bg-white border border-black/15 hover:bg-gray-500/20 transition-colors rounded flex items-center justify-center gap-2"
            >
              <ArrowLeft className="size-5" />
              Sign Out
            </Button>
            <Button asChild variant="outline" className="font-sans">
              <a
                href="/admin/scoring-config"
                className="flex items-center gap-2"
              >
                <Settings className="size-4" />
                Scoring Config
              </a>
            </Button>
          </div>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription className="text-base text-gray-700">
                Logged in as {email}
              </CardDescription>
            </CardHeader>

            <CardContent className="font-sans">
              {/* Filters row */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Input
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <Select
                  onValueChange={(val) =>
                    setStatusFilter(val === "" ? null : val)
                  }
                  value={statusFilter ?? "all"}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="awaiting_review">
                      Awaiting Review
                    </SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="round_2_eligible">
                      Round 2 Eligible
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={setScoreFilter}
                  value={scoreFilter}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="60+">60%+</SelectItem>
                    <SelectItem value="40-60">40–60%</SelectItem>
                    <SelectItem value="20-40">20–40%</SelectItem>
                    <SelectItem value="<20">&lt;20%</SelectItem>
                    <SelectItem value="unscored">Unscored</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batch scoring */}
              <div className="flex items-center gap-3 mb-4">
                <Button
                  onClick={handleScoreAll}
                  disabled={batchScoring || unscoredCount === 0}
                  variant="outline"
                  className="font-sans"
                >
                  {batchScoring
                    ? `Scoring ${batchProgress}/${batchTotal}...`
                    : `Score All Unscored (${unscoredCount})`}
                </Button>
                {batchScoring && (
                  <div className="flex-1 max-w-xs">
                    <Progress
                      value={
                        batchTotal > 0
                          ? (batchProgress / batchTotal) * 100
                          : 0
                      }
                    />
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="border-b">
                    <tr>
                      <th className="py-2">Name / Email</th>
                      <th>Status</th>
                      <th>
                        <button
                          onClick={toggleScoreSort}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          Score
                          <ArrowUpDown className="size-3" />
                          {scoreSort !== "none" && (
                            <span className="text-xs text-gray-400">
                              {scoreSort === "desc" ? "↓" : "↑"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th>Stage</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="py-2">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="py-2">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="py-2">
                            <Skeleton className="h-4 w-12" />
                          </td>
                          <td className="py-2">
                            <Skeleton className="h-4 w-20" />
                          </td>
                        </tr>
                      ))
                    ) : filtered.length > 0 ? (
                      filtered.map((app, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{app?.name || app.email}</td>
                          <td className="py-2 capitalize">
                            {app.status ?? "Not Set"}
                          </td>
                          <td className="py-2">
                            <ScoreBadge score={app.final_score} />
                          </td>
                          <td className="py-2">{app.currentStage ?? 0}</td>
                          <td className="py-2">
                            <a
                              href={`/admin/applications/${encodeURIComponent(
                                app.email
                              )}`}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Details
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 text-center text-gray-500"
                        >
                          No applications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
