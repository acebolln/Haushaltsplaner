"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Haushaltsplaner Button Component
 * Design System: Pink Pill (Primary) | Outline (Secondary) | Ghost
 * Based on Appvantage Brand Guidelines
 */

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary - Pink Pill (font-weight 700)
        default: "bg-primary text-primary-foreground border-transparent font-bold hover:bg-[var(--accent-hover)] shadow-sm",

        // Secondary - Outline
        outline:
          "border-border bg-background text-foreground font-light hover:border-accent hover:text-accent aria-expanded:border-accent aria-expanded:text-accent",

        // Ghost
        ghost:
          "border-transparent bg-transparent text-foreground font-light hover:bg-muted hover:text-foreground aria-expanded:bg-muted",

        // Destructive
        destructive:
          "bg-destructive text-destructive-foreground border-transparent font-bold hover:bg-destructive/90 shadow-sm",

        // Link
        link: "text-accent border-transparent underline-offset-4 hover:underline font-light",
      },
      size: {
        default:
          "h-10 px-6 text-base", // 1rem = 18px desktop / 16px mobile
        sm: "h-8 px-4 text-sm", // 0.875rem
        lg: "h-12 px-8 text-lg", // 1.125rem
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
