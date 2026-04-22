import { motion, type HTMLMotionProps, type Transition } from "framer-motion";
import * as React from "react";
import { cn } from "../../lib/utils";

type RevealSectionProps = HTMLMotionProps<"section"> & {
    delay?: number;
    duration?: number;
    offsetY?: number;
};

export const RevealSection = React.forwardRef<HTMLElement, RevealSectionProps>(
    (
        {
            className,
            delay = 0,
            duration = 0.4,
            offsetY = 30,
            transition,
            children,
            ...props
        },
        ref
    ) => {
        const transitionOverrides: Transition =
            transition && typeof transition === "object" ? transition : {};

        return (
            <motion.section
                ref={ref}
                initial={{ opacity: 0, y: offsetY }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration, delay, ...transitionOverrides }}
                className={cn("space-y-6", className)}
                {...props}
            >
                {children}
            </motion.section>
        );
    }
);

RevealSection.displayName = "RevealSection";
