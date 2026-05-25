'use client';

import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

interface FileItem {
  id: number;
  display_name: string;
  file_url: string;
  file_type: string;
  level: string;
}

interface County {
  id: number;
  name: string;
  slug: string;
}

interface StateData {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
  summary: string;
  counties: County[];
  files: FileItem[];
}

interface Props {
  state: StateData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function FileBadge({ type }: { type: string }) {
  const upper = (type ?? '').toUpperCase();
  const isDoc = upper === 'DOC' || upper === 'DOCX';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: '0.7rem',
        fontWeight: 700,
        fontFamily: "'Roboto', Arial, sans-serif",
        background: isDoc ? 'rgba(107,158,209,0.2)' : 'rgba(220,60,60,0.2)',
        color: isDoc ? '#4361AF' : '#e05555',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {upper || 'FILE'}
    </span>
  );
}

export default function StatePageClient({ state }: Props) {
  return (
    <>
      {/* Breadcrumb */}
      <nav
        className="container"
        style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: '0.8rem' }}>
          <li><a href="/locations" style={{ color: 'rgba(255,255,255,0.5)' }} className="hover:text-white transition-colors">Locations</a></li>
          <li style={{ color: 'rgba(255,255,255,0.3)' }}>/</li>
          <li style={{ color: '#DE863F' }}>{state.name}</li>
        </ol>
      </nav>

      {/* Hero + Counties */}
      <section className="py-20" style={{ background: '#000000' }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h2
                className="section-label mb-4"
                style={{
                  fontFamily: "'Roboto', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#DE863F',
                }}
              >
                Stormwater Pollution Prevention Plan Service
              </h2>
              <h1
                className="text-white uppercase leading-none mb-6"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                }}
              >
                {state.name}{' '}
                <span style={{ color: '#DE863F' }}>SWPPP Services</span>
              </h1>
              <p
                style={{
                  fontFamily: "'Roboto', Arial, sans-serif",
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  marginBottom: '2rem',
                }}
              >
                Fully compliant stormwater plans delivered in 72 hours for{' '}
                {state.name} construction projects.
              </p>
              {state.summary && (
                <div
                  className="wp-content"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                  dangerouslySetInnerHTML={{ __html: state.summary }}
                />
              )}
            </motion.div>

            {/* Right: Counties */}
            {state.counties.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                style={{
                  marginLeft: '50px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '24px',
                }}
              >
                <h2
                  className="text-white uppercase mb-6"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Counties We Serve
                </h2>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  style={{ maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}
                >
                  {state.counties.map((county) => (
                    <a
                      key={county.id}
                      href={`/locations/${state.slug}/${county.slug}`}
                      className="group block rounded-xl p-4 transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(222,134,63,0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          color: '#ffffff',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {county.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: '0.7rem',
                          color: '#DE863F',
                        }}
                      >
                        View Details →
                      </p>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Documents */}
      {state.files.length > 0 && (
        <section className="py-16" style={{ background: '#000000' }}>
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              <h2
                className="text-white uppercase mb-8"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                }}
              >
                State Resources &amp; Documents
              </h2>
              <div className="flex flex-col gap-3">
                {state.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(222,134,63,0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                    }}
                  >
                    <FileText size={20} style={{ color: '#DE863F', flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        color: 'rgba(255,255,255,0.9)',
                        flex: 1,
                        fontSize: '0.9rem',
                      }}
                    >
                      {file.display_name}
                    </span>
                    <FileBadge type={file.file_type} />
                    <Download size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

    </>
  );
}
