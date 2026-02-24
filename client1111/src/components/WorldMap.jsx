import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const numericToAlpha2 = {
  4:'AF',8:'AL',12:'DZ',24:'AO',32:'AR',36:'AU',40:'AT',50:'BD',56:'BE',
  64:'BT',68:'BO',76:'BR',100:'BG',104:'MM',116:'KH',120:'CM',124:'CA',
  144:'LK',152:'CL',156:'CN',170:'CO',180:'CD',188:'CR',191:'HR',192:'CU',
  203:'CZ',208:'DK',218:'EC',818:'EG',222:'SV',231:'ET',246:'FI',250:'FR',
  266:'GA',276:'DE',288:'GH',300:'GR',320:'GT',332:'HT',340:'HN',356:'IN',
  360:'ID',364:'IR',368:'IQ',372:'IE',376:'IL',380:'IT',388:'JM',392:'JP',
  400:'JO',404:'KE',408:'KP',410:'KR',414:'KW',418:'LA',422:'LB',430:'LR',
  434:'LY',484:'MX',496:'MN',504:'MA',508:'MZ',516:'NA',524:'NP',528:'NL',
  554:'NZ',558:'NI',562:'NE',566:'NG',578:'NO',586:'PK',591:'PA',598:'PG',
  600:'PY',604:'PE',608:'PH',616:'PL',620:'PT',642:'RO',643:'RU',646:'RW',
  682:'SA',686:'SN',694:'SL',706:'SO',710:'ZA',724:'ES',729:'SD',752:'SE',
  756:'CH',760:'SY',834:'TZ',764:'TH',792:'TR',800:'UG',804:'UA',784:'AE',
  826:'GB',840:'US',858:'UY',862:'VE',704:'VN',887:'YE',894:'ZM',716:'ZW',
};

function getAlpha2(geo) {
  return numericToAlpha2[parseInt(geo.id)] || null;
}

export default function WorldMap({ onCountryClick }) {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState(null);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  const handleClick = useCallback((geo) => {
    const code = getAlpha2(geo);
    const name = geo.properties.name;
    if (code) {
      navigate(`/country/${code}`);
      if (onCountryClick) onCountryClick(code, name);
    }
  }, [navigate, onCountryClick]);

  const handleMouseMove = useCallback((geo, evt) => {
    const rect = evt.currentTarget.closest('svg').getBoundingClientRect();
    setTooltip({ visible: true, name: geo.properties.name, x: evt.clientX - rect.left + 12, y: evt.clientY - rect.top - 44 });
    setHoveredId(geo.id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, name: '', x: 0, y: 0 });
    setHoveredId(null);
  }, []);

  return (
    <div className="map-container" style={{ height: '500px', position: 'relative' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={setPosition} minZoom={0.8} maxZoom={8}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const isHovered = hoveredId === geo.id;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(geo)}
                    onMouseMove={(evt) => handleMouseMove(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: isHovered ? '#b45c4a' : '#ddd9d3',
                        stroke: '#f9f7f4',
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'fill 0.15s'
                      },
                      hover: {
                        fill: '#b45c4a',
                        stroke: '#f9f7f4',
                        strokeWidth: 0.6,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: { fill: '#9e4a39', outline: 'none' }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip.visible && (
        <div className="map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.name}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.4rem' }}>
        {[
          { label: '+', action: () => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) })) },
          { label: '−', action: () => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 0.8) })) },
          { label: 'Reset', action: () => setPosition({ coordinates: [0, 20], zoom: 1 }) },
        ].map(b => (
          <button key={b.label} onClick={b.action} style={{
            background: 'rgba(250,246,240,0.9)', border: '1px solid var(--border)',
            color: 'var(--ink-muted)', borderRadius: '20px', padding: '0.3rem 0.75rem',
            cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-body)'
          }}>{b.label}</button>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', fontSize: '0.7rem', color: 'var(--text-faint)' }}>
        Click any country to explore
      </div>
    </div>
  );
}
