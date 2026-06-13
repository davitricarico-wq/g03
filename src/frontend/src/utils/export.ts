/* ===========================================================
   Exportação de dados — CSV (nativo) e PDF (jsPDF sob demanda)
   =========================================================== */

type Linha = Record<string, string | number>;

function baixarBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function dataArquivo(): string {
    return new Date().toISOString().slice(0, 10);
}

/* ---------- CSV (sem dependências) ---------- */
function escaparCsv(valor: string | number): string {
    const s = String(valor ?? '');
    if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

export function exportarCSV(linhas: Linha[], nomeBase: string) {
    if (linhas.length === 0) return;
    const colunas = Object.keys(linhas[0]);
    const cabecalho = colunas.map(escaparCsv).join(';');
    const corpo = linhas.map((l) => colunas.map((c) => escaparCsv(l[c])).join(';')).join('\n');
    // BOM para acentuação correta no Excel
    const blob = new Blob(['﻿' + cabecalho + '\n' + corpo], { type: 'text/csv;charset=utf-8' });
    baixarBlob(blob, `${nomeBase}_${dataArquivo()}.csv`);
}

/* ---------- PDF (jsPDF + autotable carregados sob demanda) ---------- */
let pdfPromise: Promise<void> | null = null;

function carregarScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
        document.head.appendChild(s);
    });
}

function garantirJsPdf(): Promise<void> {
    if ((window as unknown as { jspdf?: unknown }).jspdf) return Promise.resolve();
    if (pdfPromise) return pdfPromise;
    pdfPromise = carregarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
        .then(() => carregarScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'));
    return pdfPromise;
}

export interface PdfTabela {
    titulo: string;
    subtitulo?: string;
    colunas: string[];
    linhas: (string | number)[][];
}

export async function exportarPDF(tabela: PdfTabela, nomeBase: string): Promise<void> {
    await garantirJsPdf();
    const { jsPDF } = (window as unknown as { jspdf: { jsPDF: new (opts: object) => any } }).jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFontSize(16);
    doc.setTextColor(0, 78, 161);
    doc.setFont(undefined, 'bold');
    doc.text(tabela.titulo, 14, 14);

    if (tabela.subtitulo) {
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont(undefined, 'normal');
        doc.text(tabela.subtitulo, 14, 20);
    }

    doc.autoTable({
        startY: 26,
        head: [tabela.colunas],
        body: tabela.linhas,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [24, 44, 76], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [238, 241, 245] }
    });

    doc.save(`${nomeBase}_${dataArquivo()}.pdf`);
}
