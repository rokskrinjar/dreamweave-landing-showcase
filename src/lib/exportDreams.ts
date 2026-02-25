import * as XLSX from "xlsx";

interface DreamExport {
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
  sentiment?: string | null;
}

export function exportDreamsToExcel(dreams: DreamExport[]) {
  const rows = dreams.map((d) => ({
    Title: d.title,
    Date: new Date(d.recorded_at).toLocaleDateString(),
    Mood: d.mood || "",
    Sentiment: d.sentiment || "",
    Tags: (d.tags || []).join(", "),
    Content: d.content,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dreams");
  XLSX.writeFile(wb, "my-dreams.xlsx");
}
