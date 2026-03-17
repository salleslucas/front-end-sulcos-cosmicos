// Animação de disco de vinil girando
export default function VinylDisc({ size = 120, spinning = false, cover = null }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 ${spinning ? 'animate-spin-slow' : ''}`}
      style={{ width: size, height: size }}
    >
      {/* Disco preto */}
      <div className="absolute inset-0 rounded-full bg-cosmic-black vinyl-grooves" />

      {/* Sulcos concêntricos */}
      {[0.85, 0.72, 0.60, 0.48].map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-white/5"
          style={{
            width: `${r * 100}%`,
            height: `${r * 100}%`,
            top: `${(1 - r) * 50}%`,
            left: `${(1 - r) * 50}%`,
          }}
        />
      ))}

      {/* Capa no centro */}
      {cover && (
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            width: '40%', height: '40%',
            top: '30%', left: '30%',
          }}
        >
          <img src={cover} alt="capa" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Furo central */}
      <div
        className="absolute rounded-full bg-cosmic-black border-2 border-cosmic-purple/60"
        style={{
          width: '8%', height: '8%',
          top: '46%', left: '46%',
        }}
      />

      {/* Brilho */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
