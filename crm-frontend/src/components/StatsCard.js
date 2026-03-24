'use client';

export default function StatsCard({ title, value, icon: Icon, color = 'primary', trend }) {
  const iconBgMap = {
    primary: 'rgba(168, 85, 247, 0.12)',
    emerald: 'rgba(16, 185, 129, 0.12)',
    amber: 'rgba(245, 158, 11, 0.12)',
    rose: 'rgba(244, 63, 94, 0.12)',
    cyan: 'rgba(6, 182, 212, 0.12)',
  };

  const iconColorMap = {
    primary: '#a855f7',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#06b6d4',
  };

  const glowBorderMap = {
    primary: '0 0 20px rgba(168, 85, 247, 0.12), inset 0 1px 0 rgba(168, 85, 247, 0.08)',
    emerald: '0 0 20px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(16, 185, 129, 0.08)',
    amber: '0 0 20px rgba(245, 158, 11, 0.12), inset 0 1px 0 rgba(245, 158, 11, 0.08)',
    rose: '0 0 20px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(244, 63, 94, 0.08)',
    cyan: '0 0 20px rgba(6, 182, 212, 0.12), inset 0 1px 0 rgba(6, 182, 212, 0.08)',
  };

  const topBorderMap = {
    primary: '#a855f7',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#f43f5e',
    cyan: '#06b6d4',
  };

  return (
    <div
      style={{
        background: '#1a2035',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: `2px solid ${topBorderMap[color]}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), ${glowBorderMap[color]}`,
        padding: '24px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), ${glowBorderMap[color]}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 24px rgba(0,0,0,0.4), ${glowBorderMap[color]}`;
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#6b7280', marginBottom: '6px' }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{value}</p>
          {trend && (
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>{trend}</p>
          )}
        </div>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: iconBgMap[color],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Icon && <Icon style={{ width: '22px', height: '22px', color: iconColorMap[color] }} />}
        </div>
      </div>
    </div>
  );
}
