import jsPDF from 'jspdf';
import { CroutResult } from '../types/crout';
import { formatNum } from './croutSolver';

export function exportResultToPDF(result: CroutResult, title = 'Reporte de Resolución Numérica'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 18;

  // Header background banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand and Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CroutSolve', 15, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text('Plataforma Educativa de Métodos Numéricos & Ingeniería Civil', 15, 21);

  const dateStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Fecha: ${dateStr}`, pageWidth - 15, 21, { align: 'right' });

  currentY = 38;

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 15, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(
    `Sistema de Ecuaciones Lineales de orden ${result.dimension}x${result.dimension} resuelto mediante el Método de Crout (A = L · U)`,
    15,
    currentY
  );
  currentY += 10;

  // Section 1: Sistema Original
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(15, currentY, pageWidth - 30, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('1. SISTEMA ORIGINAL (A x = b)', 18, currentY + 5.5);
  currentY += 14;

  const n = result.dimension;

  // Print equations
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  for (let i = 0; i < n; i++) {
    const terms: string[] = [];
    for (let j = 0; j < n; j++) {
      const coeff = result.matrixA[i][j];
      const sign = j > 0 && coeff >= 0 ? '+ ' : coeff < 0 ? '- ' : '';
      const absCoeff = j > 0 ? Math.abs(coeff) : coeff;
      terms.push(`${sign}${formatNum(absCoeff)} · x_${j + 1}`);
    }
    const eqLine = `Ecuación ${i + 1}:   ${terms.join(' ')}  =  ${formatNum(result.vectorB[i])}`;
    doc.text(eqLine, 20, currentY);
    currentY += 5;
  }
  currentY += 6;

  // Section 2: Descomposición LU de Crout
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, currentY, pageWidth - 30, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('2. FACTORIZACIÓN LU DE CROUT:  A = L · U', 18, currentY + 5.5);
  currentY += 13;

  // Print L and U side by side
  const leftX = 20;
  const rightX = 110;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Matriz L (Triangular Inferior):', leftX, currentY);
  doc.text('Matriz U (Triangular Superior Unitaria):', rightX, currentY);
  currentY += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  for (let i = 0; i < n; i++) {
    const rowL = result.matrixL[i].map((v) => formatNum(v, 3).padStart(7, ' ')).join(' ');
    const rowU = result.matrixU[i].map((v) => formatNum(v, 3).padStart(7, ' ')).join(' ');

    doc.text(`[ ${rowL} ]`, leftX, currentY);
    doc.text(`[ ${rowU} ]`, rightX, currentY);
    currentY += 5;
  }
  currentY += 8;

  // Section 3: Sustitución hacia adelante Ly = b
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, currentY, pageWidth - 30, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('3. SUSTITUCIÓN HACIA ADELANTE:  L · y = b', 18, currentY + 5.5);
  currentY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  result.forwardSteps.forEach((step) => {
    doc.text(`• ${step.calcStr}`, 20, currentY);
    currentY += 4.5;
  });

  const vectorYStr = result.vectorY.map((v, i) => `y_${i + 1} = ${formatNum(v, 4)}`).join(', ');
  doc.setFont('helvetica', 'bold');
  doc.text(`Vector intermedio y = [ ${vectorYStr} ]`, 20, currentY);
  currentY += 8;

  // Check if we need a new page for results
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Section 4: Sustitución hacia atrás Ux = y
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, currentY, pageWidth - 30, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('4. SUSTITUCIÓN HACIA ATRÁS:  U · x = y', 18, currentY + 5.5);
  currentY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  result.backwardSteps.forEach((step) => {
    doc.text(`• ${step.calcStr}`, 20, currentY);
    currentY += 4.5;
  });
  currentY += 3;

  // Highlight Box for Final Solution
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(59, 130, 246); // blue-500
  doc.roundedRect(15, currentY, pageWidth - 30, 16 + n * 4, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text('VECTOR SOLUCIÓN FINAL (x):', 20, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);

  let solY = currentY + 13;
  result.vectorX.forEach((val, idx) => {
    doc.text(`x_${idx + 1} = ${formatNum(val, 6)}`, 25, solY);
    solY += 4.5;
  });

  currentY = solY + 8;

  // Section 5: Verificación Numérica Ax = b
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, currentY, pageWidth - 30, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 58, 138);
  doc.text('5. VERIFICACIÓN Y RESIDUOS:  A · x ≈ b', 18, currentY + 5.5);
  currentY += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  result.verificationRows.forEach((v) => {
    doc.text(
      `Fila ${v.row}: ${v.equationStr}  (Diferencia = ${v.difference.toExponential(2)}) - ${v.isSatisfied ? 'Correcto' : 'Discrepancia'}`,
      20,
      currentY
    );
    currentY += 4.5;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`Residuo máximo en norma infinita ||Ax - b|| = ${result.maxResidue.toExponential(4)}`, 20, currentY + 2);
  currentY += 12;

  // Footer notes
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Generado por CroutSolve · Aplicaciones en Métodos Numéricos & Análisis Estructural para Ingeniería Civil.',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  // Save the PDF
  const filename = `CroutSolve_${result.dimension}x${result.dimension}_${Date.now()}.pdf`;
  doc.save(filename);
}
