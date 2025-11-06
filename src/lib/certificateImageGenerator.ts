import type { Certificate, CertificateTemplate } from '@/types/performance';

/**
 * Generates a social media-friendly image of a certificate
 * Returns a data URL of the generated image
 */
export async function generateCertificateImage(
  certificate: Certificate,
  template: CertificateTemplate
): Promise<string> {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size for social media (1200x630 is optimal for most platforms)
  canvas.width = 1200;
  canvas.height = 630;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, template.colors.primary);
  gradient.addColorStop(1, template.colors.secondary);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add overlay pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 60, j * 60, 30, 30);
      }
    }
  }

  // Border
  ctx.strokeStyle = template.colors.accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Inner border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE', canvas.width / 2, 120);

  // Certificate type
  ctx.font = '24px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('of ' + certificate.description.replace('Certificate of ', ''), canvas.width / 2, 160);

  // Decorative line
  ctx.strokeStyle = template.colors.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 190);
  ctx.lineTo(900, 190);
  ctx.stroke();

  // Employee name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px serif';
  ctx.fillText(certificate.employeeName, canvas.width / 2, 270);

  // Achievement description
  ctx.font = '28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  
  // Wrap text if needed
  const achievementText = certificate.title;
  const maxWidth = 900;
  const words = achievementText.split(' ');
  let line = '';
  let y = 330;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = words[n] + ' ';
      y += 35;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, canvas.width / 2, y);

  // Course details if available
  if (certificate.certificateData.courseName) {
    y += 50;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(certificate.certificateData.courseName, canvas.width / 2, y);
    
    if (certificate.certificateData.score) {
      y += 30;
      ctx.fillText(`Score: ${certificate.certificateData.score}%`, canvas.width / 2, y);
    }
  }

  // Date and verification
  ctx.font = '18px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  const dateStr = new Date(certificate.issueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  ctx.fillText(`Issued: ${dateStr}`, canvas.width / 2, canvas.height - 120);

  // Verification code
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = template.colors.accent;
  ctx.fillText(`Verify: ${certificate.verificationCode}`, canvas.width / 2, canvas.height - 80);

  // Decorative elements (corner ornaments)
  drawCornerOrnament(ctx, 80, 80, 40, template.colors.accent);
  drawCornerOrnament(ctx, canvas.width - 80, 80, 40, template.colors.accent);
  drawCornerOrnament(ctx, 80, canvas.height - 80, 40, template.colors.accent);
  drawCornerOrnament(ctx, canvas.width - 80, canvas.height - 80, 40, template.colors.accent);

  // Convert canvas to data URL
  return canvas.toDataURL('image/png', 1.0);
}

function drawCornerOrnament(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

  // Draw decorative star/flower pattern
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const radius = i % 2 === 0 ? size : size / 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Download certificate image to user's device
 */
export function downloadCertificateImage(imageUrl: string, certificate: Certificate): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `certificate-${certificate.verificationCode}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
