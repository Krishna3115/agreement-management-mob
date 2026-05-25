import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Plus,
  Download,
  Trash2,
} from "lucide-react";

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

export default function PriceListPage() {

  const posterRef =
    useRef<HTMLDivElement>(null);

  const [date] = useState(
    new Date().toLocaleDateString()
  );

  const [data, setData] = useState<CountryBlock[]>([
    {
      country: "",
      products: [
        {
          name: "",
          price: "",
          quantity: "",
        },
      ],
    },
  ]);

  // =========================================
  // ADD COUNTRY
  // =========================================

  const addCountry = () => {

    setData((prev) => [
      ...prev,
      {
        country: "",
        products: [
          {
            name: "",
            price: "",
            quantity: "",
          },
        ],
      },
    ]);
  };

  // =========================================
  // REMOVE COUNTRY
  // =========================================

  const removeCountry = (index: number) => {

    setData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // UPDATE COUNTRY
  // =========================================

  const updateCountry = (
    index: number,
    value: string
  ) => {

    const copy = [...data];

    copy[index].country = value;

    setData(copy);
  };

  // =========================================
  // ADD PRODUCT
  // =========================================

  const addProduct = (cIndex: number) => {

    const copy = [...data];

    copy[cIndex].products.push({
      name: "",
      price: "",
      quantity: "",
    });

    setData(copy);
  };

  // =========================================
  // REMOVE PRODUCT
  // =========================================

  const removeProduct = (
    cIndex: number,
    pIndex: number
  ) => {

    const copy = [...data];

    copy[cIndex].products.splice(
      pIndex,
      1
    );

    setData(copy);
  };

  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const updateProduct = (
    cIndex: number,
    pIndex: number,
    field: keyof Product,
    value: string
  ) => {

    const copy = [...data];

    copy[cIndex].products[pIndex][field] =
      value;

    setData(copy);
  };

  // =========================================
  // DOWNLOAD IMAGE
  // =========================================

  const downloadImage = async () => {

    if (!posterRef.current) return;

    try {

      const canvas =
        await html2canvas(
          posterRef.current,
          {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          }
        );

      const image =
        canvas.toDataURL("image/png");

      const link =
        document.createElement("a");

      link.href = image;

      link.download =
        `price-list-${Date.now()}.png`;

      link.click();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to generate image"
      );
    }
  };

  // =========================================
  // TABLE STYLES
  // =========================================

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

    <div className="min-h-screen bg-slate-100 pb-20">

      {/* ========================================= */}
      {/* TOP HEADER */}
      {/* ========================================= */}

      <div
        className="
          px-5
          pt-6
          pb-6
          rounded-b-[30px]
          text-white
        "
        style={{
          background: PRIMARY,
        }}
      >

        <h1 className="text-3xl font-bold">

          Exponab Price List Generator

        </h1>

        <p className="text-white/80 mt-2">

          Create daily market price lists instantly

        </p>

        <button
          onClick={addCountry}
          className="
            mt-5
            bg-white
            text-blue-900
            px-5
            py-3
            rounded-2xl
            flex
            items-center
            gap-2
            font-semibold
          "
        >

          <Plus size={18} />

          Add Country

        </button>

      </div>

      {/* ========================================= */}
      {/* FORM SECTION */}
      {/* ========================================= */}

      <div className="p-4 space-y-5">

        {data.map((country, cIndex) => (

          <div
            key={cIndex}
            className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
            "
          >

            {/* COUNTRY HEADER */}

            <div
              className="
                flex
                justify-between
                items-center
                mb-4
              "
            >

              <input
                type="text"
                placeholder="Country Name"
                value={country.country}
                onChange={(e) =>
                  updateCountry(
                    cIndex,
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-2xl
                  p-3
                  text-sm
                "
              />

              <button
                onClick={() =>
                  removeCountry(cIndex)
                }
                className="
                  ml-3
                  text-red-500
                "
              >

                <Trash2 size={20} />

              </button>

            </div>

            {/* PRODUCTS */}

            <div className="space-y-3">

              {country.products.map(
                (product, pIndex) => (

                  <div
                    key={pIndex}
                    className="
                      grid
                      grid-cols-3
                      gap-3
                      items-center
                    "
                  >

                    <input
                      type="text"
                      placeholder="Product"
                      value={product.name}
                      onChange={(e) =>
                        updateProduct(
                          cIndex,
                          pIndex,
                          "name",
                          e.target.value
                        )
                      }
                      className="
                        border
                        rounded-xl
                        p-3
                        text-sm
                      "
                    />

                    <input
                      type="text"
                      placeholder="Price"
                      value={product.price}
                      onChange={(e) =>
                        updateProduct(
                          cIndex,
                          pIndex,
                          "price",
                          e.target.value
                        )
                      }
                      className="
                        border
                        rounded-xl
                        p-3
                        text-sm
                      "
                    />

                    <div className="flex gap-2">

                      <input
                        type="text"
                        placeholder="Quantity"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProduct(
                            cIndex,
                            pIndex,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="
                          border
                          rounded-xl
                          p-3
                          text-sm
                          w-full
                        "
                      />

                      <button
                        onClick={() =>
                          removeProduct(
                            cIndex,
                            pIndex
                          )
                        }
                        className="
                          text-red-500
                        "
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </div>
                )
              )}

              {/* ADD PRODUCT */}

              <button
                onClick={() =>
                  addProduct(cIndex)
                }
                className="
                  text-green-600
                  font-semibold
                  text-sm
                "
              >

                + Add Product

              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ========================================= */}
      {/* DOWNLOAD BUTTON */}
      {/* ========================================= */}

      <div className="px-4">

        <button
          onClick={downloadImage}
          className="
            w-full
            py-4
            rounded-2xl
            text-white
            font-bold
            flex
            items-center
            justify-center
            gap-2
            shadow-lg
          "
          style={{
            background: GREEN,
          }}
        >

          <Download size={20} />

          Generate & Download Image

        </button>

      </div>

      {/* ========================================= */}
      {/* POSTER SECTION */}
      {/* ========================================= */}

      <div className="overflow-auto mt-10">

        <div
          ref={posterRef}
          className="
            relative
            mx-auto
            overflow-hidden
            bg-white
          "
          style={{
            width: "1080px",
            minHeight: "1600px",
            fontFamily:
              "Arial, sans-serif",
          }}
        >

          {/* LETTERHEAD */}

          <img
            src="/letterheadexponab.png"
            alt="letterhead"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              z-0
            "
          />

          {/* WATERMARK */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              opacity-5
              z-0
            "
          >

            <img
              src="/apple-touch-icon.png"
              alt="logo"
              className="w-[450px]"
            />

          </div>

          {/* CONTENT */}

          <div
            className="relative z-10"
            style={{
              paddingTop: "180px",
              paddingLeft: "70px",
              paddingRight: "70px",
              paddingBottom: "200px",
            }}
          >

            {/* TITLE */}

            <div className="text-center mb-12">

              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >

                DAILY PRICE LIST

              </h1>

              <p
                style={{
                  fontSize: "24px",
                  marginTop: "10px",
                  color: "#4b5563",
                }}
              >

                {date}

              </p>

            </div>

            {/* COUNTRY BLOCKS */}

            {data.map((country, i) => (

              <div
                key={i}
                style={{
                  marginBottom: "60px",
                }}
              >

                {/* COUNTRY TITLE */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >

                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      background: GREEN,
                      marginRight: "12px",
                    }}
                  />

                  <h2
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >

                    {country.country} Products

                  </h2>

                </div>

                {/* TABLE */}

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse",
                    background: "#ffffff",
                    fontSize: "22px",
                  }}
                >

                  <thead>

                    <tr>

                      <th
                        style={
                          tableHeader
                        }
                      >
                        Product
                      </th>

                      <th
                        style={
                          tableHeader
                        }
                      >
                        Price
                      </th>

                      <th
                        style={
                          tableHeader
                        }
                      >
                        Quantity
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {country.products.map(
                      (
                        product,
                        j
                      ) => (

                        <tr key={j}>

                          <td
                            style={
                              tableCell
                            }
                          >

                            {
                              product.name
                            }

                          </td>

                          <td
                            style={
                              tableCell
                            }
                          >

                            {
                              product.price
                            }

                          </td>

                          <td
                            style={
                              tableCell
                            }
                          >

                            {
                              product.quantity
                            }

                          </td>

                        </tr>
                      )
                    )}

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