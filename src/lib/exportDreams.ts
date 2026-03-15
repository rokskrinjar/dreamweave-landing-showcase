import ExcelJS from "exceljs";

interface DreamExport {
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  recorded_at: string;
  sentiment?: string | null;
}

export async function exportDreamsToExcel(dreams: DreamExport[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Dreams");

  worksheet.columns = [
    { header: "Title", key: "title", width: 30 },
    { header: "Date", key: "date", width: 15 },
    { header: "Mood", key: "mood", width: 12 },
    { header: "Sentiment", key: "sentiment", width: 12 },
    { header: "Tags", key: "tags", width: 25 },
    { header: "Content", key: "content", width: 60 },
  ];

  for (const d of dreams) {
    worksheet.addRow({
      title: d.title,
      date: new Date(d.recorded_at).toLocaleDateString(),
      mood: d.mood || "",
      sentiment: d.sentiment || "",
      tags: (d.tags || []).join(", "),
      content: d.content,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-dreams.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}
