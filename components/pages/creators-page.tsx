"use client"

import Image from "next/image"
import { Code2, Rocket, Sparkles } from "lucide-react"

type Creator = {
  name: string
  image: string
  focus: string
  note: string
}

const creators: Creator[] = [
  {
    name: "Gokul R S",
    image: "/creators/gokul-r-s.png",
    focus: "Full Stack Development",
    note: "Builds app flows end-to-end and loves turning ideas into working products.",
  },
  {
    name: "Joseph John",
    image: "/creators/joseph-john.png",
    focus: "Frontend Engineering",
    note: "Focuses on clean UI, user experience, and polished interactions across devices.",
  },
  {
    name: "Joyal Aliyas",
    image: "/creators/joyal-aliyas.jpg",
    focus: "Backend and Data",
    note: "Works on APIs, data handling, and keeping core app features reliable.",
  },
]

export function CreatorsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Creators</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              We are 2nd year Computer Science students at ASIET, driven by passion to build useful software.
              We love learning by shipping real products that solve practical problems.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {creators.map((creator) => (
          <article key={creator.name} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="relative aspect-[4/5] w-full bg-secondary/30">
              <Image src={creator.image} alt={creator.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className="space-y-2 p-4">
              <h2 className="text-lg font-semibold text-foreground">{creator.name}</h2>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <Code2 className="h-4 w-4" />
                {creator.focus}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">{creator.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Rocket className="h-4 w-4 text-primary" />
          Built with passion by ASIET CS students who enjoy creating and improving things every day.
        </p>
      </div>
    </div>
  )
}