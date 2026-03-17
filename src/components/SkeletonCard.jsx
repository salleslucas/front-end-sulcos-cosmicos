// Skeleton loader para cards de disco
export default function SkeletonCard() {
  return (
    <div className="glass-card p-4 animate-pulse">
      {/* Capa simulada */}
      <div className="w-full aspect-square bg-white/5 rounded-xl mb-4" />

      {/* Textos */}
      <div className="h-3 bg-white/5 rounded-full w-1/3 mb-2" />
      <div className="h-5 bg-white/8 rounded-full w-4/5 mb-1" />
      <div className="h-4 bg-white/5 rounded-full w-2/3 mb-4" />

      {/* Preço + botão */}
      <div className="flex items-center justify-between mt-3">
        <div className="h-6 bg-white/8 rounded-full w-1/4" />
        <div className="h-10 bg-white/5 rounded-xl w-2/5" />
      </div>
    </div>
  );
}
