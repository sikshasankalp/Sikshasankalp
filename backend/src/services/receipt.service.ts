import PDFDocument from 'pdfkit';
import path from 'path';
import { Donation } from '@prisma/client';

export const receiptService = {
  async generateReceiptPDF(donation: Donation): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Create a document
        const doc = new PDFDocument({
          size: 'A4',
          margin: 40,
          info: {
            Title: `Donation Receipt - ${donation.receiptNumber}`,
            Author: 'Siksha Sankalp Foundation',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        doc.on('error', reject);

        const width = doc.page.width;
        const height = doc.page.height;

        // Outer Blue Border
        doc.lineWidth(8);
        doc.rect(20, 20, width - 40, height - 40).stroke('#1a5f7a'); // A nice brand blue

        // Inner Orange Border
        doc.lineWidth(4);
        doc.rect(32, 32, width - 64, height - 64).stroke('#f97316'); // Brand orange

        // Foundation Name
        doc.font('Helvetica-Bold');
        doc.fontSize(22);
        doc.fillColor('#1a5f7a');
        doc.text('SIKSHA SANKALP FOUNDATION', 0, 130, { align: 'center' });

        // Title
        doc.fontSize(28);
        doc.fillColor('#1a5f7a');
        doc.text('DONATION RECEIPT', { align: 'center' });

        // Subtitle
        doc.fontSize(14);
        doc.fillColor('#333333');
        doc.text('Official Receipt for Donation u/s 80G', { align: 'center' });
        doc.moveDown(1.5);

        // Top line
        doc.lineWidth(1);
        doc.moveTo(50, doc.y).lineTo(width - 50, doc.y).stroke('#a0a0a0');
        doc.moveDown(1);

        const refY = doc.y;
        doc.fontSize(12);
        doc.font('Helvetica-Bold');
        doc.text(`Ref. No.: `, 50, refY, { continued: true });
        doc.font('Helvetica');
        doc.text(donation.receiptNumber || 'N/A');

        doc.font('Helvetica-Bold');
        const formattedDate = donation.createdAt.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        doc.text(`Date: ${formattedDate}`, 0, refY, { align: 'right' });

        doc.moveDown(0.5);
        doc.lineWidth(1);
        doc.moveTo(50, doc.y).lineTo(width - 50, doc.y).stroke('#a0a0a0');
        doc.moveDown(1.5);

        // Convert Amount to Words (basic)
        const amountInWords = numberToWords(donation.amount) + ' Rupees Only';

        const details = [
          { label: 'Received with thanks from Mr./Ms.:', value: donation.donorName },
          { label: 'Amount Rs.:', value: donation.amount.toLocaleString('en-IN') },
          { label: 'Amount in Words:', value: amountInWords },
          { label: 'Purpose:', value: 'Education • Food • Welfare & General' },
          { label: 'Payment Mode:', value: 'Online Payment' },
          { label: 'Transaction ID:', value: donation.razorpayPaymentId || 'N/A' },
        ];

        let startY = doc.y;
        details.forEach(item => {
          doc.font('Helvetica-Bold').text(item.label, 50, startY, { width: 230 });
          doc.font('Helvetica').text(item.value, 280, startY, { width: width - 330 });
          startY += 25;
        });

        // Split Donor Mobile and PAN on the same line
        doc.font('Helvetica-Bold').text('Donor Mobile:', 50, startY, { width: 100 });
        doc.font('Helvetica').text(donation.mobile || 'N/A', 150, startY, { width: 140 });
        
        doc.font('Helvetica-Bold').text('Donor PAN:', 300, startY, { width: 80 });
        doc.font('Helvetica').text(donation.pan || 'N/A (No 80G Claim)', 385, startY, { width: 170 });

        startY += 22;
        doc.font('Helvetica-Bold').text('80G Reg. Number:', 50, startY, { width: 120 });
        doc.font('Helvetica').text('ABOTS8425NE20261', 170, startY, { width: 120 });

        doc.font('Helvetica-Bold').text('12A Reg. Number:', 300, startY, { width: 120 });
        doc.font('Helvetica').text('AAACT1234F', 420, startY, { width: 120 });
        
        doc.moveDown(2.5);

        // Declaration Box
        const declarationY = doc.y;
        doc.rect(50, declarationY, width - 100, 65).fillAndStroke('#f0f4f8', '#d0d0d0');
        doc.fillColor('#333333');
        doc.font('Helvetica');
        doc.fontSize(9.5);
        const declarationText = 'Tax Exemption Declaration: The above donation is towards charitable and educational activities and is eligible for 50% tax deduction under Section 80G of the Income Tax Act, 1961 (Provisional Reg. No. ABOTS8425NE20261). Siksha Sankalp Foundation is also registered under Section 12A.';
        doc.text(declarationText, 60, declarationY + 12, { width: width - 120, align: 'justify' });

        doc.moveDown(4);

        // Authorized Signatory
        const sigY = doc.y;
        doc.font('Helvetica-Bold');
        doc.fontSize(11);
        doc.text('Authorized Signatory for', 0, sigY, { align: 'right', indent: -50 });
        doc.text('SIKSHA SANKALP FOUNDATION', 0, doc.y, { align: 'right', indent: -50 });
        
        const signaturePath = path.join(__dirname, '../assets/signature.png');
        try {
          // Fit the signature smoothly into the empty space above the line
          doc.image(signaturePath, width - 220, sigY + 30, { fit: [140, 45], align: 'center' });
        } catch (e) {
          console.warn('Signature image not found or could not be loaded.');
        }

        doc.moveDown(4);
        doc.font('Helvetica');
        doc.text('(Authorised Signatory)', 0, doc.y, { align: 'right', indent: -50 });
        doc.lineWidth(1);
        doc.moveTo(width - 250, doc.y - 20).lineTo(width - 50, doc.y - 20).stroke('#000000');

        // Footer
        doc.fontSize(8);
        doc.fillColor('#ffffff');
        doc.rect(32, height - 80, width - 64, 48).fill('#1a5f7a');
        const footerText = 'SIKSHA SANKALP FOUNDATION | KH-103, Alawardi Pur, Near Durga Mandir, Gautam Buddha Nagar, Uttar Pradesh – 201308\nPAN: ABOTS8425N | 12A: ABOTS8425NE20261 | 80G: ABOTS8425NE20261 | CSR: CSR00115589';
        doc.text(footerText, 32, height - 70, { align: 'center', width: width - 64 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
};

function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n: number): string => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n];
    }
    return str;
  };

  let res = '';
  if (num >= 10000000) {
    res += inWords(Math.floor(num / 10000000)) + 'Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    res += inWords(Math.floor(num / 100000)) + 'Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    res += inWords(Math.floor(num / 1000)) + 'Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    res += inWords(num);
  }
  
  return res.trim();
}
