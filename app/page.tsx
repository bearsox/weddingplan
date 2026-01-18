import Countdown from '@/components/Countdown'
import QuickStats from '@/components/QuickStats'
import RecentEmails from '@/components/RecentEmails'
import UpcomingTasks from '@/components/UpcomingTasks'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-serif text-wedding-charcoal mb-2">
          Jared & Charlee
        </h1>
        <p className="text-wedding-dustyrose text-lg">Summer 2027</p>
      </div>

      {/* Countdown */}
      <Countdown />

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Email Summaries */}
        <RecentEmails />

        {/* Upcoming Tasks */}
        <UpcomingTasks />
      </div>
    </div>
  )
}
