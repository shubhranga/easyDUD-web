import * as XLSX from "xlsx";

export interface ContactLead {
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
}

const LEADS_KEY = "hotel_leads";

export function getStoredLeads(): (ContactLead & { submittedAt: string })[] {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Append the lead to localStorage and trigger a downloadable .xlsx file.
 * Note: server-side persistence would be preferable in production — this
 * matches the explicit "localStorage + downloaded Excel" scope.
 */
export function exportToExcel(data: ContactLead) {
  const existing = getStoredLeads();
  const next = [...existing, { ...data, submittedAt: new Date().toISOString() }];
  localStorage.setItem(LEADS_KEY, JSON.stringify(next));

  const ws = XLSX.utils.json_to_sheet(next);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.writeFile(wb, "hotel_leads.xlsx");
}
