import { Card } from "@/components/ui/card";

export function TypographyReference() {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Typography Quick Reference</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">Class</th>
              <th className="text-left py-2 font-semibold">Size (mobile → desktop)</th>
              <th className="text-left py-2 font-semibold">Weight</th>
              <th className="text-left py-2 font-semibold">Use Case</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2"><code>.text-display</code></td>
              <td>6xl → 7xl → 8xl</td>
              <td>Bold (700)</td>
              <td>Massive headlines, brand statements</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-hero</code></td>
              <td>4xl → 5xl → 6xl</td>
              <td>Bold (700)</td>
              <td>Landing page heroes, main headings</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-section-title</code></td>
              <td>3xl → 4xl</td>
              <td>Bold (700)</td>
              <td>Major section headings</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-subsection</code></td>
              <td>2xl → 3xl</td>
              <td>Semi-bold (600)</td>
              <td>Sub-sections, feature headings</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-card-title</code></td>
              <td>xl → 2xl</td>
              <td>Semi-bold (600)</td>
              <td>Card headers, component titles</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-body-large</code></td>
              <td>lg → xl</td>
              <td>Regular (400)</td>
              <td>Intro paragraphs, emphasis</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-body</code></td>
              <td>base</td>
              <td>Regular (400)</td>
              <td>Default paragraph text</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-body-small</code></td>
              <td>sm</td>
              <td>Regular (400)</td>
              <td>Compact content, list items</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-caption</code></td>
              <td>sm</td>
              <td>Regular (400)</td>
              <td>Metadata, timestamps, labels</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-helper</code></td>
              <td>xs</td>
              <td>Regular (400)</td>
              <td>Form hints, descriptions</td>
            </tr>
            <tr className="border-b">
              <td className="py-2"><code>.text-fine</code></td>
              <td>xs</td>
              <td>Regular (400)</td>
              <td>Legal text, fine print</td>
            </tr>
            <tr>
              <td className="py-2"><code>.text-overline</code></td>
              <td>xs</td>
              <td>Semi-bold (600)</td>
              <td>Uppercase labels, badges</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
