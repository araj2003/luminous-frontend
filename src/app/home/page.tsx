"use client"

import { useState, useMemo } from 'react'
import { CalendarIcon, Zap, DollarSign, Clock, Sun, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, Cell, AreaChart, Area } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Enhanced mock data for the charts
const data = [
  { time: '00:00', usage: 2, cost: 0.24, solar: 0, efficiency: 0.2, capacity: 5 },
  { time: '02:00', usage: 1.5, cost: 0.18, solar: 0, efficiency: 0.3, capacity: 5 },
  { time: '04:00', usage: 1, cost: 0.12, solar: 0, efficiency: 0.4, capacity: 5 },
  { time: '06:00', usage: 3, cost: 0.45, solar: 0.5, efficiency: 0.5, capacity: 6 },
  { time: '08:00', usage: 4, cost: 0.60, solar: 1.5, efficiency: 0.6, capacity: 6 },
  { time: '10:00', usage: 5, cost: 0.75, solar: 2.5, efficiency: 0.7, capacity: 7 },
  { time: '12:00', usage: 4, cost: 0.60, solar: 3, efficiency: 0.8, capacity: 7 },
  { time: '14:00', usage: 4.5, cost: 0.68, solar: 2.5, efficiency: 0.75, capacity: 7 },
  { time: '16:00', usage: 5, cost: 0.75, solar: 2, efficiency: 0.7, capacity: 6 },
  { time: '18:00', usage: 6, cost: 1.20, solar: 1, efficiency: 0.5, capacity: 6 },
  { time: '20:00', usage: 4, cost: 0.80, solar: 0.2, efficiency: 0.4, capacity: 5 },
  { time: '22:00', usage: 3.5, cost: 0.53, solar: 0, efficiency: 0.3, capacity: 5 },
]

// Enhanced task list with usage values
const tasks = [
  { name: 'Laundry', type: 'high', usage: 4 },
  { name: 'Dishwasher', type: 'medium', usage: 3 },
  { name: 'Charging Electric Vehicle', type: 'high', usage: 5 },
  { name: 'Computer Work', type: 'low', usage: 1 },
  { name: 'Cooking', type: 'medium', usage: 3 },
  { name: 'Air Conditioning', type: 'high', usage: 4 },
  { name: 'Water Heater', type: 'medium', usage: 3 },
  { name: 'Home Entertainment', type: 'low', usage: 2 },
  { name: 'Lighting', type: 'low', usage: 1 },
  { name: 'Pool Pump', type: 'medium', usage: 3 },
]

