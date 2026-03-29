import Image from 'next/image';

export default function Footer() {
  return (
    <footer style={{
      background: '#05070D',
      padding: '5rem 0 3rem',
      borderTop: '1px solid var(--glass-border)',
      marginTop: '10rem'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <Image
                src="/logo.png"
                alt="Dynamics Global Logo"
                width={220}
                height={60}
                unoptimized
                style={{ objectFit: 'contain', height: '60px', width: 'auto' }}
              />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Engineering Global Infrastructure across Mining, Construction, and Logistics sectors. Operating internationally since 2021.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>SERVICES</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}>MINING OPERATIONS</li>
              <li style={{ marginBottom: '0.8rem' }}>INFRASTRUCTURE CONSTRUCTION</li>
              <li style={{ marginBottom: '0.8rem' }}>GLOBAL LOGISTICS</li>
              <li style={{ marginBottom: '0.8rem' }}>HEAVY EQUIPMENT RENTAL</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>GLOBAL REACH</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}>INDIA (HQ)</li>
              <li style={{ marginBottom: '0.8rem' }}>UNITED STATES</li>
              <li style={{ marginBottom: '0.8rem' }}>CHINA</li>
              <li style={{ marginBottom: '0.8rem' }}>UAE (DUBAI)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>CONTACT</h4>
            <ul style={{ listStyle: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}>info@dynamicsglobal.cc</li>
              <li style={{ marginBottom: '0.8rem' }}>+91 99500 94707</li>
              <li style={{ marginBottom: '0.8rem' }}>+91 90240 55707</li>
              <li style={{ marginBottom: '0.8rem' }}>Sector 26, Gandhinagar, Gujarat 382028 </li>
              <li style={{ marginBottom: '0.8rem' }}>Janta Bazar Chowk, Poorvarang, Mahalaxminagar, Rajarampuri, Kolhapur, Maharashtra 416008</li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '5rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          letterSpacing: '1px'
        }}>
          © 2021 - 2026 DYNAMICS GLOBAL INDUSTRIAL SOLUTIONS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
