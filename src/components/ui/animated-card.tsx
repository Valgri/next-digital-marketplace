"use client";

import { motion, MotionProps } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

type AnimatedCardMotionProps = Omit<MotionProps, "ref">;

export function AnimatedCard({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedCardProps & AnimatedCardMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "cursor-pointer hover:bg-muted/50 transition-all duration-200 shadow-sm hover:shadow-md border-primary/10",
        className
      )}
      {...props} // Передаем только разрешенные пропсы
    >
      {children}
    </motion.div>
  );
}