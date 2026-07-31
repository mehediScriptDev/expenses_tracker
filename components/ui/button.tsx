import * as React from 'react'
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonHover =
  'hover:bg-[#171717] hover:text-white hover:border-[#171717] [&_svg]:transition-colors [&_svg]:duration-200 hover:[&_svg]:text-white'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center font-extrabold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 ease-in-out outline-none select-none disabled:pointer-events-none disabled:opacity-50 rounded-tl-[4px] rounded-tr-[12px] rounded-br-none rounded-bl-[14px] cursor-pointer',
  {
    variants: {
      variant: {
        default: cn('bg-[#FFC700] text-black border border-transparent', buttonHover),
        outline: cn('border border-neutral-300 bg-white text-neutral-800', buttonHover),
        secondary: cn('bg-neutral-900 text-[#FFC700] border border-transparent', buttonHover),
        ghost: cn(
          'border border-transparent text-neutral-700 font-medium normal-case tracking-normal',
          buttonHover,
        ),
        destructive: cn('bg-red-500 text-white border border-transparent', buttonHover),
        link: 'border-transparent text-neutral-900 underline-offset-4 hover:text-[#171717] hover:underline normal-case tracking-normal font-medium bg-transparent',
        dash: cn(
          'bg-[#FFC700] text-black border border-transparent font-semibold normal-case tracking-normal',
          buttonHover,
        ),
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
