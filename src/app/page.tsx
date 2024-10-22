"use client"

import { useState } from 'react'
import { CalendarIcon, Zap, DollarSign, Clock, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Mock data for the charts
const data = [
  { time: '00:00', usage: 2, cost: 0.24, solar: 0 },
  { time: '03:00', usage: 1.5, cost: 0.15, solar: 0 },
  { time: '06:00', usage: 3, cost: 0.45, solar: 0.5 },
  { time: '09:00', usage: 5, cost: 0.75, solar: 2 },
  { time: '12:00', usage: 4, cost: 0.60, solar: 3 },
  { time: '15:00', usage: 4.5, cost: 0.68, solar: 2.5 },
  { time: '18:00', usage: 6, cost: 1.20, solar: 1 },
  { time: '21:00', usage: 3.5, cost: 0.53, solar: 0 },
]

const tasks = [
  { name: 'Laundry', type: 'high' },
  { name: 'Dishwasher', type: 'medium' },
  { name: 'Charging Electric Vehicle', type: 'high' },
  { name: 'Computer Work', type: 'low' },
  { name: 'Cooking', type: 'medium' },
]

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0)
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0)
  const totalSolar = data.reduce((sum, item) => sum + item.solar, 0)
  const averageUsage = totalUsage / data.length
  
  const findIdealTime = (taskType: string) => {
    const sortedData = [...data].sort((a, b) => {
      const aEfficiency = (a.solar - a.usage) / a.cost
      const bEfficiency = (b.solar - b.usage) / b.cost
      return bEfficiency - aEfficiency
    })

    const usageThresholds = { low: 2, medium: 4, high: Infinity }
    return sortedData.find(item => item.usage <= usageThresholds[taskType as keyof typeof usageThresholds])
  }

  const idealTimes = tasks.reduce((acc, task) => {
    const idealTime = findIdealTime(task.type)
    if (idealTime && !acc.some(item => item.time === idealTime.time)) {
      acc.push({ ...idealTime, taskName: task.name, taskType: task.type })
    }
    return acc
  }, [] as Array<typeof data[0] & { taskName: string, taskType: string }>)

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enhanced Power Consumption Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? selectedDate.toDateString() : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Electricity Usage and Solar Production</CardTitle>
            <CardDescription>Kilowatt-hours (kWh) used and produced throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                usage: {
                  label: "Usage (kWh)",
                  color: "hsl(var(--chart-1))",
                },
                solar: {
                  label: "Solar (kWh)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="usage" stroke="var(--color-usage)" name="Usage (kWh)" />
                  <Line type="monotone" dataKey="solar" stroke="var(--color-solar)" name="Solar (kWh)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Electricity Cost</CardTitle>
            <CardDescription>Cost in dollars throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                cost: {
                  label: "Cost ($)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="cost" stroke="var(--color-cost)" name="Cost ($)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage.toFixed(2)} kWh</div>
            <p className="text-xs text-muted-foreground">For the selected day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For the selected day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageUsage.toFixed(2)} kWh</div>
            <p className="text-xs text-muted-foreground">Per 3-hour period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solar</CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSolar.toFixed(2)} kWh</div>
            <p className="text-xs text-muted-foreground">For the selected day</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ideal Times for Tasks</CardTitle>
          <CardDescription>Based on usage type, solar production, and cost</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {idealTimes.map((idealTime, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold">{idealTime.taskName} ({idealTime.taskType} usage)</p>
                  <p className="text-sm text-muted-foreground">
                    Ideal time: {idealTime.time} | Cost: ${idealTime.cost.toFixed(2)} | 
                    Usage: {idealTime.usage.toFixed(2)} kWh | Solar: {idealTime.solar.toFixed(2)} kWh
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}