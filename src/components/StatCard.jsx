export default function StatCard({ label, value, accent }) {
  return (
    <div className="bg-graphite border border-steel rounded-md px-5 py-4">
      <div className="text-chalkdim text-sm mb-1">{label}</div>
      <div className={`font-display text-3xl ${accent ? 'text-brasslight' : 'text-chalk'}`}>
        {value}
      </div>
    </div>
  )
}
