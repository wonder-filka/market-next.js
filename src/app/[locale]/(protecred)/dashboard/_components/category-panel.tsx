'use client'

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { fakeCategories, popular } from "../_actions/constants"


export function CategoryPanel() {


  return (
     <div className="border rounded-md p-4 bg-background space-y-6">
      <h2 className="text-xl font-semibold">Активно торгуемые рынки</h2>

      <div className="space-y-3">
        {fakeCategories.map((cat) => (
          <div key={cat.name}>
            <div className="flex justify-between text-sm mb-1">
              <span>{cat.name}</span>
              <span className="text-muted-foreground">{cat.value}%</span>
            </div>
            <Progress value={cat.value} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Самые популярные в категории Акции
        </h3>
        <div className="flex flex-wrap gap-2">
          {popular["Акции"].map((symbol) => (
            <Badge
              key={symbol}
              variant="outline"
              className="cursor-pointer px-3 py-1 rounded-full border"
            >
              {symbol}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
