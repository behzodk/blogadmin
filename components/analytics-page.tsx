"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Eye, Users, FileText, TrendingUp, Clock } from 'lucide-react'

export function AnalyticsPage() {
  const stats = [
    {
      title: "Total Views",
      value: "24,582",
      change: "+12.5%",
      icon: Eye,
      trend: "up"
    },
    {
      title: "Total Posts",
      value: "156",
      change: "+8",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Active Users",
      value: "8,234",
      change: "+23.1%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Avg. Read Time",
      value: "4.2 min",
      change: "-0.5 min",
      icon: Clock,
      trend: "down"
    }
  ]

  const topPosts = [
    { title: "Getting Started with Next.js 15", views: 4521, engagement: "92%" },
    { title: "The Future of Web Development", views: 3840, engagement: "88%" },
    { title: "Mastering TypeScript in 2025", views: 3201, engagement: "85%" },
    { title: "Advanced React Patterns", views: 2940, engagement: "81%" },
    { title: "CSS Grid vs Flexbox", views: 2785, engagement: "79%" }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your blog performance and engagement metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className={`h-3 w-3 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Most viewed posts this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.views.toLocaleString()} views
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-sm font-medium text-green-600">
                      {post.engagement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Visitor statistics for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { day: "Monday", views: 3420 },
                { day: "Tuesday", views: 3680 },
                { day: "Wednesday", views: 4120 },
                { day: "Thursday", views: 3890 },
                { day: "Friday", views: 4340 },
                { day: "Saturday", views: 2980 },
                { day: "Sunday", views: 2150 }
              ].map((data) => (
                <div key={data.day} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-muted-foreground">
                    {data.day}
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-muted rounded-md overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-md transition-all"
                        style={{ width: `${(data.views / 4340) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-sm font-medium text-right">
                    {data.views.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
