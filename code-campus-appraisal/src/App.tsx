import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import {
  Building2,
  ClipboardCheck,
  Gauge,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const criteria = [
  { id: "leadership", label: "Leadership & strategic direction" },
  { id: "engagement", label: "Board participation & engagement" },
  { id: "governance", label: "Governance & compliance adherence" },
  { id: "ethics", label: "Ethical judgment & integrity" },
  { id: "collaboration", label: "Collaboration with executive team" },
] as const

type CriterionId = (typeof criteria)[number]["id"]
type ScoreState = Record<CriterionId, string>

type AppraisalPayload = {
  memberName: string
  memberRole: string
  reviewerName: string
  appraisalPeriod: string
  scores: Record<CriterionId, number>
  averageScore: number
  keyContributions: string
  improvementPriorities: string
  recommendation: "retain" | "expand" | "development" | "review"
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/appraisals"

function App() {
  const [scores, setScores] = useState<ScoreState>({
    leadership: "",
    engagement: "",
    governance: "",
    ethics: "",
    collaboration: "",
  })

  const [recommendation, setRecommendation] = useState<AppraisalPayload["recommendation"]>("retain")
  const [submitted, setSubmitted] = useState(false)
  const [memberName, setMemberName] = useState("")
  const [memberRole, setMemberRole] = useState("")
  const [reviewerName, setReviewerName] = useState("")
  const [appraisalPeriod, setAppraisalPeriod] = useState("")
  const [keyContributions, setKeyContributions] = useState("")
  const [improvementPriorities, setImprovementPriorities] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const averageScore = useMemo(() => {
    const values = Object.values(scores)
      .map((score) => Number(score))
      .filter((value) => Number.isFinite(value) && value > 0)

    if (values.length === 0) return "0.0"

    return (values.reduce((total, value) => total + value, 0) / values.length).toFixed(1)
  }, [scores])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage("")

    const hasMissingScores = Object.values(scores).some((score) => score === "")
    if (hasMissingScores) {
      setErrorMessage("Please score all performance criteria before submitting.")
      return
    }

    const numericScores = Object.fromEntries(
      Object.entries(scores).map(([key, value]) => [key, Number(value)]),
    ) as Record<CriterionId, number>

    const values = Object.values(numericScores)
    const payload: AppraisalPayload = {
      memberName,
      memberRole,
      reviewerName,
      appraisalPeriod,
      scores: numericScores,
      averageScore: Number((values.reduce((total, value) => total + value, 0) / values.length).toFixed(1)),
      keyContributions,
      improvementPriorities,
      recommendation,
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error ?? result?.message ?? "Failed to submit appraisal")
      }

      setSubmitted(true)
    } catch (error) {
      setSubmitted(false)
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error while submitting appraisal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <Card className="border-white/60 bg-card/95 backdrop-blur-sm">
        <CardHeader className="gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-secondary/70 px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground">
            <Building2 className="size-3.5" />
            Code Campus
          </div>
          <CardTitle className="text-2xl md:text-3xl">
            Board Member Appraisal Form
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Complete this evaluation to document board performance, governance impact, and growth priorities.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-8" onSubmit={onSubmit}>
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Users className="size-4" />
                Member Information
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Board Member Name</Label>
                  <Input
                    id="member-name"
                    placeholder="Enter full name"
                    required
                    value={memberName}
                    onChange={(event) => setMemberName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">Board Role</Label>
                  <Input
                    id="member-role"
                    placeholder="e.g. Chair, Treasurer"
                    required
                    value={memberRole}
                    onChange={(event) => setMemberRole(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewer">Reviewer Name</Label>
                  <Input
                    id="reviewer"
                    placeholder="Who is submitting?"
                    required
                    value={reviewerName}
                    onChange={(event) => setReviewerName(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Appraisal Period</Label>
                  <Input
                    id="period"
                    placeholder="e.g. Q1 2026"
                    required
                    value={appraisalPeriod}
                    onChange={(event) => setAppraisalPeriod(event.target.value)}
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Gauge className="size-4" />
                Performance Scoring (1-5)
              </h2>
              <div className="grid gap-3">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="grid items-center gap-3 rounded-lg border bg-background/70 p-3 md:grid-cols-[1fr_180px]">
                    <Label htmlFor={criterion.id} className="leading-relaxed">{criterion.label}</Label>
                    <Select
                      value={scores[criterion.id]}
                      onValueChange={(value) => setScores((previous) => ({ ...previous, [criterion.id]: value }))}
                    >
                      <SelectTrigger id={criterion.id} className="w-full">
                        <SelectValue placeholder="Select score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Needs major improvement</SelectItem>
                        <SelectItem value="2">2 - Developing</SelectItem>
                        <SelectItem value="3">3 - Meets expectations</SelectItem>
                        <SelectItem value="4">4 - Strong performance</SelectItem>
                        <SelectItem value="5">5 - Exceptional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-accent/40 p-3 text-sm">
                Current average score: <span className="font-semibold">{averageScore}</span> / 5
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ClipboardCheck className="size-4" />
                Qualitative Assessment
              </h2>
              <div className="space-y-2">
                <Label htmlFor="wins">Key contributions and wins</Label>
                <Textarea
                  id="wins"
                  placeholder="Describe impact, decisions, and measurable outcomes..."
                  required
                  value={keyContributions}
                  onChange={(event) => setKeyContributions(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="improve">Improvement priorities</Label>
                <Textarea
                  id="improve"
                  placeholder="List growth areas and support needed..."
                  required
                  value={improvementPriorities}
                  onChange={(event) => setImprovementPriorities(event.target.value)}
                />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-4" />
                Final Recommendation
              </h2>
              <RadioGroup
                value={recommendation}
                onValueChange={(value) => setRecommendation(value as AppraisalPayload["recommendation"])}
                className="grid gap-3 md:grid-cols-2"
              >
                {[
                  { value: "retain", label: "Retain current role" },
                  { value: "expand", label: "Expand responsibilities" },
                  { value: "development", label: "Retain with development plan" },
                  { value: "review", label: "Further board review required" },
                ].map((option) => (
                  <Label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-background/70 p-3">
                    <RadioGroupItem value={option.value} />
                    {option.label}
                  </Label>
                ))}
              </RadioGroup>
            </section>

            {errorMessage && (
              <p className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="size-3.5" />
                Form is built for annual and quarterly board reviews.
              </p>
              <Button type="submit" size="lg" className="gap-2" disabled={isSubmitting}>
                <Send className="size-4" />
                {isSubmitting ? "Submitting..." : "Submit Appraisal"}
              </Button>
            </div>
          </form>
        </CardContent>

        {submitted && (
          <CardFooter>
            <p className="text-sm">
              Appraisal submitted for <span className="font-semibold">{memberName || "board member"}</span>.
              Recommendation: <span className="font-semibold capitalize">{recommendation}</span>.
            </p>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}

export default App
