import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Plus, Download, Trash2 } from "lucide-react";

interface Product {
  name: string;
  price: string;
  quantity: string;
}

interface CountryBlock {
  country: string;
  products: Product[];
}

const PRIMARY = "#0B3B8C";
const GREEN = "#76BC21";

// Poster matches the letterhead's real shape (3375 x 4219 -> ratio 0.8)
// 1080 wide  ->  1080 / 0.8 = 1350 tall. This stops the letterhead squishing.
const POSTER_W = 1080;
const POSTER_H = 1350;

export default function PriceListPage() {
  const posterRef = useRef<HTMLDivElement>(null);
  const [date] = useState(new Date().toLocaleDateString());

  const [data, setData] = useState<CountryBlock[]>([
    { country: "", products: [{ name: "", price: "", quantity: "" }] },
  ]);

  const addCountry = () =>
    setData((prev) => [...prev, { country: "", products: [{ name: "", price: "", quantity: "" }] }]);

  const removeCountry = (index: number) =>
    setData((prev) => prev.filter((_, i) => i !== index));

  const updateCountry = (index: number, value: string) => {
    const copy = [...data];
    copy[index].country = value;
    setData(copy);
  };

  const addProduct = (cIndex: number) => {
    const copy = [...data];
    copy[cIndex].products.push({ name: "", price: "", quantity: "" });
    setData(copy);
  };

  const removeProduct = (cIndex: number, pIndex: number) => {
    const copy = [...data];
    copy[cIndex].products.splice(pIndex, 1);
    setData(copy);
  };

  const updateProduct = (cIndex: number, pIndex: number, field: keyof Product, value: string) => {
    const copy = [...data];
    copy[cIndex].products[pIndex][field] = value;
    setData(copy);
  };

  const downloadImage = async () => {
    if (!posterRef.current) return;
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `price-list-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    }
  };

  const tableHeader = {
    border: "2px solid #d1d5db",
    padding: "16px",
    background: "#f3f4f6",
    fontWeight: 700,
    textAlign: "center" as const,
  };

  const tableCell = {
    border: "2px solid #d1d5db",
    padding: "14px",
    textAlign: "center" as const,
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg,#eef3fb 0%,#f4f7fc 30%,#f8fafc 100%)' }}>
      {/* TOP HEADER */}
      <div className="relative overflow-hidden px-5 pt-7 pb-7 text-white"
        style={{ background: 'linear-gradient(135deg, #0B3B8C 0%, #07266090 100%), #0B3B8C',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <div className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#9ec5ff,transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-8 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#bfff58,transparent 70%)' }} />

        <div className="relative">
          <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab</p>
          <h1 className="text-2xl font-bold leading-tight mt-0.5">Price List Generator</h1>
          <p className="text-white/80 text-sm mt-1">Create daily market price lists instantly</p>
          <button
            onClick={addCountry}
            className="mt-5 bg-white px-5 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg active:scale-95 transition"
            style={{ color: PRIMARY }}
          >
            <Plus size={18} /> Add Country
          </button>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="p-4 space-y-5">
        {data.map((country, cIndex) => (
          <div key={cIndex} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-14px_rgba(11,59,140,0.22)]">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Country Name"
                value={country.country}
                onChange={(e) => updateCountry(cIndex, e.target.value)}
                className="w-full border rounded-2xl p-3 text-sm"
              />
              <button onClick={() => removeCountry(cIndex)} className="ml-3 text-red-500">
                <Trash2 size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {country.products.map((product, pIndex) => (
                <div key={pIndex} className="grid grid-cols-3 gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Product"
                    value={product.name}
                    onChange={(e) => updateProduct(cIndex, pIndex, "name", e.target.value)}
                    className="border rounded-xl p-3 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Price"
                    value={product.price}
                    onChange={(e) => updateProduct(cIndex, pIndex, "price", e.target.value)}
                    className="border rounded-xl p-3 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Quantity"
                      value={product.quantity}
                      onChange={(e) => updateProduct(cIndex, pIndex, "quantity", e.target.value)}
                      className="border rounded-xl p-3 text-sm w-full"
                    />
                    <button onClick={() => removeProduct(cIndex, pIndex)} className="text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => addProduct(cIndex)} className="text-green-600 font-semibold text-sm">
                + Add Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DOWNLOAD BUTTON */}
      <div className="px-4">
        <button
          onClick={downloadImage}
          className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#76BC21,#5a9e16)' }}
        >
          <Download size={20} /> Generate & Download Image
        </button>
      </div>

      {/* POSTER SECTION */}
      <div className="overflow-auto mt-10">
        <div
          ref={posterRef}
          className="relative mx-auto overflow-hidden bg-white"
          style={{
            width: `${POSTER_W}px`,
            minHeight: `${POSTER_H}px`,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* LETTERHEAD BACKGROUND — fills the matched-ratio box exactly,
              so it is never squished. Its own leaf watermark shows through. */}
          <img
            src="/letterheadexponab.jpg"
            alt="letterhead"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* CONTENT — padded to sit inside the safe zone of the new letterhead
              (below the logo/phones header, above the footer bar) */}
          <div
            className="relative z-10"
            style={{
              paddingTop: "240px",
              paddingLeft: "80px",
              paddingRight: "80px",
              paddingBottom: "180px",
            }}
          >
            {/* TITLE */}
            <div className="text-center mb-12">
              <h1 style={{ fontSize: "42px", fontWeight: 700, color: "#111827" }}>DAILY PRICE LIST</h1>
              <p style={{ fontSize: "24px", marginTop: "10px", color: "#4b5563" }}>{date}</p>
            </div>

            {/* COUNTRY BLOCKS */}
            {data.map((country, i) => (
              <div key={i} style={{ marginBottom: "50px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: GREEN,
                      marginRight: "12px",
                    }}
                  />
                  <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
                    {country.country} Products
                  </h2>
                </div>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#ffffff",
                    fontSize: "22px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHeader}>Product</th>
                      <th style={tableHeader}>Price</th>
                      <th style={tableHeader}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {country.products.map((product, j) => (
                      <tr key={j}>
                        <td style={tableCell}>{product.name}</td>
                        <td style={tableCell}>{product.price}</td>
                        <td style={tableCell}>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
