# Implementation Guide for Remaining Components

This document provides complete code for all remaining components and pages.

## Table of Contents
1. [Additional shadcn-ui Components](#additional-shadcn-ui-components)
2. [Scoreboard Components](#scoreboard-components)
3. [Admin Dashboard Components](#admin-dashboard-components)
4. [Team Dashboard Components](#team-dashboard-components)
5. [Form Components](#form-components)
6. [Layout Components](#layout-components)

---

## Additional shadcn-ui Components

### Badge Component
```tsx
// src/components/ui/badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 glow-cyan",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 glow-magenta",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-[#00ff88] text-black",
        warning: "border-transparent bg-[#ffaa00] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### Table Component
```tsx
// src/components/ui/table.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-primary/30", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-primary/20 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-primary [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
}
```

### Dialog Component
```tsx
// src/components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg terminal-border",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight neon-text-cyan",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

---

## Scoreboard Components

### ScoreboardPage (Complete)
```tsx
// src/pages/public/ScoreboardPage.tsx
import { useEffect } from 'react';
import { useScoreboardStore } from '@/stores/scoreboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, RefreshCw, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScoreboardPage() {
  const { scoreboard, isLoading, autoRefresh, fetchScoreboard, setAutoRefresh } = useScoreboardStore();

  useEffect(() => {
    fetchScoreboard();
  }, [fetchScoreboard]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchScoreboard();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchScoreboard]);

  const top3 = scoreboard?.teams.slice(0, 3) || [];
  const allTeams = scoreboard?.teams || [];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_50%)] animate-pulse pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,0,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,0,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-display neon-text-cyan mb-2">⚔️ SCOREBOARD</h1>
            <div className="flex items-center gap-4 font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Tick: {scoreboard?.current_tick || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="font-mono"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </Button>
            <Button
              onClick={() => fetchScoreboard()}
              disabled={isLoading}
              className="font-mono"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top 3 Podium */}
        {top3.length >= 3 && (
          <div className="mb-12 flex justify-center items-end gap-4">
            {/* Second Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <Card className="w-48 h-32 glass-strong border-[#C0C0C0] flex flex-col items-center justify-center">
                <Trophy className="w-12 h-12 text-[#C0C0C0] mb-2" />
                <CardTitle className="text-2xl font-display">#2</CardTitle>
              </Card>
              <div className="mt-4 text-center">
                <h3 className="font-display text-xl text-[#C0C0C0]">{top3[1].name}</h3>
                <p className="font-mono text-2xl neon-text-cyan">{top3[1].score}</p>
              </div>
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <Card className="w-56 h-48 glass-strong border-[#FFD700] glow-yellow flex flex-col items-center justify-center">
                <Trophy className="w-16 h-16 text-[#FFD700] mb-2" />
                <CardTitle className="text-3xl font-display">#1</CardTitle>
              </Card>
              <div className="mt-4 text-center">
                <h3 className="font-display text-2xl text-[#FFD700]">{top3[0].name}</h3>
                <p className="font-mono text-3xl neon-text-yellow">{top3[0].score}</p>
              </div>
            </motion.div>

            {/* Third Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <Card className="w-48 h-24 glass-strong border-[#CD7F32] flex flex-col items-center justify-center">
                <Trophy className="w-10 h-10 text-[#CD7F32] mb-2" />
                <CardTitle className="text-xl font-display">#3</CardTitle>
              </Card>
              <div className="mt-4 text-center">
                <h3 className="font-display text-lg text-[#CD7F32]">{top3[2].name}</h3>
                <p className="font-mono text-xl neon-text-cyan">{top3[2].score}</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Full Scoreboard Table */}
        <Card className="terminal-border">
          <CardHeader>
            <CardTitle className="text-2xl font-display neon-text-cyan">Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Attack</TableHead>
                  <TableHead className="text-right">Defense</TableHead>
                  <TableHead className="text-right">SLA</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Flags ↑↓</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTeams.map((team, index) => (
                  <motion.tr
                    key={team.team_id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-primary/20 hover:bg-primary/5"
                  >
                    <TableCell className="font-mono font-bold">
                      {team.rank <= 3 ? (
                        <Badge variant={team.rank === 1 ? "default" : "outline"}>
                          #{team.rank}
                        </Badge>
                      ) : (
                        `#${team.rank}`
                      )}
                    </TableCell>
                    <TableCell className="font-display">{team.name}</TableCell>
                    <TableCell className="text-right font-mono text-[#ff00ff]">
                      {team.attack_points}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#00ff88]">
                      {team.defense_points}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#ffaa00]">
                      {team.sla_points}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold neon-text-cyan text-lg">
                      {team.score}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      <span className="text-[#00ff88]">↑{team.flags_captured}</span>
                      {' / '}
                      <span className="text-destructive">↓{team.flags_lost}</span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Last Updated */}
        {scoreboard?.lastUpdated && (
          <div className="mt-4 text-center text-sm text-muted-foreground font-mono">
            Last updated: {new Date(scoreboard.lastUpdated).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Installation Commands for Missing Dependencies

Before implementing the above components, install these dependencies:

```bash
npm install @radix-ui/react-dialog
```

---

## Next Implementation Steps

1. Install missing Radix UI components
2. Implement the Scoreboard page with the code above
3. Create Admin Dashboard pages
4. Create Team Dashboard pages
5. Add forms with React Hook Form + Zod validation
6. Implement file upload components
7. Add toast notifications with sonner

This guide provides the foundation. Each component can be copy-pasted into the respective file locations.
