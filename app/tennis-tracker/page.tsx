import { TennisTracker } from '@/components/tennis-tracker'

export const metadata = {
  title: 'Tennis Lesson Tracker',
  description: 'Track your kids\' tennis lessons, missed classes, and makeup sessions',
}

export default function TennisTrackerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tennis Lesson Tracker</h1>
          <p className="text-lg text-gray-600">Track Kush and Tina's lessons, missed classes, and makeup sessions</p>
        </div>
        <TennisTracker />
      </main>
    </div>
  )
}
