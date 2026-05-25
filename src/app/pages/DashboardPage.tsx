import React, { useEffect, useState } from 'react';
import {
  Leaf,
  Globe2,
  Truck,
  FileText,
  Building2,
  Ship,
  PackageCheck,
  FileSpreadsheet,
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return { text: 'Good Morning', emoji: '🌤️' };
  }

  if (hour < 17) {
    return { text: 'Good Afternoon', emoji: '☀️' };
  }

  return { text: 'Good Evening', emoji: '🌙' };
}

function getDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const greeting = getGreeting();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: '100%',
        background:
          'linear-gradient(160deg, #f4fff7 0%, #eef7ef 40%, #f7f3e8 100%)',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,128,72,0.12) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(180,145,60,0.14) 0%, transparent 70%)',
          animation: 'pulse 10s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes pulse {
          0%,100% {
            transform: scale(1);
            opacity: 1;
          }

          50% {
            transform: scale(1.15);
            opacity: 0.7;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }

          100% {
            background-position: 200% center;
          }
        }

        .fade-up-1 {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
          animation-delay: 0.1s;
        }

        .fade-up-2 {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
          animation-delay: 0.25s;
        }

        .fade-up-3 {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
          animation-delay: 0.4s;
        }

        .fade-up-4 {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
          animation-delay: 0.55s;
        }

        .fade-up-5 {
          animation: fadeUp 0.6s ease forwards;
          opacity: 0;
          animation-delay: 0.7s;
        }

        .gold-shimmer {
          background: linear-gradient(
            90deg,
            #c89b3c,
            #f0d47a,
            #c89b3c,
            #f7df97
          );

          background-size: 200% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;

          animation: shimmer 5s linear infinite;
        }

        .dashboard-card {
          transition: all 0.25s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Main Content */}
      <div
        style={{
          padding: '2rem 1.5rem',
          position: 'relative',
          zIndex: 1,
          maxWidth: '1300px',
          margin: '0 auto',
        }}
      >
        {/* Greeting */}
        <div className="fade-up-1">
          <p
            style={{
              color: '#6c8c71',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.25rem',
              fontWeight: 600,
            }}
          >
            {greeting.emoji} {greeting.text}
          </p>

          <p
            style={{
              color: '#93a08f',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
            }}
          >
            {getDate()}
          </p>
        </div>

        {/* Header */}
        <div
          className="fade-up-2"
          style={{
            marginTop: '1.7rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.7rem',
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 52,
                  borderRadius: 20,
                  background:
                    'linear-gradient(180deg, #008d5b, #e2be61)',
                }}
              />

              <div>
                <h1
                  style={{
                    color: '#0a5a3d',
                    fontSize: '2rem',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1.1,
                  }}
                >
                  Exponab
                </h1>

                <h2
                  className="gold-shimmer"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  General Trading LLC
                </h2>
              </div>
            </div>

            <p
              style={{
                marginTop: '0.8rem',
                color: '#7f7f65',
                letterSpacing: '0.18em',
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                paddingLeft: '0.8rem',
                fontWeight: 600,
              }}
            >
              Agriculture • Import • Export • Global Trading
            </p>
          </div>

          {/* Status Badge */}
          <div
            style={{
              background: 'rgba(0,141,91,0.1)',
              border: '1px solid rgba(0,141,91,0.15)',
              color: '#0a7a4e',
              padding: '0.8rem 1rem',
              borderRadius: '1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Dubai Operations Active 🌍
          </div>
        </div>

        {/* Divider */}
        <div
          className="fade-up-3"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            margin: '2rem 0',
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, #d8b763)',
            }}
          />

          <Leaf size={18} color="#0c8a58" />

          <div
            style={{
              flex: 1,
              height: 1,
              background:
                'linear-gradient(90deg, #d8b763, transparent)',
            }}
          />
        </div>

        {/* Statistics */}
        <div className="fade-up-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

          {/* Card 1 */}
          <div
            className="dashboard-card"
            style={{
              background: '#ffffff',
              borderRadius: '1.3rem',
              padding: '1.5rem',
              border: '1px solid #e8eee9',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '1rem',
                background: 'rgba(0,141,91,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Building2 color="#008d5b" size={24} />
            </div>

            <p
              style={{
                color: '#8d8d75',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.45rem',
              }}
            >
              Client Companies
            </p>

            <h2
              style={{
                fontSize: '2rem',
                color: '#123524',
                margin: 0,
                fontWeight: 800,
              }}
            >
              28
            </h2>

            <p
              style={{
                color: '#7f8a7d',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
              }}
            >
              Registered import/export partners
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="dashboard-card"
            style={{
              background: '#ffffff',
              borderRadius: '1.3rem',
              padding: '1.5rem',
              border: '1px solid #e8eee9',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '1rem',
                background: 'rgba(224,176,48,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <FileText color="#c89b3c" size={24} />
            </div>

            <p
              style={{
                color: '#8d8d75',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.45rem',
              }}
            >
              Sales Reports
            </p>

            <h2
              style={{
                fontSize: '2rem',
                color: '#123524',
                margin: 0,
                fontWeight: 800,
              }}
            >
              145
            </h2>

            <p
              style={{
                color: '#7f8a7d',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
              }}
            >
              Generated with VAT & pricing
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="dashboard-card"
            style={{
              background: '#ffffff',
              borderRadius: '1.3rem',
              padding: '1.5rem',
              border: '1px solid #e8eee9',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '1rem',
                background: 'rgba(25,123,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Ship color="#197bff" size={24} />
            </div>

            <p
              style={{
                color: '#8d8d75',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.45rem',
              }}
            >
              Active Shipments
            </p>

            <h2
              style={{
                fontSize: '2rem',
                color: '#123524',
                margin: 0,
                fontWeight: 800,
              }}
            >
              12
            </h2>

            <p
              style={{
                color: '#7f8a7d',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
              }}
            >
              Export containers in transit
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="dashboard-card"
            style={{
              background: '#ffffff',
              borderRadius: '1.3rem',
              padding: '1.5rem',
              border: '1px solid #e8eee9',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '1rem',
                background: 'rgba(0,141,91,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <PackageCheck color="#008d5b" size={24} />
            </div>

            <p
              style={{
                color: '#8d8d75',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '0.45rem',
              }}
            >
              Completed Orders
            </p>

            <h2
              style={{
                fontSize: '2rem',
                color: '#123524',
                margin: 0,
                fontWeight: 800,
              }}
            >
              320
            </h2>

            <p
              style={{
                color: '#7f8a7d',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
              }}
            >
              Successfully delivered globally
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Left Card */}
          <div
            className="fade-up-4"
            style={{
              background:
                'linear-gradient(135deg, #006b44 0%, #059669 100%)',
              borderRadius: '1.5rem',
              padding: '1.8rem',
              position: 'relative',
              overflow: 'hidden',
              color: '#ffffff',
              boxShadow: '0 14px 40px rgba(0,107,68,0.18)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 180,
                height: 180,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.12), transparent)',
              }}
            />

            <p
              style={{
                color: '#f0d47a',
                fontSize: '0.72rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginBottom: '1.2rem',
                fontWeight: 700,
              }}
            >
              Business Operations
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {[
                {
                  icon: <Building2 size={18} />,
                  title: 'Client Company Management',
                  desc: 'Register and manage international agro companies',
                },
                {
                  icon: <Truck size={18} />,
                  title: 'Purchase & Sales Orders',
                  desc: 'Generate and share trade documents instantly',
                },
                {
                  icon: <FileSpreadsheet size={18} />,
                  title: 'Sales Report Generation',
                  desc: 'VAT calculations, pricing & quantity management',
                },
                {
                  icon: <Globe2 size={18} />,
                  title: 'Global Trade Workflow',
                  desc: 'Manage export/import operations worldwide',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '0.9rem',
                      background: 'rgba(255,255,255,0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: '0.92rem',
                      }}
                    >
                      {item.title}
                    </p>

                    <p
                      style={{
                        marginTop: '0.3rem',
                        color: '#d5f0e2',
                        fontSize: '0.78rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div
            className="fade-up-5"
            style={{
              background: 'rgba(255,255,255,0.78)',
              borderRadius: '1.5rem',
              padding: '1.8rem',
              border: '1px solid rgba(0,0,0,0.05)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <p
              style={{
                color: '#8f8a6f',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                marginBottom: '1rem',
                fontWeight: 700,
              }}
            >
              Platform Workflow
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {[
                'Add Client Company Details',
                'Create Purchase Order (Optional)',
                'Generate Sales Order',
                'Create VAT / Non-VAT Sales Reports',
                'Upload & Merge PDF Attachments',
                'Generate Final Export Documents',
              ].map((step, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    padding: '0.9rem 1rem',
                    borderRadius: '1rem',
                    background: '#f7faf7',
                    border: '1px solid #edf1ed',
                  }}
                >
                  <div
                    style={{
                      minWidth: 34,
                      height: 34,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #008d5b, #0dcf84)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                    }}
                  >
                    {index + 1}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: '#234130',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Note */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '1rem',
                background:
                  'linear-gradient(135deg, rgba(200,155,60,0.1), rgba(0,141,91,0.08))',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#5f614f',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                }}
              >
                Exponab General Trading LLC manages agricultural import and export
                operations from Dubai with smart sales reports, document generation,
                invoice management, quotation workflows, and international trade
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}