import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDatePt } from './utils.js';
function loadImage(src) { return new Promise((resolve,reject) => { const im=new Image(); im.onload=()=>resolve(im); im.onerror=reject; im.src=src; }); }
export async function exportPdf(report, properties) {
 const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}); const w=pdf.internal.pageSize.getWidth(); const h=pdf.internal.pageSize.getHeight(); const m=14;
 pdf.setTextColor(23,54,93); pdf.setFont('helvetica','bold'); pdf.setFontSize(18); pdf.text('SIALDRILL',w/2,16,{align:'center'}); pdf.setFontSize(13); pdf.text('RELATÓRIO FOTOGRÁFICO DE RAMAIS',w/2,24,{align:'center'});
 pdf.setFillColor(234,241,248); pdf.roundedRect(m,30,w-2*m,29,2,2,'F'); pdf.setTextColor(35,48,65); pdf.setFont('helvetica','normal'); pdf.setFontSize(9);
 pdf.text(`Consórcio: ${report.consortium||'-'}`,m+4,35); pdf.text(`Rua: ${report.street||'-'}`,m+4,41); pdf.text(`Data: ${formatDatePt(report.date)}`,m+4,47); pdf.text(`Responsável: ${report.responsible||'-'}`,m+4,53); if(report.notes) pdf.text(`Observações: ${report.notes.slice(0,100)}`,m+4,57);
 pdf.setFont('helvetica','bold'); pdf.setTextColor(23,54,93); pdf.setFontSize(11); pdf.text('1. TABELA DE INFORMAÇÕES DOS RAMAIS',m,64);
 autoTable(pdf,{startY:68,margin:{left:m,right:m},head:[['Endereço','Número','Cruza Rede de Gás','Distância / Paralelismo','Lado']],body:properties.map(p=>[p.address||report.street||'-',p.number||'-',p.gasCrossing||'-',p.distance||'-',p.side||'-']),styles:{font:'helvetica',fontSize:7,cellPadding:2.2,overflow:'linebreak'},headStyles:{fillColor:[23,54,93],textColor:255},alternateRowStyles:{fillColor:[242,246,250]},columnStyles:{0:{cellWidth:62},1:{cellWidth:19},2:{cellWidth:30},3:{cellWidth:37},4:{cellWidth:20}}});
 pdf.addPage(); pdf.setFont('helvetica','bold'); pdf.setTextColor(23,54,93); pdf.setFontSize(14); pdf.text('2. REGISTRO FOTOGRÁFICO',m,20); pdf.setFont('helvetica','normal'); pdf.setFontSize(9); pdf.text('Uma fotografia grande por página, com legenda vinculada à linha do imóvel na tabela.',m,27);
 const photos=properties.filter(p=>p.photoData);
 for(let i=0;i<photos.length;i++){ const p=photos[i]; pdf.addPage(); pdf.setFont('helvetica','bold'); pdf.setTextColor(23,54,93); pdf.setFontSize(14); pdf.text(`REGISTRO FOTOGRÁFICO — IMÓVEL ${properties.findIndex(x=>x.id===p.id)+1}`,m,18); pdf.setFontSize(10); pdf.text(`Nº ${p.number||'-'}`,m,25);
 try { const im=await loadImage(p.photoData); const maxW=w-2*m,maxH=165,ratio=Math.min(maxW/im.width,maxH/im.height),iw=im.width*ratio,ih=im.height*ratio,x=(w-iw)/2,y=31+(maxH-ih)/2; pdf.addImage(p.photoData,p.photoData.startsWith('data:image/png')?'PNG':'JPEG',x,y,iw,ih,undefined,'FAST'); }
 catch { pdf.text('Não foi possível carregar esta fotografia.',m,45); }
 autoTable(pdf,{startY:202,margin:{left:m,right:m},body:[['Endereço',p.address||report.street||'-'],['Número do imóvel',p.number||'-'],['Cruza Rede de Gás',p.gasCrossing||'-'],['Distância / Paralelismo',p.distance||'-'],['Lado',p.side||'-']],theme:'grid',styles:{font:'helvetica',fontSize:9,cellPadding:2.5},columnStyles:{0:{cellWidth:52,fontStyle:'bold',fillColor:[234,241,248]}}});
 }
 pdf.save('relatorio-fotografico-ramais.pdf');
}

export async function exportMappingPdf(mapping, photos) {
 const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}); const w=pdf.internal.pageSize.getWidth(),h=pdf.internal.pageSize.getHeight(),m=14;
 pdf.setTextColor(23,54,93);pdf.setFont('helvetica','bold');pdf.setFontSize(18);pdf.text('SIALDRILL',w/2,18,{align:'center'});pdf.setFontSize(14);pdf.text('RELATÓRIO DE MAPEAMENTO',w/2,28,{align:'center'});
 pdf.setFillColor(234,241,248);pdf.roundedRect(m,38,w-2*m,34,2,2,'F');pdf.setTextColor(35,48,65);pdf.setFont('helvetica','normal');pdf.setFontSize(11);pdf.text(`Consórcio: ${mapping.consortium||'-'}`,m+5,47);pdf.text(`Rua: ${mapping.street||'-'}`,m+5,56);pdf.text(`Trecho: ${mapping.segment||'-'}`,m+5,65);pdf.setFontSize(9);pdf.text(`Data: ${formatDatePt(mapping.date)}`,m+5,78);
 for(let i=0;i<photos.length;i++){const photo=photos[i];pdf.addPage();pdf.setFont('helvetica','bold');pdf.setTextColor(23,54,93);pdf.setFontSize(12);pdf.text(`MAPEAMENTO — ${mapping.street||'-'}`,m,18);pdf.setFont('helvetica','normal');pdf.setFontSize(10);pdf.text(`Trecho: ${mapping.segment||'-'}   |   Consórcio: ${mapping.consortium||'-'}`,m,25);try{const im=await loadImage(photo.data);const maxW=w-2*m,maxH=238,ratio=Math.min(maxW/im.width,maxH/im.height),iw=im.width*ratio,ih=im.height*ratio,x=(w-iw)/2,y=32+(maxH-ih)/2;pdf.addImage(photo.data,photo.data.startsWith('data:image/png')?'PNG':'JPEG',x,y,iw,ih,undefined,'FAST');}catch{pdf.text('Não foi possível carregar esta fotografia.',m,45);}pdf.setFontSize(9);pdf.setTextColor(80,80,80);pdf.text(`Foto ${i+1} de ${photos.length}`,w/2,280,{align:'center'});}
 const safe=(mapping.street||'mapeamento').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();pdf.save(`mapeamento-${safe||'trecho'}.pdf`);
}
