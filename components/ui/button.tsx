import * as React from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center font-extrabold uppercase tracking-wider whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px] cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-[#FFC700] text-black hover:brightness-105 active:scale-97',
        outline:
          'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-muted dark:text-foreground',
        secondary:
          'bg-neutral-900 text-[#FFC700] hover:bg-neutral-800 active:scale-97',
        ghost:
          'hover:bg-neutral-100 hover:text-foreground dark:hover:bg-muted/50 text-neutral-700 font-medium normal-case tracking-normal',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 active:scale-97',
        link: 'text-neutral-900 underline-offset-4 hover:underline normal-case tracking-normal font-medium',
      },
      size: {
        default: 'h-9 px-5 text-xs gap-1.5',
        xs: 'h-6 px-2.5 text-[10px] gap-1',
        sm: 'h-7 px-3 text-[11px] gap-1.5',
        lg: 'h-11 px-7 text-sm gap-2',
        icon: 'size-8 p-0 justify-center',
        'icon-xs': 'size-6 p-0 justify-center',
        'icon-sm': 'size-7 p-0 justify-center',
        'icon-lg': 'size-9 p-0 justify-center',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(buttonVariants({ variant, size, className }), (children.props as any).className),
      ...props,
    })
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(props as any)}
    >
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