const getColor = (ratio: number) => {
  if (ratio <= 0.33) return 'hsl(var(--chart-1))'
  if (ratio <= 0.66) return 'hsl(var(--chart-2))'
  return 'hsl(var(--chart-3))'  
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [scheduledTasks, setScheduledTasks] = useState<Array<{ time: string, task: string }>>([])

  const totalUsage = data.reduce((sum, item) => sum + (item.usage || 0), 0)
  const totalCost = data.reduce((sum, item) => sum + (item.cost || 0), 0)
  const totalSolar = data.reduce((sum, item) => sum + (item.solar || 0), 0)
  const averageUsage = totalUsage / (data.length || 1)
  
  const efficiencyData = useMemo(() => {
    return data.map(item => ({
      ...item,
      color: getColor(item.efficiency)
    }))
  }, [])

  const allocateTasks = () => {
    const sortedTasks = [...tasks].sort((a, b) => b.usage - a.usage)
    const sortedSlots = [...efficiencyData].sort((a, b) => b.efficiency - a.efficiency)
    const allocatedTasks: { time: string, tasks: typeof tasks }[] = []

    sortedSlots.forEach(slot => {
      const slotTasks: typeof tasks = []
      let remainingCapacity = slot.capacity

      sortedTasks.forEach(task => {
        if (task.usage <= remainingCapacity) {
          slotTasks.push(task)
          remainingCapacity -= task.usage
          sortedTasks.splice(sortedTasks.indexOf(task), 1)
        }
      })

      if (slotTasks.length > 0) {
        allocatedTasks.push({ time: slot.time, tasks: slotTasks })
      }
    })

    return allocatedTasks
  }

  const idealTimes = allocateTasks()

  const handleScheduleTask = (time: string, task: string) => {
    setScheduledTasks([...scheduledTasks, { time, task }])
  }

  return (
    <div className="container mx-auto p-4 bg-background">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Advanced Power Consumption Dashboard</h1>
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
              onSelect={(date) => setSelectedDate(date || undefined)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
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
            <p className="text-xs text-muted-foreground">Per 2-hour period</p>
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
                capacity: {
                  label: "Capacity (kWh)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area type="monotone" dataKey="usage" stackId="1" stroke="var(--color-usage)" fill="var(--color-usage)" fillOpacity={0.3} name="Usage (kWh)" />
                  <Area type="monotone" dataKey="solar" stackId="2" stroke="var(--color-solar)" fill="var(--color-solar)" fillOpacity={0.3} name="Solar (kWh)" />
                  <Line type="monotone" dataKey="capacity" stroke="var(--color-capacity)" name="Capacity (kWh)" />
                </AreaChart>
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

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Score</CardTitle>
            <CardDescription>Based on usage, cost, and solar production</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
            config={
                {
                    efficiency: {
                    label: "Efficiency",
                    color: "hsl(var(--chart-3))",
            }}}
            className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="category" dataKey="time" name="Time" />
                  <YAxis type="number" dataKey="efficiency" name="Efficiency" domain={[0, 1]} />
                  <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                  <Scatter data={efficiencyData} fill="#8884d8">
                    {efficiencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimal Task Schedule</CardTitle>
            <CardDescription>Based on efficiency, capacity, and task usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {idealTimes.map((slot, index) => (
                <div key={index} className="bg-secondary p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold">Time: {slot.time}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedSlot(slot.time)}>
                          Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          
                          <DialogTitle>Schedule Tasks</DialogTitle>
                          <DialogDescription>
                            Choose tasks and set the time for the selected slot.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">
                              Time
                            </Label>
                            <Input
                              id="time"
                              defaultValue={selectedSlot || ""}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tasks" className="text-right">
                              Tasks
                            </Label>
                            <Select onValueChange={(value) => handleScheduleTask(selectedSlot || "", value)}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select tasks" />
                              </SelectTrigger>
                              <SelectContent>
                                {tasks.map((task, taskIndex) => (
                                  <SelectItem key={taskIndex} value={task.name}>
                                    {task.name} ({task.usage} kWh)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="alternate-slots" className="text-right">
                              Alternate Slots
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select alternate slot" />
                              </SelectTrigger>
                              <SelectContent>
                                {data.map((timeSlot, slotIndex) => (
                                  <SelectItem key={slotIndex} value={timeSlot.time}>
                                    {timeSlot.time} (Efficiency: {timeSlot.efficiency.toFixed(2)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button type="submit">Save changes</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {slot.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor(efficiencyData.find(d => d.time === slot.time)?.efficiency || 0) }}></div>
                        <p>{task.name} ({task.usage} kWh)</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
          <CardDescription>Overview of all scheduled tasks for the day</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledTasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {scheduledTasks.map((scheduledTask, index) => (
                <div key={index} className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{scheduledTask.task}</p>
                      <p className="text-sm text-muted-foreground">Scheduled for: {scheduledTask.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Efficiency Color Guide</CardTitle>
          <CardDescription>Interpretation of efficiency scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-1))]"></div>
            <p>Low Efficiency (0-0.33): High usage, low solar production, or high cost</p>
          </div>
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-2))]"></div>
            <p>Medium Efficiency (0.34-0.66): Balanced usage, solar production, and cost</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 rounded-full bg-[hsl(var(--chart-3))]"></div>
            <p>High Efficiency (0.67-1): Low usage, high solar production, or low cost</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}